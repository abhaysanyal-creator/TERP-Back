import { TimeSlot } from "./../types/interface.types";
import { Schema, model } from "mongoose";
import { Room } from "../types/interface.types";

const timeSlotSchema: Schema<TimeSlot> = new Schema(
  {
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
  },
  {
    _id: false,
  }
);

const bookingSlotSchema = new Schema(
  {
    day: { type: Number },
    slots: timeSlotSchema,
    booking_id: { type: Schema.Types.ObjectId },
  },
  {
    _id: false,
  }
);

export const roomsSchema: Schema<Room> = new Schema(
  {
    clinic_id: { type: Schema.Types.ObjectId, ref: "clinics", required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "employees", required: true },
    room_type: { type: String, required: true },
    room_size: { type: Number, required: true },
    bookings: [bookingSlotSchema],
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const roomModel = model<Room>("rooms", roomsSchema, "rooms");

export default roomModel;
