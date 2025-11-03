import mongoose from "mongoose";
import Constants from "../locales/constants";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { badRequest, success } from "../response/response";
import {
  createSpecialisationService,
  deleteSpecialisationService,
  listCitiesService,
  listCountriesService,
  listEnumsService,
  listSpecialisationService,
  listStatesService,
  updateSpecialisationService,
} from "../services/reference.service";
import { ExpressMiddleware } from "../types/express.types";
import { Request, Response } from "express";
import { ObjectId } from "../utils/helpers";

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

export const createSpecialisationController = async (
  request: Request,
  response: Response,
  type: string
) => {
  try {
    const isExists = await mongoose
      .model("metadatas")
      .findOne({
        type: type,
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

export const listSpecialisationController = async (
  request: Request,
  response: Response,
  type: string
) => {
  try {
    const result = await listSpecialisationService(request);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const deleteSpecialisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    if (!(await mongoose.model("metadatas").findById(request.params.id))) {
      return badRequest(response, Constants.MESSAGES.DOESNT_EXIST.code);
    }

    const result = await deleteSpecialisationService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const updateSpecialisationController = async (
  request: Request,
  response: Response,
  type: string
) => {
  try {
    if (
      !(await mongoose.model("metadatas").findOne({
        _id: ObjectId(request.params.id),
        type: type,
        is_deleted: false,
      }))
    ) {
      return badRequest(response, Constants.MESSAGES.DOESNT_EXIST.code);
    }

    const result = await updateSpecialisationService(request);
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
