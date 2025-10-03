import mongoose, { Schema, model } from "mongoose";
import type { Role } from "../types/interface.types.js";

const roleSchema: Schema<Role> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: { type: [String], required: true, default: ["*"] },
  },
  { timestamps: true }
);

const roleModel = model<Role>("roles", roleSchema,"roles");

export default roleModel;
