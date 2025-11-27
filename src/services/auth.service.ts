import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {
  generateOTP,
  generateToken,
  ObjectId,
  saveOtp,
  verifyOtp,
} from "../utils/helpers";
import Constants from "../locales/constants";
import { sendOtpEmail } from "../utils/email.ses";
import { CostExplorer } from "aws-sdk";
import { badRequest } from "../response/response";
import { userModel } from "../models";

interface LoginPaylaod {
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const loginService = async (payload: LoginPaylaod) => {
  const { email, password } = payload;

  const [user, employee] = await Promise.all([
    mongoose.model("users").findOne({ email }).exec(),
    mongoose.model("employees").findOne({ email }).exec(),
  ]);

  if (!user && !employee) {
    throw new Error(Constants.MESSAGES.NOT_FOUND.code);
  }

  const result = user || employee;

  const passwordCompare = await bcrypt.compare(password, result.password);

  if (!passwordCompare) {
    throw new Error(Constants.MESSAGES.INVALID_PASSWORD.code);
  }

  const otp = generateOTP();
  saveOtp(result._id.toString(), otp);

  console.log(`OTP for user ${email}: ${otp}`);
  await sendOtpEmail(result.email, otp);

  return {
    message: "OTP sent. Please verify to complete login.",
    userId: result._id,
    otp,
  };
};

export const verifyOtpService = async (userId: string, otpInput: string, isMFA: boolean) => {
  try {
    const isValid = await verifyOtp(userId, otpInput);

    if (!isValid) {
      throw {
        status: 401,
        error: {
          code: Constants.MESSAGES.OTP_EXPIRED.code,
          message: Constants.MESSAGES.OTP_EXPIRED.message,
        },
      };
    }

    const [user, employee] = await Promise.all([
      mongoose
        .model("users")
        .findOne({ _id: ObjectId(userId) })
        .select("-password")
        .populate("role")
        .exec(),
      mongoose
        .model("employees")
        .findOne({ _id: ObjectId(userId) })
        .select("-password")
        .populate("role")
        .exec(),
    ]);

    if (!user && !employee) {
      throw new Error(Constants.MESSAGES.NOT_FOUND.code);
    }

    const result = user || employee;

    // const [user, employee] = await Promise.all([
    //   mongoose
    //     .model("users")
    //     .findOne({ _id: ObjectId(userId) })
    //     .select("-password")
    //     .populate("role")
    //     .exec(),
    //   mongoose
    //     .model("employees")
    //     .findOne({ _id: ObjectId(userId) })
    //     .select("-password")
    //     .populate("role")
    //     .exec(),
    // ]);

    // const result = employee || user;

    if (!result) {
      throw {
        status: 401,
        error: {
          code: Constants.MESSAGES.NOT_FOUND.code,
          message: Constants.MESSAGES.NOT_FOUND.message,
        },
      };
    }

    let token;
    let sessionId;
    if(isMFA){
      token = generateToken(
        { id: result._id.toString(), role: result.role, origin_service: "ERP" },
        JWT_SECRET,
        1296000
      );
    }else{
      sessionId = await bcrypt.hash(result._id.toString(), 10);
    }

    return {
      response: {
        code: Constants.MESSAGES.LOGIN_SUCCESS.code,
        message: Constants.MESSAGES.LOGIN_SUCCESS.message,
      },
      token,
      sessionId,
      result,
    };
  } catch (error) {
    throw error;
  }
};

export const getMeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [user, employee] = await Promise.all([
        mongoose
          .model("users")
          .findOne({ _id: ObjectId(payload.id) })
          .select("-password")
          .populate("role")
          .exec(),
        mongoose
          .model("employees")
          .findOne({ _id: ObjectId(payload.id) })
          .select("-password")
          .populate("role")
          .exec(),
      ]);

      if (!user && !employee) {
        throw new Error(Constants.MESSAGES.NOT_FOUND.code);
      }

      const result = user || employee;
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

export const resendOtpService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await mongoose.model("users").findOne({
        email: payload.email,
      });

      if (!user) {
        throw new Error(Constants.MESSAGES.NOT_FOUND.code);
      }

      const otpData = await mongoose
        .model("otps")
        .findOne({ userId: ObjectId(user._id) })
        .exec();

      if (!otpData || otpData.expiresAt < Date.now()) {
        const otp = generateOTP();
        saveOtp(user._id.toString(), otp);

        await sendOtpEmail(user.email, otp);
        console.log(`OTP resent for ${user.email}: ${otp}`);

        return resolve({
          message: "OTP sent. Please verify to complete login.",
          userId: user._id,
          otp,
        });
      }

      return reject(Constants.MESSAGES.OTP_TOO_EARLY.code);
    } catch (error) {
      reject(error);
    }
  });
};

export const forgotPasswordService = async (
  payload: Record<string, any>
): Promise<Record<string, any>> => new Promise(async (resolve, reject) => {
    try {
      const user = await userModel.findOne({
        email: payload.email,
      });

      if (!user) {
        throw new Error(Constants.MESSAGES.NOT_FOUND.code);
      }

      const otp = generateOTP();
      saveOtp(user._id.toString(), otp);

      console.log(`OTP for user ${payload.email}: ${otp}`);
      await sendOtpEmail(user.email, otp);

      return resolve({
        message: "OTP sent. Please verify to reset Password",
        userId: user._id,
      });
    } catch (error) {
      reject(error);
    }
  });

export const resetPasswordService = async (
  payload: Record<string, any>
): Promise<Record<string, any>> => new Promise(async (resolve, reject) => {
    try {

      const {session_id, password, email} = payload;
      const user = await userModel.findOne({
        email,
        is_deleted: false
      });

      if (!user) {
        throw new Error(Constants.MESSAGES.NOT_FOUND.code);
      }

      const isValidSession = await bcrypt.compare(user._id.toString(), session_id);
      
      if (!isValidSession) {
        throw new Error(Constants.MESSAGES.NO_TOKEN.code);
      }
      const encryptedPassword = await bcrypt.hash(password.toString(), 10);
      
      await userModel.findByIdAndUpdate(user._id, {password: encryptedPassword})

      return resolve({
        message: "Your Password has been reset",
      });
    } catch (error) {
      reject(error);
    }
  });
