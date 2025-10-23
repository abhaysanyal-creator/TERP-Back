import { badRequest } from "../response/response";
import { ExpressMiddlewareNext } from "../types/express.types";
import Constants from "../locales/constants";

export const createRoomValidator: ExpressMiddlewareNext = (
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
  if (!request.body.room_type) {
    return badRequest(response, Constants.MESSAGES.ROOM_TYPE_REQ.code);
  }
  if (!request.body.room_size) {
    return badRequest(response, Constants.MESSAGES.ROOM_SIZE_REQ.code);
  }
  next();
};

export const viewRoomValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }

  next();
};

export const updateRoomValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }

  if (!request.body.created_by) {
    return badRequest(response, Constants.MESSAGES.CREATED_BY_REQ.code);
  }

  if (!request.body.clinic_id) {
    return badRequest(response, Constants.MESSAGES.CLINIC_ID_REQ.code);
  }
  if (!request.body.room_type) {
    return badRequest(response, Constants.MESSAGES.ROOM_TYPE_REQ.code);
  }
  if (!request.body.room_size) {
    return badRequest(response, Constants.MESSAGES.ROOM_SIZE_REQ.code);
  }
  next();
};
