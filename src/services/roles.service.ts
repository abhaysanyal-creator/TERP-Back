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
          new: true,
        });
      return resolve(newRole);
    } catch (error) {
      return reject(error);
    }
  });
};
