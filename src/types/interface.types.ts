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
