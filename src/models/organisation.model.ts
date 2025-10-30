import { Schema, model } from "mongoose";
import {
  type Contact,
  type Address,
  type Organisations,
  type WorkingHour,
  type FixedCost,
  TimeSlot,
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

const contactSchema = new Schema<Contact>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true, ref: "roles" },
    phone: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const fixedCostSchema = new Schema<FixedCost>(
  {
    type: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    recurrence: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const timeSlotSchema: Schema<TimeSlot> = new Schema(
  {
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
  },
  { _id: false }
);

const workingHourSchema: Schema<WorkingHour> = new Schema(
  {
    day: { type: Number, required: true },
    slots: [timeSlotSchema],
  },
  { _id: false }
);

// const departmentSchema = new Schema({


// });

const organisationSchema: Schema<Organisations> = new Schema(
  {
    org_name: { type: String, required: true, unique: true },
    org_type: {
      type: Schema.Types.String,
      enum: enums.OrganisationType as any,
      required: true,
    },
    internal_code: { type: String, required: true, unique: true },

    address: addressSchema,
    contacts: [contactSchema],
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const organisationModel = model<Organisations>(
  "organisations",
  organisationSchema,
  "organisations"
);

export default organisationModel;
