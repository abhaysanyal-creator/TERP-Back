import jwt, { type SignOptions } from "jsonwebtoken";
import Constants from "../locales/constants";
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

export const generateCode = (prefix: string, length: number) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < length; i++) {
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

export const saveOtp = async (userId: mongoose.Types.ObjectId, otp: string) => {
  const expiresAt = Date.now() + 3 * 60 * 1000;
  // otps.set(userId, { otp, expiresAt });

  await mongoose
    .model("otps")
    .findOneAndUpdate(
      { userId },
      { otp, expiresAt },
      { upsert: true, new: true }
    );
};

export const verifyOtp = async (userId: string, otpInp: string) => {
  const otpInput: string = otpInp.trim();

  const record = await mongoose.model("otps").findOne({
    userId: userId,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    throw new Error(Constants.MESSAGES.NOT_FOUND.code);
  }

  if (record.otp !== otpInput) {
    throw {
      status: 401,
      error: {
        code: Constants.MESSAGES.INVALID_OTP.code,
        message: Constants.MESSAGES.INVALID_OTP.message,
      },
    };
  }

  await mongoose.model("otps").deleteOne({ _id: record._id });

  return true;
};

export const isRoomAvailable = (
  room: any,
  day: number,
  start_time: Date,
  end_time: Date
) => {
  if (!room.bookings || room.bookings.length === 0) return true;

  const bookingsForDay = room.bookings.filter((b: any) => b.day === day);

  for (const booking of bookingsForDay) {
    for (const slot of booking.slots) {
      // Check if requested slot overlaps with an existing slot
      if (start_time < slot.end_time && end_time > slot.start_time) {
        return false; // Overlapping, room is not available
      }
    }
  }

  return true; // No overlaps, room is available
};

export const validateCompanionDuplicates = (companionsList = []) => {
  const nationalIds = new Set();
  const mobilePhones = new Set();
  const relations = new Set();
  const combos = new Set();

  for (const c of companionsList) {
    const { national_id, mobile_phone, relation } = c;

    if (national_id) {
      if (nationalIds.has(national_id)) {
        return "DUPLICATE_NATIONAL_ID";
      }
      nationalIds.add(national_id);
    }

    if (mobile_phone) {
      if (mobilePhones.has(mobile_phone)) {
        return "DUPLICATE_MOBILE_PHONE";
      }
      mobilePhones.add(mobile_phone);
    }

    if (relation) {
      if (relations.has(relation)) {
        return "DUPLICATE_RELATION";
      }
      relations.add(relation);
    }
    const comboKey = `${national_id || ""}-${mobile_phone || ""}-${
      relation || ""
    }`;
    if (combos.has(comboKey)) {
      return "DUPLICATE_COMPANION_COMBINATION";
    }
    combos.add(comboKey);
  }

  return null; // No duplicates
};

export const combineTimeDate = (dateStr: string, timeStr: string): Date => {
  return new Date(`${dateStr}T${timeStr}:00`);
};

export const getDateRange = (start: Date, end: Date) => {
  const dates = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const isBlockWithinWorkingHours = (
  employee: any,
  block: any
): boolean => {
  const blockStart = new Date(block.start_time);
  const blockEnd = new Date(block.end_time);

  const day = blockStart.getDay();

  const workingDay = employee.working_hours.find((wh: any) => wh.day === day);

  if (!workingDay || !workingDay.enabled) return false;

  // Extract date from block (yyyy-mm-dd)
  const dateStr = blockStart.toISOString().split("T")[0];

  for (const slot of workingDay.slots) {
    const slotStartDate = new Date(slot.start_time);
    const slotEndDate = new Date(slot.end_time);

    // Extract HH:mm from these ISO dates
    const slotStartHHMM = slotStartDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const slotEndHHMM = slotEndDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Combine block date with slot time
    const slotStart = new Date(`${dateStr}T${slotStartHHMM}:00`);
    const slotEnd = new Date(`${dateStr}T${slotEndHHMM}:00`);

    // Convert to ms for comparison
    const blockStartMs = blockStart.getTime();
    const blockEndMs = blockEnd.getTime();

    if (
      blockStartMs >= slotStart.getTime() &&
      blockEndMs <= slotEnd.getTime()
    ) {
      return true;
    }
  }

  return false;
};
