import { Schema, model } from "mongoose";
import type { SpecialisationType } from "../types/interface.types";

const specialisationSchema = new Schema<SpecialisationType>({
  name: { type: String, required: true},
  is_deleted: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
});

const specialisationModel = model<SpecialisationType>(
  "specialisations",
  specialisationSchema,
  "specialisations"
);

export default specialisationModel;
