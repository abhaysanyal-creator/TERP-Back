import { Specialisation } from "./../types/interface.types";
import { Schema, model } from "mongoose";
import type {
  Address,
  Employee,
  Organisation,
  TimeSlot,
  WorkingHour,
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

const timeSlotSchema: Schema<TimeSlot> = new Schema(
  {
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
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const employeeSchema = new Schema<Employee>(
  {
    employee_id: { type: String, required: true, unique: true },
    first_name: { type: String, required: true, maxlength: 20 },
    last_name: { type: String, required: true, maxlength: 20 },
    national_id: {
      type: String,
      required: true,
      unique: true,
    },
    employee_type: {
      type: Schema.Types.String,
      enum: enums.EmployeeType as any,
      required: true,
    },
    is_deleted: { type: Boolean, default: false },
    position_types: { type: String, required: true },
    employee_roles: [{ type: String, required: true }],
    team_leader: { type: Boolean, required: true },
    hire_date: { type: Date, required: true },
    role: { type: Schema.Types.String },
    job_percentage: { type: Number, min: 0, max: 100, required: true },
    dob: { type: Date, required: true },
    organization_assignments: [organisationSchema],
    location_assignments: [{ type: String, required: true }],
    address: { type: addressSchema, required: true },
    mobile_phone: { type: String, required: true },
    specialisation: [{ type: String, required: true }],
    home_phone: { type: String },
    email: { type: String, required: true, unique: true },
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
