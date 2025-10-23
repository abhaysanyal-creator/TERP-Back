import { Schema, model } from "mongoose";
import { Room } from "../types/interface.types";

const roomsSchema: Schema<Room> = new Schema(
  {
    clinic_id: { type: Schema.Types.ObjectId, ref: "clinics", required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "users", required: true },
    room_type: { type: String, required: true },
    room_size: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const roomModel = model<Room>("rooms", roomsSchema, "rooms");

export default roomModel;
