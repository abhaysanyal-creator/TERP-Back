import mongoose from "mongoose";
import type { ExpressMiddleware } from "../types/express.types.ts";
import { badRequest, success } from "../response/response.ts";
import Constants from "../locales/constants.ts";
import {
  createOrganisationService,
  deleteOrganisationService,
  listOrganisationService,
  updateOrganisationService,
  viewOrganisationService,
} from "../services/organisation.service.ts";
import { getErrorMessage } from "../middlewares/app.middlewares.ts";
import { ObjectId } from "../utils/helpers.ts";

export const createOrganisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingOrg = await mongoose
      .model("organisations")
      .findOne({ org_name: request.body.org_name })
      .exec();

    if (existingOrg) {
      return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);
    }
    const result = await createOrganisationService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewOrganisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const id = request.params.id as string;

    const existingOrg = await mongoose
      .model("organisations")
      .findOne({ _id: ObjectId(id), is_deleted: false })
      .exec();

    if (!existingOrg) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }
    const result = await viewOrganisationService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const updateOrganisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingOrganisation = await mongoose
      .model("organisations")
      .findOne({ _id: ObjectId(request.body.id) })
      .exec();

    if (!existingOrganisation)
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);

    const result = await updateOrganisationService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const deleteOrganisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const id = request.params.id as string;

    const existingOrg = await mongoose
      .model("organisations")
      .findById(ObjectId(id))
      .exec();

    if (!existingOrg) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }
    const result = await deleteOrganisationService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const listOrganisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listOrganisationService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};
