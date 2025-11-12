import constants from "../locales/constants";
import { badRequest } from "../response/response";
import { ExpressMiddlewareNext } from "../types/express.types";
import enums from "../enums.json";

export const createSessionValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.id) {
    return badRequest(response, constants.MESSAGES.ID_REQ.code);
  }
  next();
};
