import mongoose from "mongoose";
import type { ExpressMiddleware } from "../types/express.types";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants";
import {
  addEmployeeActivityService,
  addIndexPriceService,
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
import { Activity } from "../types/interface.types";

const activityModel = mongoose.model<Activity>("activities");

export const createActivityController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isActivityExist = await activityModel
      .findOne({
        activity_name: request.body.activity_name
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
    const existingActivity = await activityModel
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
    const foundActivity = await activityModel
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
    const existingActivity = await activityModel
      .findOne({
        _id: ObjectId(request.params.id),
        is_deleted: false,
        is_active: true,
      })
      .exec();

    if (!existingActivity) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    const bodyArray = Array.isArray(request.body)
      ? request.body
      : [request.body];

    const requestedNames = bodyArray.map((item) => item.expense_name);

    const existingNames = (existingActivity?.expenses || []).map(
      (e: any) => e.expense_name
    );

    const isDuplicate = requestedNames.some((name) =>
      existingNames.includes(name)
    );

    if (isDuplicate) {
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
    const existingActivity = await activityModel
      .findOne({
        _id: ObjectId(request.params.id),
        is_deleted: false,
        is_active: true,
      })
      .exec();

    if (!existingActivity) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    // if (
    //   existingActivity?.expenses?.find(
    //     (exp: any) => exp.expense_name === request.body.expense_name
    //   )
    // ) {
    //   return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);
    // }
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
    const existingActivity = await activityModel
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

export const addEmployeeActivityController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isClinicExist = await activityModel
      .findOne({
        _id: ObjectId(request.params.id),
      })
      .exec();

    if (!isClinicExist) {
      return badRequest(response, Constants.MESSAGES.ACTIVITY_ID_REQ.code);
    }

    const result = await addEmployeeActivityService(request);

    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const addIndexPriceController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isClinicExist = await activityModel
      .findOne({
        _id: ObjectId(request.params.id),
      })
      .exec();

    if (!isClinicExist) {
      return badRequest(response, Constants.MESSAGES.ACTIVITY_ID_REQ.code);
    }

    const result = await addIndexPriceService(request);

    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};