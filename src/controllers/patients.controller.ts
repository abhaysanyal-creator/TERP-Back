import mongoose from "mongoose";
import type { ExpressMiddleware } from "../types/express.types";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants";
import {
  createPatientService,
  deletePatientService,
  updatePatientService,
  viewPatientService,
} from "../services/patients.service";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { ObjectId } from "../utils/helpers";

export const createPatientController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isPatientExists = await mongoose
      .model("patients")
      .findOne({ patient_id: request.body.patient_id })
      .exec();

    if (isPatientExists)
      return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);

    const creator = await mongoose
      .model("employees")
      .findOne({
        _id: ObjectId(request.body.created_by),
        is_deleted: false,
      })
      .exec();

    if (!creator) {
      return badRequest(response, Constants.MESSAGES.CREATED_BY_REQ.code);
    }

    const result = await createPatientService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewPatientController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const patientExist = await mongoose
      .model("patients")
      .findOne({ _id: request.params.id, is_deleted: false })
      .exec();

    if (!patientExist) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    const result = await viewPatientService(request.params);

    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const updatePatientController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingPatient = await mongoose
      .model("patients")
      .findOne({ _id: request.body.id, is_deleted: false })
      .exec();

    if (!existingPatient)
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);

    const result = await updatePatientService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const deletePatientController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingPatient = await mongoose
      .model("patients")
      .findById(request.params.id)
      .exec();
    if (!existingPatient) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }
    const result = await deletePatientService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};
