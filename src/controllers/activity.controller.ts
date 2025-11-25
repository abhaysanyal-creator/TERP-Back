import mongoose from "mongoose";
import type { ExpressMiddleware } from "../types/express.types";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants";
import {
  createActivityService,
  createExpenseService,
  deleteActivityService,
  deleteExpenseService,
  listActivityService,
  updateActivityService,
  updateExpenseService,
  viewActivityService,
} from "../services/activity.service";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { ObjectId } from "../utils/helpers";

export const createActivityController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isActivityExist = await mongoose
      .model("activities")
      .findOne({
        activity_name: request.body.activity_name,
        "organisation.id": request.body.organisation.id,
        "department.id": request.body.department.id,
      })
      .exec();

    if (isActivityExist) {
      return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);
    }

    const result = await createActivityService(request.body);

    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewActivityController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingActivity = await mongoose
      .model("activities")
      .findOne({
        _id: ObjectId(request.params.id),
        is_deleted: false,
      })
      .exec();

    if (!existingActivity) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    const result = await viewActivityService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const updateActivityController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const foundActivity = await mongoose
      .model("activities")
      .findOne({ _id: ObjectId(request.params.id), is_deleted: false })
      .exec();

    if (!foundActivity) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    const result = await updateActivityService(request);

    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const deleteActivityController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const id = request.params.id as string;

    const existingClinic = await mongoose
      .model("clinics")
      .findOne({ _id: ObjectId(id), is_deleted: false })
      .exec();

    if (!existingClinic) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }
    const result = await deleteActivityService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const listActivityController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listActivityService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const createExpenseController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingActivity = await mongoose
      .model("activities")
      .findOne({
        _id: ObjectId(request.params.id),
        is_deleted: false,
        is_active: true,
      })
      .exec();

    if (!existingActivity) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    if (
      existingActivity?.expense?.find(
        (exp: any) => exp.name === request.body.name
      )
    ) {
      return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);
    }
    const result = await createExpenseService(request);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const updateExpenseController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingActivity = await mongoose
      .model("activities")
      .findOne({
        _id: ObjectId(request.params.id),
        is_deleted: false,
        is_active: true,
      })
      .exec();

    if (!existingActivity) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    if (
      existingActivity?.expense?.find(
        (exp: any) => exp.name === request.body.name
      )
    ) {
      return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);
    }
    const result = await updateExpenseService(request);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const deleteExpenseController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingActivity = await mongoose
      .model("activities")
      .findOne({
        _id: ObjectId(request.params.id),
        is_deleted: false,
        is_active: true,
      })
      .exec();

    if (!existingActivity) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    const result = await deleteExpenseService(request);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};
