import { Schema, model } from "mongoose";
import enums from "../enums.json";
import { Bookings } from "../types/interface.types";

const bookingsSchema: Schema<Bookings> = new Schema(
  {
    clinic_id: { type: Schema.Types.ObjectId, ref: "clinics", required: true },
    room_id: { type: Schema.Types.ObjectId, ref: "rooms", required: true },
    therapist_id: {
      type: Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
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