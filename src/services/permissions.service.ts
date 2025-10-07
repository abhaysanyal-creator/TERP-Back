import mongoose from "mongoose";
import { ObjectId } from "../utils/helpers.js";

export const addPermissionService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    const allowedRoles = ["super-admin","admin"];

    try {
      const creator = await mongoose
        .model("users")
        .findOne({ _id: ObjectId(payload.created_by) })
        .exec();

      if (!creator) {
        throw new Error("User doesnt exist!!");
      }

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
      if (!hasAccess) {
        throw new Error("Only Admins or Super-Admins have access!!");
      }

      const newPermission = await mongoose.model("permissions").create(payload);
      return resolve(newPermission);
    } catch (error) {
      return reject(error);
    }
  });
};
