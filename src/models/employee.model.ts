import { Specialisation } from "./../types/interface.types";
import { Schema, model } from "mongoose";
import type {
  EmpDocuments,
  Employee,
  Organisation,
  TimeSlot,
} from "../types/interface.types";
import enums from "../enums.json";
import { addressSchema } from "./organisation.model";

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
    enabled: { type: Boolean, default: true },
  },
  {
    _id: false,
  }
);

const organisationSchema: Schema<Organisation> = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    location: { type: [String] },
  },
  {
    _id: false,
  }
);

const specialisationSchema: Schema<Specialisation> = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true, ref: "metadatas" },
    name: { type: String, required: true },
  },
  {
    _id: false,
  }
);

export const DocSchema: Schema<EmpDocuments> = new Schema(
  {
    type: { type: String },
    key: { type: String },
    file_name: { type: String },
    category: { type: String },
  },
  {
    _id: false,
  }
);

const employeeSchema = new Schema<Employee>(
  {
    employee_id: { type: String, required: true, unique: true },
    first_name: { type: String, required: true, maxlength: 50 },
    last_name: { type: String, required: true, maxlength: 50 },
    national_id: {
      type: String,
      required: true,
    },
    employee_type: {
      //
      type: String,
      enum: enums.EmployeeType as any,
      required: true,
    },
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    position_types: { type: String, required: true }, // Full_time,Part_time etc

    employee_roles: {
      id: { type: Schema.Types.ObjectId },
      name: { type: String },
    },
    team_leader: { type: Boolean, required: true },
    hire_date: { type: String, required: true },
    role: { type: Schema.Types.String },
    job_percentage: { type: Number, min: 0, max: 100, required: true },
    documents: [DocSchema],
    dob: { type: String, required: true },
    organization_assignments: [organisationSchema],
    location_assignments: [{ type: String, required: true }],
    address: { type: addressSchema, required: true },
    time_zone: { type: String, required: true },
    mobile_phone: { type: String, required: true },
    specialisation: [specialisationSchema],
    home_phone: { type: String },
    email: { type: String, required: true },
    notes: { type: String },
    gender: {
      type: Schema.Types.String,
      enum: enums.Gender as any,
      required: true,
    },
    working_hours: [workingHourSchema],
  },
  { timestamps: true }
);

const employeeModel = model<Employee>("employees", employeeSchema, "employees");

export default employeeModel;
