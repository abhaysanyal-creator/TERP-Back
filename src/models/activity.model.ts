import mongoose, { model, Schema } from "mongoose";
import type {
  Activity,
  Address,
  IRoom,
  Therapists,
  TimeSlot,
  TreatmentPriceIndexing,
} from "../types/interface.types";
import enums from "../enums.json";
import { addressSchema, contactSchema } from "./organisation.model";

const TreatmentPricingSchema: Schema<TreatmentPriceIndexing> = new Schema({
  specialisation: {
    id: { type: Schema.Types.ObjectId },
    name: { type: String },
  },
  organisation_cost: { type: String },
  platform_cost: { type: String },
  include_patient_cost: { type: Boolean, default: false },
  patient_cost: { type: String },
});

const timeSlotSchema: Schema<TimeSlot> = new Schema(
  {
    id: { type: String },
    start_time: { type: String },
    end_time: { type: String },
  },
  {
    _id: false,
  }
);

const workingHourSchema = new Schema(
  {
    day: { type: Number },
    slots: [timeSlotSchema],
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

export const roomSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String },

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
        scheduled_date: { type: String },
        scheduled_start: { type: String },
        scheduled_end: { type: String },
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

const TherapistSchema: Schema<Therapists> = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: "employees",
    },
    name: { type: String },
    employee_id: { type: String },
    specialisation: { type: String },
    working_hours: [workingHourSchema],
    organisation: { type: Schema.Types.ObjectId, ref: "organisations" },
  },
  { _id: false }
);

const activitySchema: Schema<Activity> = new Schema({
  type: { type: String, enum: enums.ActivityType },
  activity_name: { type: String },
  organisation: {
    id: { type: Schema.Types.ObjectId, ref: "organisations" },
    name: { type: String },
  },
  department: {
    id: { type: Schema.Types.ObjectId, ref: "departments" },
    name: { type: String },
  },
  activity_id: { type: String, unique: true },
  internal_code: { type: String, unique: true },
  building_size: { type: Number },
  area_in: { type: String, enum: enums.AreaIn, default: enums.AreaIn.SQ_MTR },
  expenses: [expenseSchema],
  is_deleted: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  protected_space: { type: Boolean, default: true },
  contacts: [contactSchema],
  employees: [
    {
      id: { type: Schema.Types.ObjectId, ref: "employees" },
      name: { type: String },
      role: {
        id: { type: Schema.Types.ObjectId, ref: "roles" },
        name: { type: String },
      },
    },
  ],
  address: addressSchema,
  rooms: [roomSchema],
  operating_hours: [workingHourSchema],
  treatment: [TreatmentPricingSchema],
});

const activityModel = model<Activity>(
  "activities",
  activitySchema,
  "activities"
);

export default activityModel;
