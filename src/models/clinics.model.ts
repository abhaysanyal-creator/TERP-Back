import { model, Schema } from "mongoose";
import type {
  Address,
  ClinicPricing,
  Clinics,
  Room,
  Therapists,
  WorkingHour,
} from "../types/interface.types";
import roomModel from "./rooms.model";

const TherapistSchema: Schema<Therapists> = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "employees",
    },
    name: { type: String, required: true },
    employee_id: { type: String, required: true },
    specialisation: { type: String, required: true },
    working_hours: { type: String, required: true },
    organisation: { type: Schema.Types.ObjectId, required: true },
  },
  { _id: false }
);

const ClinicPricingSchema: Schema<ClinicPricing> = new Schema(
  {
    clinic_id: { type: String, required: true },
    name: { type: String, required: true },
    price_to_customer: { type: Number, required: true },
    cost_price: { type: Number, required: true },
  },
  { _id: false }
);

const AddressSchema = new Schema<Address>(
  {
    city: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    postal_code: { type: String, required: true },
  },
  { _id: false }
);

const WorkingHourSchema = new Schema<WorkingHour>(
  {
    day: { type: String, required: true },
    startTime: { type: String, required: false, default: null },
    endTime: { type: String, required: false, default: null },
  },
  { _id: false }
);

const clinicSchema: Schema<Clinics> = new Schema({
  created_by: { type: Schema.Types.ObjectId, required: true, ref: "employees" },
  is_deleted: { type: Boolean, default: false },
  branch_name: { type: String, required: true, unique: true },
  clinic_id: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  manager: { type: Schema.Types.ObjectId, required: true, ref: "employees" },
  therapists: [TherapistSchema],
  address: AddressSchema,
  working_hours: [WorkingHourSchema],
  no_of_room: { type: Number, required: true },
  specialisation: [ClinicPricingSchema],
});

const clinicModel = model<Clinics>("clinics", clinicSchema, "clinics");

export default clinicModel;
