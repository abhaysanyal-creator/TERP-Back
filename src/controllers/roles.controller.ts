import { badRequest, success } from "../response/response";
import {
  addRolesService,
  listRolesService,
  updateRolesService,
  viewRolesService,
} from "../services/roles.service";
import type { ExpressMiddleware } from "../types/express.types.ts";
import Lang from "../locales/en.json";
import { getErrorMessage } from "../middlewares/app.middlewares";
import Constants from "../locales/constants";
import mongoose from "mongoose";
import { ObjectId } from "../utils/helpers";

export const addRolesController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const payload = request.body;
    if (payload.name === "super-admin" || payload.name === "super_admin") {
      return badRequest(response, Constants.MESSAGES.NO_SUPER_ADMIN.code);
    }
    const result = await addRolesService(payload);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewRolesController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const payload = request.body;

    const result = await viewRolesService(payload);
    return success(response, Lang.SUCCESS, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const updateRolesController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isRoleExist = await mongoose
      .model("roles")
      .findById(ObjectId(request.params.id));

    if (!isRoleExist)
      return badRequest(response, Constants.MESSAGES.ID_REQ.code);

    const payload = request;

    const result = await updateRolesService(payload);
    console.log(result,"==========")
    return success(response, Lang.USER_CREATED, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const listRolesController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listRolesService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};
