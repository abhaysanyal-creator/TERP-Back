import { badRequest, success } from "../response/response";
import {
  createAdmin,
  listAdminService,
  viewAdminService,
} from "../services/admin.service";
import type { ExpressMiddleware } from "../types/express.types";
import Lang from "../locales/en.json";
import { getErrorMessage } from "../middlewares/app.middlewares";
import Constants from "../locales/constants";

export const adminCreateController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const payload = request.body;

    const result = await createAdmin(payload);

    return success(response, Lang.USER_CREATED, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewAdminController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const payload = request.params;
    const result = await viewAdminService(payload);
    return success(response, Lang.SUCCESS, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const updateAdminController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
  } catch (error) {}
};

export const listAdminController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const payload = request.params;
    const result = await listAdminService(payload);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};
