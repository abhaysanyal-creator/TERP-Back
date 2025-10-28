import mongoose, { Schema } from "mongoose";
import { ICityDocument } from "../types/reference.types";

const CitySchema = new Schema<ICityDocument>(
  {
    country: {
      _id: { type: Schema.Types.ObjectId, ref: "countries" },
      name: { type: String },
    },
    state: {
      _id: { type: Schema.Types.ObjectId, ref: "states" },
      name: { type: String },
    },
    name: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

export const City = mongoose.model<ICityDocument>("cities", CitySchema);
