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

interface LoginPaylaod {
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const loginService = async (payload: LoginPaylaod) => {
  const { email, password } = payload;

  const user = await mongoose.model("users").findOne({ email: email }).exec();

  if (!user) {
    throw {
      status: 401,
      error: {
        code: Constants.MESSAGES.NOT_FOUND.code,
        message: Constants.MESSAGES.NOT_FOUND.message,
      },
    };
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw {
      status: 401,
      error: {
        code: Constants.MESSAGES.INVALID_PASSWORD.code,
        message: Constants.MESSAGES.INVALID_PASSWORD.message,
      },
    };
  }

  const otp = generateOTP();
  saveOtp(user._id.toString(), otp);

  console.log(`OTP for user ${email}: ${otp}`);
  await sendOtpEmail(user.email, otp);

  return {
    message: "OTP sent. Please verify to complete login.",
    userId: user._id,
    otp,
  };
};

export const verifyOtpService = async (userId: string, otpInput: string) => {
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

    const user = await mongoose
      .model("users")
      .findOne({ _id: ObjectId(userId) })
      .select("-password")
      .populate("role")
      .exec();

    if (!user) {
      throw {
        status: 401,
        error: {
          code: Constants.MESSAGES.NOT_FOUND.code,
          message: Constants.MESSAGES.NOT_FOUND.message,
        },
      };
    }

    const token = generateToken(
      { id: user._id.toString(), role: user.role, origin_service: "ERP" },
      JWT_SECRET,
      1296000
    );

    return {
      response: {
        code: Constants.MESSAGES.LOGIN_SUCCESS.code,
        message: Constants.MESSAGES.LOGIN_SUCCESS.message,
      },
      token,
      user,
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
      const user = await mongoose
        .model("users")
        .findOne({ _id: ObjectId(payload.id) })
        .select("-password")
        .populate("role")
        .exec();

      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};
