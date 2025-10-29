import mongoose from "mongoose";
import Constants from "../locales/constants";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { badRequest, success } from "../response/response";
import {
  createSpecialisationService,
  listCitiesService,
  listCountriesService,
  listEnumsService,
  listSpecialisationService,
  listStatesService,
} from "../services/reference.service";
import { ExpressMiddleware } from "../types/express.types";

export const listCountriesController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listCountriesService();
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const listStatesController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listStatesService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const listCitiesController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listCitiesService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const createSpecialisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isExists = await mongoose
      .model("specialisations")
      .findOne({
        name: request.body.name,
        is_deleted: false,
      })
      .exec();

    if (isExists) {
      return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);
    }

    const result = await createSpecialisationService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const listSpecialisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listSpecialisationService();
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const listEnumsController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listEnumsService();
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};