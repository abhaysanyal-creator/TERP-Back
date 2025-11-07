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

export const addressSchema = new Schema<Address>(
  {
    city: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    postal_code: { type: String, required: true },
  },
  { _id: false }
);

export const contactSchema = new Schema<Contact>(
  {
    name: { type: String, required: true },
    role: { type: String },
    phone: { type: String, required: true },
  },
  {
    _id: false,
  }
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
    organisation_id: { type: String, required: true, unique: true },
    organisation_name: { type: String, required: true, unique: true },
    organisation_type: {
      type: Schema.Types.String,
      enum: enums.OrganisationType as any,
      required: true,
    },
    internal_code: { type: String, required: true, unique: true },

    address: addressSchema,
    contacts: [contactSchema],
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const organisationModel = model<Organisations>(
  "organisations",
  organisationSchema,
  "organisations"
);

export default organisationModel;
