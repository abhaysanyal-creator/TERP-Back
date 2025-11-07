import mongoose, { model, Schema } from "mongoose";
import type {
  Activity,
  Address,
  IRoom,
  Therapists,
  TimeSlot,
  TreatmentPriceIndexing,
} from "../types/interface.types";
import { roomsSchema } from "./rooms.model";
import enums from "../enums.json";
import { contactSchema } from "./organisation.model";

const TreatmentPricingSchema: Schema<TreatmentPriceIndexing> = new Schema(
  {
    specialisation: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
    organisation_cost: { type: Number, default: 0 },
    platform_cost: { type: Number, default: 0 },
    patient_cost: { type: Number, default: 0 },
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

const timeSlotSchema: Schema<TimeSlot> = new Schema(
  {
    id: { type: String },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
  },
  {
    _id: false,
  }
);

const workingHourSchema = new Schema(
  {
    day: { type: Number, required: true },
    slots: [timeSlotSchema],
  },
  { _id: false }
);

const TherapistSchema: Schema<Therapists> = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: "employees",
    },
    name: { type: String },
    employee_id: { type: String },
    specialisation: { type: String },
    working_hours: [workingHourSchema],
    organisation: { type: Schema.Types.ObjectId, ref: "organisations" },
  },
  { _id: false }
);

export const roomSchema: Schema<IRoom> = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String },
  },
  { _id: false }
);

const activitySchema: Schema<Activity> = new Schema({
  type: { type: String, enum: enums.ActivityType, required: true },
  activity_name: { type: String, required: true },
  organisation: {
    id: { type: Schema.Types.ObjectId, required: true, ref: "organisations" },
    name: { type: String, required: true },
  },
  department: {
    id: { type: Schema.Types.ObjectId, required: true, ref: "departments" },
    name: { type: String, required: true },
  },
  activity_id: { type: String, required: true, unique: true },
  internal_code: { type: String, required: true, unique: true },
  building_size: { type: Number, required: true },
  area_in: { type: String, enum: enums.AreaIn, default: enums.AreaIn.SQ_MTR },
  created_by: { type: Schema.Types.ObjectId, required: true, ref: "employees" },
  is_deleted: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  protected_space: { type: Boolean, default: true },
  contacts: [contactSchema],
  therapists: [TherapistSchema],
  address: AddressSchema,
  rooms: [roomSchema],
  operating_hours: [workingHourSchema],
  treatment: [TreatmentPricingSchema],
});

const activityModel = model<Activity>(
  "activities",
  activitySchema,
  "activities"
);

export default activityModel;
