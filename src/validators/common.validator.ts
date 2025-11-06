import constants from "../locales/constants";
import { badRequest } from "../response/response";
import { ExpressMiddlewareNext } from "../types/express.types";
import enums from "../enums.json";

export const changeActiveStatusValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.id) {
    return badRequest(response, constants.MESSAGES.ID_REQ.code);
  }
  if (
    !request.body.module ||
    !Object.values(enums.ModuleType).includes(request.body.module)
  ) {
    return badRequest(response, constants.MESSAGES.MODULE_REQUIRED.code);
  }

  if (
    request.body.status === undefined ||
    typeof request.body.status !== "boolean"
  ) {
    return badRequest(response, constants.MESSAGES.STATUS_REQ.code);
  }
  next();
};
