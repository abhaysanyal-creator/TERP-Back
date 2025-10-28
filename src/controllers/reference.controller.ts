import Constants from "../locales/constants";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { badRequest, success } from "../response/response";
import {
  listCountriesService,
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
