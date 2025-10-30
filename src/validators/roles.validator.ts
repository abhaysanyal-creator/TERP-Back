import type { ExpressMiddlewareNext } from "../types/express.types";
import { badRequest } from "../response/response";
import Lang from "../locales/en.json";
import Constants from "../locales/constants";
import enums from "../enums.json";

export const addRolesValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.name) {
    return badRequest(response, Constants.MESSAGES.FIRST_NAME_REQ.code);
  }
  // if (!request.body.permissions) {
  //   return badRequest(response, Constants.MESSAGES.INCLUDE_PERMISSION.code);
  // }
  next();
};

export const updateRolesValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  if (!request.body.name) {
    return badRequest(response, Constants.MESSAGES.FIRST_NAME_REQ.code);
  }

  if (request.body.name) {
    if (!Object.values(enums.RoleEnum).includes(request.body.name)) {
      return badRequest(response, Constants.MESSAGES.INVALID_FORMAT.code);
    }
  }
  if (!request.body.permissions) {
    return badRequest(response, Constants.MESSAGES.INCLUDE_PERMISSION.code);
  }
  next();
};

export const listRolesValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.page) {
    return badRequest(response, Constants.MESSAGES.PAGE.code);
  }
  if (!request.body.limit) {
    return badRequest(response, Constants.MESSAGES.LIMIT.code);
  }
  next();
};
