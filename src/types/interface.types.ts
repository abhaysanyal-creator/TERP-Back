import { Document, Types } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";
import enums from "../enums.json";

export interface Role {
  name: string;
  value?: string;
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
  id: String;
  start_time: string;
  end_time: string;
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
  address: {
    id: Types.ObjectId;
    name: string;
  };
  state: {
    id: Types.ObjectId;
    name: string;
  };
  city: {
    id: Types.ObjectId;
    name: string;
  };
  country: string;
  postal_code: string;
}

export interface Organisation {
  id: Types.ObjectId;
  name: string;
  location: string[];
}

export interface Specialisation {
  id: Types.ObjectId;
  name: string;
}

export interface EmpDocuments {
  type: string;
  signedUrl?: string;
  key: string;
  file_name: string;
  category: string;
}
export interface BlockTime {
  id?: string;
  start_time: Date;
  end_time: Date;
  created_by: string;
  created_by_type: string;
  department: Types.ObjectId;
  activity: Types.ObjectId;
  patient: Types.ObjectId;
  reason?: string;
  description?: string;
  organisation_id?: string;
  is_recurring?: boolean;
}

export interface Employee extends Document {
  employee_id: string;
  first_name: string;
  is_active: boolean;
  last_name: string;
  national_id: string;
  employee_type: string;
  position_types: string;
  employee_roles: { id: Types.ObjectId; name: string };
  documents: EmpDocuments[];
  team_leader: boolean;
  is_deleted: boolean;
  time_zone: string;
  password: string;
  hire_date: string;
  blocked_times?: BlockTime[];
  role?: Types.ObjectId;
  is_first_login: boolean;
  job_percentage: number;
  dob: string;
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
  organisation_name: string;
  organisation_type: string;
  internal_code: string;
  organisation_id: string;
  number_of_patients: number;
  address: Address;
  contacts: Contact[];
  is_active: boolean;
  // department: Department;
  is_deleted: boolean;
  departments: IDepartment[];
}
export interface PaymentMethod {
  method_type: string;
  method_name: string;
  details: string;
  is_default: boolean;
}

export interface CompanionHMO {
  hmo_type: string;
  policy_number?: string;
  validity_start: Date;
  validity_end: Date;
  status: string;
  document_url?: string;
}

export interface Companion {
  full_name: string;
  contact_number: string;
  national_id: string;
  relation_patient: string;
  landline_number: string;
  payment_method: PaymentMethod[];
  hmo_docs: CompanionHMO;
}

