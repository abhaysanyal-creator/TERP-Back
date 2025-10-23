import { Schema, model } from "mongoose";
import enums from "../enums.json";
import { Bookings, Therapists, WorkingHour } from "../types/interface.types";

const WorkingHourSchema = new Schema<WorkingHour>(
  {
    day: { type: String, required: true },
    startTime: { type: String, required: false, default: null },
    endTime: { type: String, required: false, default: null },
  },
  { _id: false }
);

const TherapistSchema: Schema<Therapists> = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "employees",
    },
    name: { type: String, required: true },
    employee_id: { type: String, required: true },
    specialisation: { type: String, required: true },
    working_hours: [WorkingHourSchema],
    organisation: { type: Schema.Types.ObjectId, required: true },
  },
  { _id: false }
);

const bookingsSchema: Schema<Bookings> = new Schema(
  {
    booking_id: { type: String, unique: true },
    clinic_id: { type: Schema.Types.ObjectId, ref: "clinics", required: true },
    room_id: { type: Schema.Types.ObjectId, ref: "rooms", required: true }, 
    therapist: TherapistSchema,
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: "patients",
      required: true,
    },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    status: {
      type: String,
      enum: enums.Booking_Status,
      default: "booked",
    },
    notes: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: "employees" },
  },
  {
    timestamps: true,
  }
);

const bookingsModel = model<Bookings>("bookings", bookingsSchema, "bookings");

export default bookingsModel;