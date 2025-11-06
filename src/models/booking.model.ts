import { Schema, model } from "mongoose";
import enums from "../enums.json";
import {
  BookingDetails,
  Bookings,
  Therapists,
  TimeSlot,
  WorkingHour,
} from "../types/interface.types";

const timeSlotSchema: Schema<TimeSlot> = new Schema(
  {
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
  },
  {
    _id: false,
  }
);

const workingHourSchema = new Schema(
  {
    day: { type: Number, required: true },
    slots: [timeSlotSchema],
  },
  {
    _id: false,
  }
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
    working_hours: [workingHourSchema],
    organisation: { type: Schema.Types.ObjectId, required: true },
  },
  { _id: false }
);

const bookingDetailSchema: Schema<BookingDetails> = new Schema(
  {
    day: { type: Number, required: true },
    slots: {
      start_time: { type: Date, required: true },
      end_time: { type: Date, required: true },
    },
  },
  {
    _id: false,
  }
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
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    booking_details: bookingDetailSchema,
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
