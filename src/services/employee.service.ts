import mongoose from "mongoose";
import { generateCode, ObjectId } from "../utils/helpers";
import { success } from "../response/response";
import { getSignedUrlForView } from "../controllers/upload.controller";
import { Employee } from "../types/interface.types";
import Constants from "../locales/constants";

export const createEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      payload.employee_id = generateCode("EMP", 6);
      const newEmployee = await mongoose.model("employees").create(payload);
      resolve(newEmployee);
    } catch (error) {
      reject(error);
    }
  });
};

export const viewEmployeeService = async (payload: Record<string, any>) => {
  try {
    const EmployeeModel = mongoose.model<Employee>("employees");

    const employee = await EmployeeModel.findOne({ _id: ObjectId(payload.id) })
      .lean()
      .exec();

    if (!employee) {
      throw new Error(Constants.MESSAGES.NOT_FOUND.code);
    }

    employee.documents = await Promise.all(
      (employee.documents || []).map(async (doc) => ({
        ...doc,
        signedUrl: await getSignedUrlForView(doc.key),
      }))
    );

    return employee;
  } catch (error) {
    throw error;
  }
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

export const blockTimeEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedUser = await mongoose
        .model("employees")
        .findOneAndUpdate(
          { _id: ObjectId(payload.id), is_deleted: { $ne: true } },
          { $set: { blocked_times: payload } },
          { returnDocument: "after" }
        )
        .exec();

      if (!updatedUser) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.UPDATE.code);
      }

      console.log(updatedUser)
      resolve(updatedUser);
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
      const and: any[] = [];

      if (payload.mobile_phone)
        and.push({ mobile_phone: payload.mobile_phone });

      if (payload.employee_roles)
        and.push({ "employee_roles.id": ObjectId(payload.employee_roles) });

      if (payload.is_active !== undefined)
        and.push({ is_active: payload.is_active });

      if (payload.search) {
        or.push({ first_name: { $regex: payload.search, $options: "i" } });
        or.push({ employee_id: { $regex: payload.search, $options: "i" } });
      }

      if (or.length) and.push({ $or: or });
      if (and.length) match.$and = and;

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

      // const employeesWithSignedUrls = await Promise.all(
      //   employees.map(async (employee: any) => {
      //     if (employee.documents && employee.documents.length > 0) {
      //       employee.documents = await Promise.all(
      //         employee.documents.map(async (doc: any) => ({
      //           ...doc,
      //           signedUrl: await getSignedUrlForView(doc.key),
      //         }))
      //       );
      //     }
      //     return employee;
      //   })
      // );

      resolve({
        data: employees,
        meta: {
          pages: Math.ceil(totalCount / limit),
          page,
          limit,
          total: totalCount,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};
