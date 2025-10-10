import { Document, Types } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";

export interface Role extends Document {
  name: string; // Role name, e.g., "super-admin"
  permissions: string[]; // Permissions
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  employee_id: string;
  name: string;
  password: string;
  role: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  otp_code: Number;
  otp_expires: Date;
  contact_number: number;
}

export interface Permissions extends Document {
  name: string;
  icon: string;
  created_by: Types.ObjectId;
}

export interface JwtInterface extends JwtPayload {
  id: string;
  role: string;
}

export interface WorkingHour {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Address {
  city: string;
  address: string;
  country: string;
  postal_code: string;
}

export interface Employee extends Document {
  first_Name: string;
  last_Name: string;
  national_id: string;
  employee_type: string;
  position_types: string[];
  employee_roles: string[];
  team_leader: boolean;
  is_deleted:boolean;
  hire_date: Date;
  role:string;
  job_percentage: number;
  dob: Date;
  organization_assignments: string[];
  location_assignments: string[];
  address: Address;
  mobile_phones: string;
  home_phones: string;
  emails: string;
  notes?: string;
  gender: string;
  working_hours: WorkingHour[];
}
