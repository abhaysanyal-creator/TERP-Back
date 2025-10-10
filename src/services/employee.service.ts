import mongoose from "mongoose";
import { ObjectId } from "../utils/helpers.js";

export const createEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newEmployee = await mongoose.model("employees").create(payload);
      resolve(newEmployee);
    } catch (error) {
      reject(error);
    }
  });
};

export const viewEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const employee = await mongoose
        .model("employees")
        .findOne({ _id: ObjectId(payload.id) })
        .exec();
      return resolve(employee);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const requestBody = payload.body;
      const id = payload.params.id;

      const updatedEmployee = await mongoose
        .model("employees")
        .findOneAndReplace({ _id: ObjectId(id) }, requestBody, {
          returnDocument: "after",
        })
        .exec();

      if (!updatedEmployee) {
        throw new Error("Employee not found or could not be updated");
      }

      resolve(updatedEmployee);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedUser = await mongoose
        .model("employees")
        .findOneAndUpdate(
          { _id: ObjectId(payload.id), is_deleted: { $ne: true } },
          { $set: { is_deleted: true } },
          { returnDocument: "after" }
        )
        .exec();

      if (!deletedUser) {
        throw new Error("Employee not found or already deleted");
      }
      resolve(deletedUser);
    } catch (error) {
      reject(error);
    }
  });
};

export const changeWorkingHoursEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const workingHours = payload.working_hours;
      const id = payload.id;
      
      const changedWorkingHours = await mongoose
        .model("employees")
        .findOneAndUpdate(
          { _id: ObjectId(id), is_deleted: { $ne: true } },
          { $set: { working_hours: workingHours } },
          { returnDocument: "after" }
        )
        .exec();

        if (!changedWorkingHours) {
        throw new Error("Problem Changing the working hours!!");
      }
      resolve(
        changedWorkingHours,
       );
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
