import mongoose, { Schema } from "mongoose";
import { IDepartment } from "../types/interface.types";
import { addressSchema, contactSchema } from "./organisation.model";
import { TreatmentPricingSchema } from "./activity.model";

const DepartmentSchema = new Schema<IDepartment>(
  {
    organisation: {
      id: { type: Schema.Types.ObjectId, ref: "organisations" },
      name: { type: String },
      type: { type: String },
    },
    department_id: { type: String, required: true, unique: true },
    internal_code: { type: String, required: true, unique: true },
    department_name: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
    activities: [
      {
        _id: false,
        activity: {
          id: { type: Schema.Types.ObjectId },
          name: { type: String },
          type: { type: String },
        },
        treatment: [TreatmentPricingSchema],
      },
    ],
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
