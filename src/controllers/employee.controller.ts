import { badRequest, success } from "../response/response";
import {
  changeWorkingHoursEmployeeService,
  createEmployeeService,
  deleteEmployeeService,
  listEmployeeService,
  updateEmployeeService,
  viewEmployeeService,
} from "../services/employee.service";
import type { ExpressMiddleware } from "../types/express.types";
import Lang from "../locales/en.json";
import { getErrorMessage } from "../middlewares/app.middlewares";
import mongoose from "mongoose";
import { adminCheck, ObjectId } from "../utils/helpers";
import Constants from "../locales/constants";

export const createEmployeeController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const creator = await mongoose
      .model("users")
      .findOne({ _id: request.body.created_by })
      .exec();

    if (!creator)
      return badRequest(response, Constants.MESSAGES.NO_ACCESS.code);
    if (!adminCheck(creator)) return badRequest(response, Lang.ADMIN_ACCESS);

    const existingEmployee = await mongoose
      .model("employees")
      .findOne({ email: request.body.email })
      .exec();

    if (existingEmployee)
      return badRequest(response, Lang.EMAIL_ALREADY_EXISTS);

    const result = await createEmployeeService(request.body);
    return success(response, Lang.USER_CREATED, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewEmployeeController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await viewEmployeeService(request.params);
    return success(response, Lang.SUCCESS, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const updateEmployeeController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const employeeExists = await mongoose
      .model("employees")
      .findById(ObjectId(request.body.id))
      .exec();

    if (!employeeExists)
      return badRequest(response, Constants.MESSAGES.EMP_NOT_FOUND.code);

    const result = await updateEmployeeService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const deleteEmployeeController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingUser = await mongoose
      .model("employees")
      .findById(request.params.id);
    if (!existingUser)
      return badRequest(response, Constants.MESSAGES.EMP_NOT_FOUND.code);

    const result = await deleteEmployeeService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, {
      deleted_id: result._id,
      deleted_employee: result.emails,
      is_deleted: result.is_deleted,
    });
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const changeWorkingHoursEmployeeController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const checkEmployee = await mongoose
      .model("employees")
      .findOne({ _id: ObjectId(request.body.id), is_deleted: false })
      .exec();
    if (!checkEmployee)
      return badRequest(response, Constants.MESSAGES.EMP_NOT_FOUND.code);

    if (
      JSON.stringify(checkEmployee.working_hours) ===
      JSON.stringify(request.body.working_hours)
    ) {
      return badRequest(response, Constants.MESSAGES.CHANGE_HOURS.code);
    }
    const result = await changeWorkingHoursEmployeeService(request.body);

    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const listEmployeeController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listEmployeeService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};
