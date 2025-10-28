import mongoose from "mongoose";
import { generateCode, ObjectId } from "../utils/helpers";
import { success } from "../response/response";

export const createEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      payload.employee_id = generateCode("EMP",6)
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
      const requestBody = payload;
      const id = payload.id;

      const updatedEmployee = await mongoose
        .model("employees")
        .findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: requestBody },
          { new: true, runValidators: true }
        )
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
      resolve(changedWorkingHours);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const listEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const page = Number(payload.page) || 1;
      const limit = Number(payload.limit) || 10;
      const skip = (page - 1) * limit;

      const match: Record<string, any> = {
        is_deleted: false,
      };

      const or: any[] = [];

      if (payload.department) or.push({ department: payload.department });
      if (payload.status) or.push({ status: payload.status });
      if (payload.search) {
        or.push(
          { name: { $regex: payload.search, $options: "i" } },
          { email: { $regex: payload.search, $options: "i" } }
        );
      }
      if (or.length) match.$or = or;

      const pipeline: any[] = [
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ];

      const countPipeline = [{ $match: match }, { $count: "total" }];

      const [employees, countResult] = await Promise.all([
        mongoose.model("employees").aggregate(pipeline),
        mongoose.model("employees").aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      resolve({
        data: employees,

        total: totalCount,
      });
    } catch (error) {
      reject(error);
    }
  });
};
