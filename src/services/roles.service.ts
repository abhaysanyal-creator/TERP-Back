import { request } from "http";
import mongoose from "mongoose";

export const addRolesService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingRole = await mongoose
        .model("roles")
        .findOne({ name: payload.name })
        .exec();
      if (existingRole) {
        return reject(new Error("Role Already Exists!!"));
      }
      const newRole = await mongoose.model("roles").create(payload);
      return resolve(newRole);
    } catch (error) {
      return reject(error);
    }
  });
};

export const viewRolesService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingRole = await mongoose
        .model("roles")
        .findOne({ name: payload.name })
        .exec();
      if (!existingRole) {
        return reject(new Error("Role Doesnt Exist!!"));
      }
      return resolve(existingRole);
    } catch (error) {
      return reject(error);
    }
  });
};

export const updateRolesService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingRole = await mongoose
        .model("roles")
        .findOne({ _id: payload.params.id })
        .exec();
      if (!existingRole) {
        return reject(new Error("Role Doesnt Exist!!"));
      }
      const newRole = await mongoose
        .model("roles")
        .findOneAndReplace({ _id: payload.params.id }, payload.body, {
          returnDocument: "after",
        });
      return resolve(newRole);
    } catch (error) {
      return reject(error);
    }
  });
};

export const listRolesService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise((resolve, reject) => {
    try {
      const page = Number(payload.page) || 1;
      const limit = Number(payload.limit) || 10;
      const skip = (page - 1) * limit;

      const match: any = { is_deleted: false };

      const or: any[] = [];
      const and: any[] = [];

      if (payload.name) or.push({ name: payload.name });

      if (or.length > 0) and.push({ $or: or });
      if (and.length > 0) match.$and = and;

      
    } catch (error) {}
  });
};
