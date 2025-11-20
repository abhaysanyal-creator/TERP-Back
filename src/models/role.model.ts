import { Schema, model } from "mongoose";
import type { Role } from "../types/interface.types";

const roleSchema: Schema<Role> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    value:{type:String},
    permissions: [
      {
        _id: false,
        name: { type: String },
        permission: { type: String },
        module: { type: String },
        description: { type: String },
        default: { type: Boolean, default: false },
      },
    ],
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const roleModel = model<Role>("roles", roleSchema, "roles");

export default roleModel;
