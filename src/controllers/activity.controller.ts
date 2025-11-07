import mongoose from "mongoose";
import type { ExpressMiddleware } from "../types/express.types";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants";
import {
  createActivityService,
  deleteClinicService,
  listActivityService,
  updateActivityService,
  viewActivityService,
} from "../services/activity.service";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { ObjectId } from "../utils/helpers";

export const createActivityController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    // const creator = await mongoose
    //   .model("employees")
    //   .findOne({ _id: request.body.created_by })
    //   .exec();

    // if (!creator)
    //   return badRequest(response, Constants.MESSAGES.CREATED_BY_REQ.code);

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

export const deleteClinicController: ExpressMiddleware = async (
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
    const result = await deleteClinicService(request.params);
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
