import enums from "../enums.json";
import permissions from "../data/permissions.json";
import roleModel from "../models/role.model";
import mongoose from "mongoose";

export const listPermissionService = (): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userPermissions = await roleModel.find({
        role: { $ne: enums.RoleEnum.SUPER_ADMIN },
      });
      console.log(userPermissions);
      resolve({
        permissions,
        user_permissions: userPermissions,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

export const assignPermissionService = (
  args: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Promise.all(
        args.user_permissions.map((userPermission: any) => {
          return mongoose
            .model("roles")
            .findOneAndUpdate(
              { name: userPermission.role },
              { $set: { permissions: userPermission.permissions } },
              { new: true }
            );
        })
      );
      resolve({ success: true, permissions: response });
    } catch (error) {
      reject(error);
    }
  });
};
