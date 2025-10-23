import { badRequest } from "../response/response";
import { ExpressMiddlewareNext } from "../types/express.types";
import Constants from "../locales/constants";

export const createBookingsValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.created_by) {
    return badRequest(response, Constants.MESSAGES.CREATED_BY_REQ.code);
  }

  if (!request.body.clinic_id) {
    return badRequest(response, Constants.MESSAGES.CLINIC_ID_REQ.code);
  }
  if (!request.body.room_id) {
    return badRequest(response, Constants.MESSAGES.CREATED_BY_REQ.code);
  }
};
