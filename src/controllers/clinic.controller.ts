import mongoose from "mongoose";
import type { ExpressMiddleware } from "../types/express.types";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants";
import {
  createActivityService,
  deleteActivityService,
  listActivityService,
  updateActivityService,
  viewActivityService,
} from "../services/activity.service";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { ObjectId } from "../utils/helpers";
import { Clinic } from "../types/interface.types";
import {
  addEmployeeClinicService,
  createClinicService,
  deleteClinicService,
  listClinicService,
  updateClinicService,
  viewClinicService,
} from "../services/clinic.service";

const clinicModel = mongoose.model<Clinic>("clinics");

export const createClinicController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isClinicExist = await clinicModel
      .findOne({
        name: request.body.name,
      })
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
    const existingClinic = await clinicModel
      .findOne({
        _id: ObjectId(request.params.id),
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
    const foundActivity = await clinicModel
      .findOne({ _id: ObjectId(request.params.id), is_deleted: false })
      .exec();

    if (!foundActivity) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    const result = await updateClinicService(request);

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

    const existingClinic = await clinicModel
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

export const listClinicController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listClinicService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const addEmployeeClinicController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isClinicExist = await clinicModel
      .findOne({
        _id: ObjectId(request.params.id),
      })
      .exec();

    if (isClinicExist) {
      return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);
    }

    const result = await addEmployeeClinicService(request);

    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};
