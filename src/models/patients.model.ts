import { model, Schema } from "mongoose";
import {
  type Companion,
  type Address,
  type Patients,
  Organisation,
} from "../types/interface.types";
import enums from "../enums.json";

const addressSchema = new Schema<Address>(
  {
    city: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    postal_code: { type: String, required: true },
  },
  { _id: false }
);

const companionSchema = new Schema<Companion>({
  full_name: { type: String, required: true },
  contact_number: { type: String, required: true },
  national_id: { type: String, required: true },
  relation_patient: { type: String, required: true },
});

const organisationSchema: Schema<Organisation> = new Schema({
  id: { type: Schema.Types.ObjectId, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: [String] },
});

const patientSchema: Schema<Patients> = new Schema(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "employees",
    },
    patient_id: { type: String, unique: true, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    national_id: { type: String, unique: true, required: true },
    gender: {
      type: Schema.Types.String,
      enum: enums.Gender as any,
      required: true,
    },
    dob: { type: Date, required: true },
    organisation_assignment: organisationSchema,
    is_active: { type: Boolean, default: true },
    address: addressSchema,
    disabilities_list: [{ type: String }],
    companions_list: companionSchema,
    allergies_list: [{ type: String }],
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const patientModel = model<Patients>("patients", patientSchema, "patients");

export default patientModel;
