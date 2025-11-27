import { model, Schema } from "mongoose";
import {
  type Companion,
  type Address,
  type Patients,
  Organisation,
} from "../types/interface.types";
import enums from "../enums.json";
import { addressSchema } from "./organisation.model";
import { DocSchema } from "./employee.model";

const paymentMethodSchema = new Schema(
  {
    method_type: {
      type: String,
      enum: enums.PaymentType,
      required: true,
    },
    method_name: { type: String, enum: enums.PaymentMethod, trim: true },
    details: { type: String, trim: true },
    is_default: { type: Boolean, default: false },
  },
  { _id: false }
);

const hmoDocsSchema = new Schema(
  {
    hmo_type: {
      type: String,
      enum: enums.HmoType,
      required: true,
    },
    document_number: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    is_active: { type: Boolean, default: true },
    document_url: { type: String },
    notes: { type: String },
  },
  { _id: false }
);

const companionSchema = new Schema<Companion>(
  {
    full_name: { type: String, required: true },
    contact_number: { type: String, required: true },
    national_id: { type: String, required: true },
    relation_patient: { type: String, required: true },
    landline_number: { type: String },
    payment_method: [paymentMethodSchema],
    hmo_docs: [hmoDocsSchema],
  },
  {
    _id: false,
  }
);

const organisationSchema: Schema<Organisation> = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    location: { type: [String], required: true },
  },
  {
    _id: false,
  }
);

export const disabilitySchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

export const allergySchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const patientSchema: Schema<Patients> = new Schema(
  {
    patient_id: { type: String, unique: true, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    national_id: { type: String, unique: true, required: true },
    contact_number: { type: String, required: true },
    therapist: {
      id: { type: Schema.Types.ObjectId },
      name: { type: String },
    },
    gender: {
      type: Schema.Types.String,
      enum: enums.Gender as any,
      required: true,
    },
    dob: { type: Date, required: true },
    organisation_assignment: organisationSchema,
    is_active: { type: Boolean, default: true },
    documents:[DocSchema],
    address: addressSchema,
    disabilities_list: [disabilitySchema],
    companions_list: [companionSchema],
    allergies_list: [allergySchema],
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const patientModel = model<Patients>("patients", patientSchema, "patients");

export default patientModel;
