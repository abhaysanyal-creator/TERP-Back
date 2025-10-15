import mongoose from "mongoose";
import { adminCheck, ObjectId } from "../utils/helpers.ts";

export const addPermissionService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {

    try {
      const creator = await mongoose
        .model("users")
        .findOne({ _id: ObjectId(payload.created_by) })
        .exec();

      if (!creator) {
        throw new Error("User doesnt exist!!");
      }

      const hasAccess = await adminCheck(creator);

      if (!hasAccess) throw new Error("Only Admins has access!!");

      const newPermission = await mongoose.model("permissions").create(payload);
      return resolve(newPermission);
    } catch (error) {
      return reject(error);
    }
  });
};
