import type { Permissions } from "../types/interface.types.js";
import mongoose, { Schema, model } from "mongoose";

const permissionSchema: Schema<Permissions> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const permissionModel = model<Permissions>(
  "permissions",
  permissionSchema,
  "permissions"
);

export default permissionModel;
