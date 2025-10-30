import type { IUserPermission } from "../types/interface.types";
import mongoose, { Schema, model } from "mongoose";

const permissionSchema: Schema<IUserPermission> = new Schema(
  {
    name: { type: String, required: true },
    permissions: {
      type: [
        {
          _id: false,
          name: { type: String },
          permission: { type: String },
          module: { type: String },
          description: { type: String },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const permissionModel = model<IUserPermission>(
  "permissions",
  permissionSchema,
  "permissions"
);

export default permissionModel;
