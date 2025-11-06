import mongoose, { Schema, model } from "mongoose";
import enums from "../enums.json";

const metaDataSchema = new Schema(
  {
    type: { type: String, enum: enums.ListType, required: true },
    name: { type: String, required: true },
    value: { type: String },
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const metaDataModel = model("metadatas", metaDataSchema, "metadatas");

export default metaDataModel;
