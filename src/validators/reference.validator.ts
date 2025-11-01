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

export const listCitiesValidator: ExpressMiddlewareNext = (
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

export const updateSpecialisationValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.name) {
    return badRequest(response, Constants.MESSAGES.SPECIALISATION_NAME.code);
  }
    if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const deleteSpecialisationValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const uploadDocumentsValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.organisation_id) {
    return badRequest(response, Constants.MESSAGES.ORG_ID_REQUIRED.code);
  }
  if (!request.body.file) {
    return badRequest(response, Constants.MESSAGES.DOCUMENT_REQUIRED.code);
  }
  if (!request.body.module) {
    return badRequest(response, Constants.MESSAGES.MODULE_REQUIRED.code);
  }
  if (!request.body.category) {
    return badRequest(response, Constants.MESSAGES.CATEGORY_REQUIRED.code);
  }
  next();
};