export interface metaDataSchema {
  id: Types.ObjectId;
  name: string;
}
export interface Patients extends Document {
  patient_id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  gender: string;
  is_active: boolean;
  therapist: {
    id: Types.ObjectId;
    name: string;
  };
  contact_number: string;
  email: string;
  documents: EmpDocuments[];
  dob: Date;
  is_deleted: boolean;
  organisation_assignment: Organisation;
  address: Address;
  disabilities_list: metaDataSchema[];
  companions_list: Companion[];
  allergies_list: metaDataSchema[];
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

export interface IRoom {
  id: Types.ObjectId;
  name: string;
  status: string;
}

export interface TreatmentPriceIndexing {
  type: string;
  specialisation: {
    id: Types.ObjectId;
    name: string;
  };
  organisation_cost: string;
  platform_cost: string;
  include_patient_cost: boolean;
  patient_cost: string;
}

export interface Expense {
  expense_name?: string;
  category?: string;
  amount?: number;
  is_deleted?: boolean;
  is_active?: boolean;
}

export interface Activity extends Document {
  organisation: {
    id: Types.ObjectId;
    name: string;
  };
  activity_name: string;
  department: {
    id: Types.ObjectId;
    name: string;
  };
  activity_id: string;
  internal_code: string;
  contacts: Contact[];
  type: string;
  is_deleted: boolean;
  branch_name: string;
  clinic_id: string;
  expenses: Expense[];
  owner: string;
  is_active: boolean;
  manager: Types.ObjectId;
  therapists: [Therapists];
  address: Address;
  clinics: [
    {
      id: Types.ObjectId;
      name: Types.ObjectId;
      treatment: TreatmentPriceIndexing[];
    }
  ];
}

export interface Clinic extends Document {
  organisation: {
    id: Types.ObjectId;
    name: string;
  };
  name: string;
  department: {
    id: Types.ObjectId;
    name: string;
  };
  activity_id: string;
  internal_code: string;
  building_size: number;
  employees: [{ id: Types.ObjectId; name: string; role: string }];
  protected_space: boolean;
  contacts: Contact[];
  area_in: string;
  type: string;
  is_deleted: boolean;
  branch_name: string;
  activities: [{ id: Types.ObjectId; name: string }];
  expenses: Expense[];
  owner: string;
  is_active: boolean;
  rooms: IRoom[];
  address: Address;
  operating_hours: WorkingHour;
  no_of_rooms: number;
}

export interface Bookings extends Document {
  booking_id: String;
  clinic_id: Types.ObjectId;
  room_id: Types.ObjectId;
  therapist: Therapists;
  // start_time: Date;
  // end_time: Date;
  is_active: Boolean;
  is_deleted: Boolean;
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

export enum ServiceModelEnum {
  CASE_BASED = "case_based",
  HOURLY_CHARGED = "hourly_charged",
}
export interface IDepartment extends Document {
  organisation: {
    _id: Types.ObjectId;
    name: string;
    type: string;
  };
  is_deleted: boolean;
  is_active: boolean;
  department_id: string;
  address: Address;
  contacts: Contact;
  region: {
    _id: Types.ObjectId;
    country: string;
    state: string;
    city?: string;
    timezone: string;
  };
  department_name: string;
  internal_code: string;
  external_id: string;
  service_model: ServiceModelEnum;
  service_pricings: {
    occupation: {
      _id: Types.ObjectId;
      label: string;
      value: string;
    };
    treatment_area: {
      _id: Types.ObjectId;
      label: string;
      value: string;
    };
    treatment_cost: number;
    tech_commission: number;
  }[];
  service_manager?: {
    _id: Types.ObjectId;
    name: string;
  };
  department_end_date?: Date;
}

export interface ISession extends Document {
  patient: { id: Types.ObjectId; name: string };
  organisation: { id: Types.ObjectId; name: string };
  authorisation_serial_number: string;
  co_payment_amount: string;
  session_id: string;
  clinic_id: Types.ObjectId;
  treatment: { id: Types.ObjectId; name: string };
  session_type: string;
  documents: EmpDocuments[];
  meeting_type: string;
  therapist: {
    _id: Types.ObjectId;
    name: string;
    is_arrived: boolean;
  };
  treatment_area: {
    clinic_id: Types.ObjectId;
    _id: Types.ObjectId;
    label: string;
    value: string;
  };
  total_cost: string;
  patients: Array<{
    _id: Types.ObjectId;
    organization: {
      _id: Types.ObjectId;
      name: string;
    };
    department: {
      _id: Types.ObjectId;
      name: string;
    };
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
    is_arrived: boolean;
    actual_start: Date;
    actual_end: Date;
    summary: string;
    reason: string;
  }>;
  is_deleted: boolean;
  is_active: boolean;
  patient_groups: {
    _id: Types.ObjectId;
    group_name: string;
    patients: Array<{
      _id: Types.ObjectId;
      organization: {
        _id: Types.ObjectId;
        name: string;
      };
      department: {
        _id: Types.ObjectId;
        name: string;
      };
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      status?: string;
      is_arrived?: boolean;
      actual_start?: Date;
      actual_end?: Date;
      summary?: string;
      reason?: string;
    }>;
  }[];
  session_planning: {
    practice_name: string;
    practice_guidelines: string;
    activities: {
      order: number;
      game: {
        _id: Types.ObjectId;
        title: string;
        thumbnail_file: string;
      };
    }[];
  };
  scheduled_start: string;
  scheduled_date: string;
  scheduled_end: string;
  is_recurring: boolean;
  recurrence?: {
    repeat_every: {
      value: { type: Number; default: 1 };
      unit: String;
    };
    repeat_on: string[];
    ends: {
      type: String;
      enum: string;
    };
    end_date: { type: Date };
    occurrences: { type: Number };
  };
  compensation_session: {
    make_up_session_date: Date;
    start_time: Date;
    end_time: Date;
  };
  status: string;
  therapist_approval: string;
  note: string;
  cancellation_info?: {
    reason: string;
    note: string;
  };
}
