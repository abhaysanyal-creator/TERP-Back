import mongoose, { Schema } from "mongoose";
import { ICountryDocument } from "../types/reference.types"

const CountrySchema = new Schema<ICountryDocument>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

export const Country = mongoose.model<ICountryDocument>(
  "countries",
  CountrySchema
);
