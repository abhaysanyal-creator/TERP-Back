import mongoose, { Schema, model } from "mongoose";
import type { User } from "../types/interface.types.ts";

const userSchema: Schema<User> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    employee_id: { type: String },
    contact_number: { type: Number, required: true, unique: true },
    otp_code: { type: Number },
    otp_expires: { type: Date },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      required: true,
    },
  },
  { timestamps: true }
);

const userModel = model<User>("users", userSchema, "users");

export default userModel;
