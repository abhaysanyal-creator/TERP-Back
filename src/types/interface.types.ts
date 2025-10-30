import {
  Document,
  Types,
  type TypeExpressionOperatorReturningString,
} from "mongoose";
import type { JwtPayload } from "jsonwebtoken";
import { stringList } from "aws-sdk/clients/datapipeline";

export interface Role {
  name: string;
  permissions: {
    name: string;
    permission: string;
    module: string;
    description: string;
    default: boolean;
  }[];
  is_deleted: boolean;
  is_active: boolean;
}

export interface User extends Document {
  username: string;
  email: string;
  is_deleted: boolean;
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

// export interface Permissions extends Document {
//   name: string;
//   created_by: Types.ObjectId;
// }

export interface IUserPermission extends Document {
  name: string;
  permissions: {
    name: string;
    permission: string;
    module: string;
    description: string;
  }[];
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

export interface TimeSlot {
  start_time: Date;
  end_time: Date;
}

export interface WorkingHour {
  day: number;
  slots: TimeSlot[];
}

export interface BookingDetails {
  day: number;
  slots: TimeSlot;
}

export interface Address {
  city: string;
  address: string;
  country: string;
  postal_code: string;
}

export interface Organisation {
  id: Types.ObjectId;
  name: string;
  location: string[];
}

export interface Specialisation {
  id: string;
  name: string;
}

export interface EmpDocuments extends Document {
  type: string;
  file_url: string;
  uploaded_at: Date;
  uploaded_by: Types.ObjectId;
}

export interface Employee extends Document {
  employee_id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  employee_type: string;
  position_types: string;
  employee_roles: string[];
  team_leader: boolean;
  is_deleted: boolean;
  hire_date: Date;
  role?: string;
  job_percentage: number;
  dob: Date;
  organization_assignments: Organisation[];
  location_assignments: string[];
  address: Address;
  mobile_phone: string;
  specialisation: string[];
  // specialisation: Specialisation[];
  home_phone: string;
  email: string;
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
  recurrence: "one_time" | "monthly" | "yearly";
  description?: string;
}


// export interface Duration {
//   treatment_time:number;
//   documentation_time:number;
// }
// export interface Treatment {
//   org_cost:number;
//   patient_cost:number;
//   platform_cost:number;
//   duration:Duration;
// }
// export interface Activity {
//   name:string;
//   treatment:[Treatment];
// }

// export interface Department {
//   name: string;
//   address: Address;
//   contact: Contact;
//   activity:[Activity]
// }

// label - name
// value - name.toLowerCase()
export interface Organisations extends Document {
  org_name: string;
  org_type: string;
  internal_code: string;
  number_of_patients: number;
  address: Address;
  contacts: Contact[];
  is_active: boolean;
  // department: Department;
  is_deleted: boolean;
}

export interface Companion {
  full_name: string;
  contact_number: string;
  national_id: string;
  relation_patient: string;
  landline_number: string;
}

export interface Patients extends Document {
  created_by: Types.ObjectId;
  patient_id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  gender: string;
  is_active: boolean;
  contact_number: string;
  email: string;
  dob: Date;
  is_deleted: boolean;
  organisation_assignment: Organisation;
  address: Address;
  disabilities_list: string[];
  companions_list: Companion[];
  allergies_list: string[];
}

export interface Therapists {
  name: string;
  id: Types.ObjectId;
  employee_id: string;
  specialisation: string;
  working_hours: WorkingHour;
  organisation: Types.ObjectId;
}

export interface BookingSlot extends WorkingHour {
  booking_id: Types.ObjectId;
}

export interface Room {
  clinic_id: Types.ObjectId;
  room_type: string;
  room_size: number;
  created_by: Types.ObjectId;
  bookings: [BookingSlot];
  is_active: Boolean;
  is_deleted: Boolean;
}

export interface ClinicPricing {
  clinic_id: string;
  name: string;
  price_to_customer: number;
  cost_price: number;
}

export interface Clinics extends Document {
  created_by: Types.ObjectId;
  is_deleted: boolean;
  branch_name: string;
  clinic_id: string;
  owner: string;
  is_active: boolean;
  manager: Types.ObjectId;
  therapists: [Therapists];
  rooms: [Room];
  address: Address;
  working_hours: WorkingHour;
  no_of_rooms: number;
  specialisation: ClinicPricing;
}

export interface Bookings extends Document {
  booking_id: String;
  clinic_id: Types.ObjectId;
  room_id: Types.ObjectId;
  therapist: Therapists;
  created_by: Types.ObjectId;
  // start_time: Date;
  // end_time: Date;
  booking_details: BookingDetails;
  patient_id: Types.ObjectId;
  status: string;
  notes: string;
}

export interface SpecialisationType {
  name: string;
  is_deleted: boolean;
  is_active: boolean;
}
