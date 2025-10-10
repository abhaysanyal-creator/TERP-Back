import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {
  generateOTP,
  generateToken,
  saveOtp,
  verifyOtp,
} from "../utils/helpers.js";
import { errorResponse } from "../response/response.js";
interface LoginPaylaod {
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const loginService = async (payload: LoginPaylaod) => {
  const { email, password } = payload;
  const user = await mongoose.model("users").findOne({ email: email }).exec();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw {
      status: 401,
      error: {
        code: "INVALID_PASSWORD",
        message: "Invalid password",
      },
    };
  }

  const otp = generateOTP();

  saveOtp(user._id.toString(), otp);

  console.log(`OTP for user ${email}: ${otp}`);

  return {
    message: "OTP sent. Please verify to complete login.",
    userId: user._id,
    otp: otp,
  };
};

export const verifyOtpService = async (userId: string, otpInput: string) => {
  try {
    const isValid = verifyOtp(userId, otpInput);
    if (!isValid) {
      throw {
        status: 401,
        error: {
          code: "OTP_EXPIRED",
          message: "Otp Expired!!",
        },
      };
    }

    const user = await mongoose.model("users").findById(userId).exec();
    if (!user) {
      throw {
        status: 401,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found!!",
        },
      };
    }

    const token = generateToken(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      1296000
    );

    return {
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
      },
      role: user.role,
    };
  } catch (error) {
    throw error;
  }
};
