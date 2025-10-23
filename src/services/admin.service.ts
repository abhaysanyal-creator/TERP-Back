import mongoose from "mongoose";
import { adminCheck, generateEmployeeId, ObjectId } from "../utils/helpers";

export const createAdmin = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const creator = await mongoose
        .model("users")
        .findOne({ _id: ObjectId(payload.created_by) })
        .exec();

      if (!creator) {
        return reject(new Error("Creator not found"));
      }

      const hasAccess = await adminCheck(creator);

      if (!hasAccess) throw new Error("Only Admins has access!!");

      const user = await mongoose
        .model("users")
        .findOne({ email: payload.email })
        .exec();

      if (user) {
        throw new Error("User Already exists!!");
      }

      payload.employee_id = generateEmployeeId();

      const role = await mongoose
        .model("roles")
        .findOne({ _id: ObjectId(payload.role) });

      payload.permissions = role.permissions;
      
      const newUser = await mongoose.model("users").create(payload);

      return resolve(newUser);
    } catch (error) {
      return reject(error);
    }
  });
};

export const viewAdminService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await mongoose
        .model("users")
        .findOne({ _id: ObjectId(payload.id) })
        .exec();
      if (!user) return reject(new Error("No User Found!!"));
      return resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};
