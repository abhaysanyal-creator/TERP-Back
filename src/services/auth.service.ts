import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { generateOTP, generateToken, saveOtp, verifyOtp } from "../utils/helpers.js";
interface LoginPaylaod {
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const loginService = async (payload: LoginPaylaod) => {
  const { email, password } = payload;
  const user = await mongoose.model("users").findOne({ email: email }).exec();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid Credentials!!");
  }

  const otp = generateOTP();

  saveOtp(user._id.toString(), otp);

  console.log(`OTP for user ${email}: ${otp}`);

 return {
    message: "OTP sent. Please verify to complete login.",
    userId: user._id,
  };
};

export const verifyOtpService = async (userId: string, otpInput: string) => {
  try {
    const isValid = verifyOtp(userId, otpInput);
    if (!isValid) {
      throw new Error("OTP expired. Request login again!!");
    }

    const user = await mongoose.model("users").findById(userId).exec();
    if (!user) {
      throw new Error("User not found.");
    }

    const token = generateToken(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      1296000
    );

    return {
      message: "Login successful!",
      token,
      userId: user._id,
      role: user.role,
    };
  } catch (error) {
    throw error;
  }
};
