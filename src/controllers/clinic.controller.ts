import mongoose from "mongoose";
import type { ExpressMiddleware } from "../types/express.types";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants";
import {
  createClinicService,
  deleteClinicService,
  updateClinicService,
  viewClinicService,
} from "../services/clinic.service";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { ObjectId } from "../utils/helpers";

export const createClinicController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const creator = await mongoose
      .model("employees")
      .findOne({ _id: request.body.created_by })
      .exec();

    if (!creator)
      return badRequest(response, Constants.MESSAGES.CREATED_BY_REQ.code);

    const isClinicExist = await mongoose
      .model("clinics")
      .findOne({ branch_name: request.body.branch_name })
      .exec();

    if (isClinicExist) {
      return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);
    }

    const result = await createClinicService(request.body);

    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewClinicController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingClinic = await mongoose
      .model("clinics")
      .findOne({
        _id: ObjectId(request.params.id as string),
        is_deleted: false,
      })
      .exec();

    if (!existingClinic) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    const result = await viewClinicService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const updateClinicController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const foundClinic = await mongoose
      .model("clinics")
      .findOne({ _id: ObjectId(request.body.id), is_deleted: false })
      .exec();

    if (!foundClinic) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    const result = await updateClinicService(request.body);

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
