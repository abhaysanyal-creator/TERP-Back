import { Schema, model } from "mongoose";

const roomsSchema = new Schema(
  {
    clinic_id: { type: Schema.Types.ObjectId, ref: "clinics", required: true },
    room_number: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
    current_booking: { type: Schema.Types.ObjectId, ref: "bookings" },
  },
  {
    timestamps: true,
  }
);
