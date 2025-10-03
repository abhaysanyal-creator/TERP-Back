import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { generateToken } from "../utils/helpers.js";

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

  const token = generateToken(
    { id: user._id.toString(), role: user.role },
    JWT_SECRET,
    1296000
  );

  return {
    message: "Login successfull!",
    token,
    userId: user._id,
    role: user.role,
  };
};
