import mongoose, { Schema, model } from "mongoose";
import type { OTP } from "../types/interface.types";



const otpSchema = new Schema<OTP>({
  userId: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const OtpModel = model<OTP>("otps", otpSchema, "otps");

export default OtpModel;