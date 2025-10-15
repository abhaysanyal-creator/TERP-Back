import { Schema, model } from "mongoose";
import type { Role } from "../types/interface.types.ts";

const roleSchema: Schema<Role> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: { type: [String], required: true },
  },
  { timestamps: true }
);

const roleModel = model<Role>("roles", roleSchema, "roles");

export default roleModel;
