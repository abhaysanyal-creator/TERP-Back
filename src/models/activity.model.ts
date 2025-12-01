import mongoose, { model, Schema } from "mongoose";
import type {
  Activity,
  TreatmentPriceIndexing,
} from "../types/interface.types";
import enums from "../enums.json";

const TreatmentPricingSchema: Schema<TreatmentPriceIndexing> = new Schema({
  specialisation: {
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
  },
  organisation_cost: { type: String },
  platform_cost: { type: String },
  include_patient_cost: { type: Boolean, default: false },
  patient_cost: { type: String },
});

export const roomSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String, required: true },

    status: {
      type: String,
      enum: Object.values(enums.Room_Status),
      default: enums.Room_Status.AVAILABLE,
    },
    bookings: [
      {
        session_id: { type: String },
        therapist_id: { type: Schema.Types.ObjectId, ref: "employees" },
        patient_id: { type: Schema.Types.ObjectId, ref: "patients" },
        scheduled_date: { type: String, required: true },
        scheduled_start: { type: String, required: true },
        scheduled_end: { type: String, required: true },
        status: {
          type: String,
          enum: enums.Room_Status,
          default: "booked",
        },
      },
    ],
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  { _id: false }
);

export const expenseSchema = new Schema({
  expense_name: { type: String },
  category: { type: String, enum: enums.CostRecurrence },
  amount: { type: Number },
  is_deleted: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
});

const activitySchema: Schema<Activity> = new Schema({
  type: { type: String, enum: enums.ActivityType, required: true },
  activity_name: { type: String, required: true },
  organisation: {
    id: { type: Schema.Types.ObjectId, required: true, ref: "organisations" },
    name: { type: String, required: true },
  },
  department: {
    id: { type: Schema.Types.ObjectId, required: true, ref: "departments" },
    name: { type: String, required: true },
  },
  internal_code: { type: String, required: true, unique: true },
  is_deleted: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  clinics: [
    {
      id: Schema.Types.ObjectId,
      name: String,
      treatment: [TreatmentPricingSchema],
    },
  ],
});

const activityModel = model<Activity>(
  "activities",
  activitySchema,
  "activities"
);

export default activityModel;
