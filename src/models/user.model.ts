import mongoose, { Schema, model } from "mongoose";
import type { User } from "../types/interface.types.js";

const userSchema: Schema<User> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
