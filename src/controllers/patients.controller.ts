import mongoose from "mongoose";
import type { ExpressMiddleware } from "../types/express.types";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants";
import {
  createPatientService,
  deletePatientService,
  listPatientService,
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
      .findOne({
        $or: [
          { national_id: request.body.national_id },
          { contact_number: request.body.contact_number },
        ],
      })
      .exec();

    if (isPatientExists) {
      if (isPatientExists.contact_number === request.body.contact_number) {
        return badRequest(
          response,
          Constants.MESSAGES.DUPLICATE_CONTACT_NUMBER.code
        );
      }
      if (isPatientExists.national_id === request.body.national_id) {
        return badRequest(
          response,
          Constants.MESSAGES.DUPLICATE_NATIONAL_ID.code
        );
      }
    }

    const companionsIList = request.body.companions_list;
    const ids = companionsIList.map((companion: any) => companion.national_id);
    const duplicateCompanion = ids.length !== new Set(ids).size;

    if (duplicateCompanion) {
      return badRequest(response, Constants.MESSAGES.COMPANION_REPEATED.code);
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
      .findOne({
        _id: { $ne: ObjectId(request.params.id) },
        $or: [
          { national_id: request.body.national_id },
          { contact_number: request.body.contact_number },
        ],
        is_deleted: false,
      })
      .exec();

    if (existingPatient) {
      if (existingPatient) {
        if (existingPatient.contact_number === request.body.contact_number) {
          return badRequest(
            response,
            Constants.MESSAGES.DUPLICATE_CONTACT_NUMBER.code
          );
        }
        if (existingPatient.national_id === request.body.national_id) {
          return badRequest(
            response,
            Constants.MESSAGES.DUPLICATE_NATIONAL_ID.code
          );
        }
      }
    }

    const duplicateNationalId = await mongoose
      .model("patients")
      .findOne({
        _id: { $ne: ObjectId(request.params.id) },
        $or: [
          { national_id: request.body.national_id },
          { contact_number: request.body.contact_number },
        ],
        is_deleted: false,
      })
      .exec();

    if (duplicateNationalId) {
      if (request.body.national_id === existingPatient.national_id) {
        return badRequest(
          response,
          Constants.MESSAGES.DUPLICATE_NATIONAL_ID.code
        );
      }

      if (duplicateNationalId.contact_number === request.body.contact_number) {
        return badRequest(
          response,
          Constants.MESSAGES.DUPLICATE_CONTACT_NUMBER.code
        );
      }
    }

    const result = await updatePatientService(request);
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

export const listPatientController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listPatientService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};
