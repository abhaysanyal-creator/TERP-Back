import { Schema, model } from "mongoose";
import type { Address, Employee, WorkingHour } from "../types/interface.types.js";
import enums from "../enums.json" with {type:"json"}

const addressSchema = new Schema<Address>(
  {
    city: { type: String, required: true },
    country:{type:String,required:true},
    address:{type:String,required:true},
    postal_code: { type: String, required: true },
  },
  { _id: false }
);

const workingHourSchema = new Schema<WorkingHour>(
  {
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const employeeSchema = new Schema<Employee>(
  {
    first_name: { type: String, required: true, maxlength: 20 },
    last_name: { type: String, required: true, maxlength: 20 },
    national_id: {
      type: String,
      required: true,
      match: /^[0-9]+$/,
      unique: true,
    },
    employee_type: {
      type: Schema.Types.String,
      enum: enums.EmployeeType as any,
      required: true,
    },
    is_deleted:{type:Boolean,default:false},
    position_types: [{ type: String, required: true }],
    employee_roles: [{ type: String, required: true }],
    team_leader: { type: Boolean, required: true },
    hire_date: { type: Date, required: true },
    role:{type:Schema.Types.String},
    job_percentage: { type: Number, min: 0, max: 100, required: true },
    dob: { type: Date, required: true },
    organization_assignments: [{ type: String, required: true }],
    location_assignments: [{ type: String, required: true }],
    address: { type: addressSchema, required: true },
    mobile_phones: { type: String, required: true,unique:true },
    home_phones: { type: String },
    emails: { type: String, required: true,unique:true },
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

const employeeModel = model<Employee>("employees",employeeSchema,"employees")

export default employeeModel;