import jwt, { type SignOptions } from "jsonwebtoken";
import mongoose from "mongoose";
interface TokenPayload {
  id: string;
  role: string;
  [key: string]: any;
}

export const generateToken = (
  payload: TokenPayload,
  secret: string,
  expiresInSecs: number
): string => {
  const options: SignOptions = { expiresIn: expiresInSecs };
  return jwt.sign(payload, secret, options);
};

export const ObjectId = (id: string): mongoose.Types.ObjectId => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new mongoose.Types.ObjectId(id);
};

export const generateEmployeeId = () => {
  const prefix = "TI";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + randomPart;
};

export const generateCode = (prefix:string) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + randomPart;
};

export const adminCheck = async (
  creator: Record<string, any>
): Promise<boolean> => {
  const allowedRoles = ["super-admin", "admin"];
  const allowedRoleDocs = await mongoose
    .model("roles")
    .find({
      name: { $in: allowedRoles },
    })
    .exec();

  const allowedRoleIds = allowedRoleDocs.map((role) => role._id);

  const hasAccess = allowedRoleIds.some((roleId) =>
    creator.role.equals(roleId)
  );
  return hasAccess;
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const otps = new Map();

export const saveOtp = (userId: mongoose.Types.ObjectId, otp: string) => {
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otps.set(userId, { otp, expiresAt });
};

export const verifyOtp = (userId: string, otpInput: string) => {
  if (!otps.has(userId)) {
    throw new Error("OTP expired. Request login again!!");
  }
  const { otp, expiresAt } = otps.get(userId);
  if (Date.now() > expiresAt) {
    otps.delete(userId);
    return false;
  }
  if (otp !== otpInput)
    throw {
      status: 401,
      error: {
        code: "INVALID_OTP",
        message: "Invalid OTP!!",
      },
    };
  if (otp === otpInput) {
    otps.delete(userId);
    return true;
  }
  return false;
};
