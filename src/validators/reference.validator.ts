import { badRequest } from "../response/response";
import type { ExpressMiddlewareNext } from "../types/express.types";
import Constants from "../locales/constants";

export const listStatesValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.country) {
    return badRequest(response, Constants.MESSAGES.COUNTRY_REQ.code);
  }
  next();
};

export const getCitiesValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.country) {
    return badRequest(response, Constants.MESSAGES.COUNTRY_REQ.code);
  }
  if (!request.body.state) {
    return badRequest(response, Constants.MESSAGES.STATE_REQ.code);
  }
  next();
};

export const createSpecialisationValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.name) {
    return badRequest(response, Constants.MESSAGES.SPECIALISATION_NAME.code);
  }
  next();
};
