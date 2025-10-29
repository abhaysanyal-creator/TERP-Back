import { Schema, model } from "mongoose";
import type { Role } from "../types/interface.types";

const roleSchema: Schema<Role> = new Schema(
  {
    role: { type: String, required: true, unique: true },
    permissions: {
      _id: false,
      type: [
        {
          name: { type: String },
          permission: { type: String },
          module: { type: String },
          description: { type: String },
          default: { type: Boolean, default: false },
        },
      ],
    },
  },
  { timestamps: true }
);

const roleModel = model<Role>("roles", roleSchema, "roles");

export default roleModel;
