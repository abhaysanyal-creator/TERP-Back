import { Schema, model } from "mongoose";
import type { EmpDocuments } from "../types/interface.types";

const documentSchema: Schema<EmpDocuments> = new Schema<EmpDocuments>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    type: { type: String, required: true },
    file_url: { type: String, required: true },
    uploaded_at: { type: Date, default: Date.now },
    uploaded_by: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const documentModel = model<EmpDocuments>(
  "documents",
  documentSchema,
  "documents"
);

export default documentModel;
