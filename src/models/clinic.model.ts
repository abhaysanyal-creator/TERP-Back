import mongoose, { model, Schema } from "mongoose";
import type {
  Activity,
  Clinic,
  TimeSlot,
  TreatmentPriceIndexing,
} from "../types/interface.types";
import enums from "../enums.json";
import { addressSchema, contactSchema } from "./organisation.model";

const timeSlotSchema: Schema<TimeSlot> = new Schema(
  {
    id: { type: String },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const workingHourSchema = new Schema(
  {
    day: { type: Number, required: true },
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

const clinicSchema: Schema<Clinic> = new Schema({
  // type: { type: String, enum: enums.ActivityType, required: true },
  name: { type: String, required: true },
  organisation: {
    id: { type: Schema.Types.ObjectId, required: true, ref: "organisations" },
    name: { type: String, required: true },
  },
  // department: {
  //   id: { type: Schema.Types.ObjectId, required: true, ref: "departments" },
  //   name: { type: String, required: true },
  // },
  activities: [
    {
      id: { type: Schema.Types.ObjectId },
      name: { type: String },
    },
  ],
  employees: [
    {
      role: { id: { type: Schema.Types.ObjectId }, name: { type: String } },
      id: { type: Schema.Types.ObjectId },
      name: { type: String },
    },
  ],
  internal_code: { type: String, required: true, unique: true },
  building_size: { type: Number, required: true },
  area_in: { type: String, enum: enums.AreaIn, default: enums.AreaIn.SQ_MTR },
  expenses: [expenseSchema],
  is_deleted: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  protected_space: { type: Boolean, default: true },
  contacts: [contactSchema],
  address: addressSchema,
  rooms: [roomSchema],
  operating_hours: [workingHourSchema],
});

const clinicModel = model<Clinic>("clinics", clinicSchema, "clinics");

export default clinicModel;
