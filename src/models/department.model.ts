import mongoose, { Schema } from "mongoose";
import { IDepartment } from "../types/interface.types";
import { addressSchema, contactSchema } from "./organisation.model";

const DepartmentSchema = new Schema<IDepartment>(
  {
    organisation: {
      id: { type: Schema.Types.ObjectId, ref: "organisations" },
      name: { type: String },
    },
    department_id: { type: String, required: true, unique: true },
    internal_code: { type: String, required: true, unique: true },
    department_name: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    address: addressSchema,
    contacts: [contactSchema],
  },
  {
    timestamps: true,
  }
);

export const departmentModel = mongoose.model<IDepartment>(
  "departments",
  DepartmentSchema,
  "departments"
);
