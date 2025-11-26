import type { ExpressMiddlewareNext } from "../types/express.types";
import { badRequest } from "../response/response";
import Lang from "../locales/en.json";
import Constants from "../locales/constants";
import enums from "../enums.json";

export const createEntryValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.activity) {
    return badRequest(response, Constants.MESSAGES.ACTIVITY_ID_REQ.code);
  }
  if (!request.body.patient) {
    return badRequest(response, Constants.MESSAGES.PATIENT_ID_REQ.code);
  }
  if (!request.body.treatment) {
    return badRequest(response, Constants.MESSAGES.TREATMENT_TYPE_REQ.code);
  }
  if (!request.body.preferences) {
    return badRequest(
      response,
      Constants.MESSAGES.WAITING_LIST_PREFERENCE.code
    );
  }
  if (!request.body.funding) {
    return badRequest(response, Constants.MESSAGES.FUNDING_TYPE_REQUIRED.code);
  }
  next();
};

export const listEntryValidator: ExpressMiddlewareNext = (
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
