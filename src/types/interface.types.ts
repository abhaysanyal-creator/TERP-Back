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

export interface OTP {
  userId: string;
  otp: string;
  expiresAt: Date;
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
  first_name: string;
  last_name: string;
  national_id: string;
  employee_type: string;
  position_types: string[];
  employee_roles: string[];
  team_leader: boolean;
  is_deleted: boolean;
  hire_date: Date;
  role: string;
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

export interface Contact {
  id: string;
  name: string;
  role?: string;
  phone?: string;
  email?: string;
}

export interface FixedCost {
  id: string;
  type: string;
  amount: number;
  recurrence: "monthly" | "yearly";
  description?: string;
}
export interface Organisations extends Document {
  org_name: string;
  org_type: string;
  institution_code: string;
  internal_code: string;
  building_size: number;
  area_in: string;
  number_of_rooms: number;
  protected_space: boolean;
  operating_hours: WorkingHour[];
  address: Address;
  number_of_patients: number;
  contacts: Contact[];
  created_at?: Date;
  updated_at?: Date;
  is_deleted: boolean;
  fixed_cost: FixedCost[];
}

export interface Companion {
  full_name: string;
  contact_number: string;
  national_id: string;
  relation_patient: string;
  email:string;
}

export interface Patients extends Document {
  created_by:Types.ObjectId;
  patient_id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  gender: string;
  email:string;
  dob: Date;
    is_deleted: boolean;
  organisation_assignment: string[];
  address: Address;
  disabilities_list: string[];
  companions_list: Companion[];
  allergies_list: string[];
}
