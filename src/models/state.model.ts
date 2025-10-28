import mongoose, { Schema } from "mongoose";
import { IStateDocument } from "../types/reference.types";

const StateSchema = new Schema<IStateDocument>(
  {
    country: {
      _id: { type: Schema.Types.ObjectId, ref: "countries" },
      name: { type: String },
    },
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

export const State = mongoose.model<IStateDocument>("states", StateSchema);
