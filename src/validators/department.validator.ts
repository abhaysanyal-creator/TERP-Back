import { badRequest } from "../response/response";
import Constants from "../locales/constants";
import type { ExpressMiddlewareNext } from "../types/express.types";
import enums from "../enums.json";

export const createDeptValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (
    !request.body.organisation ||
    Object.values(request.body.organisation).some(
      (item: any) => item === "" || item === undefined
    )
  ) {
    return badRequest(response, Constants.MESSAGES.INCOMPLETE_ORG_DETAILS.code);
  }

  if (!request.body.department_id) {
    return badRequest(response, Constants.MESSAGES.DEPARTMENT_ID_REQ.code);
  }

  if (!request.body.internal_code) {
    return badRequest(response, Constants.MESSAGES.INTERNAL_CODE_REQUIRED.code);
  }

  if (!request.body.department_name) {
    return badRequest(
      response,
      Constants.MESSAGES.DEPARTMENT_NAME_REQUIRED.code
    );
  }

  if (!request.body.address) {
    return badRequest(response, Constants.MESSAGES.ADDRESS_REQUIRED.code);
  }

  if (
    !Array.isArray(request.body.contacts) ||
    request.body.contacts.length === 0
  ) {
    return badRequest(response, Constants.MESSAGES.CONTACT_REQUIRED.code);
  }
  for (const contact of request.body.contacts) {
    if (!contact.name || !contact.role || !contact.phone) {
      return badRequest(response, Constants.MESSAGES.INVALID_CONTACT.code);
    }
  }

  next();
};

export const viewOrganisationValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const updateDepartmentValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ORG_ID_REQUIRED.code);
  }

  if (request.body.department_id) {
    return badRequest(
      response,
      Constants.MESSAGES.FORBIDDEN_INTERNAL_FIELDS.FORBIDDEN.code
    );
  }
  if (request.body.internal_code) {
    return badRequest(
      response,
      Constants.MESSAGES.FORBIDDEN_INTERNAL_FIELDS.FORBIDDEN.code
    );
  }
  if (request.body.is_deleted) {
    return badRequest(
      response,
      Constants.MESSAGES.FORBIDDEN_INTERNAL_FIELDS.FORBIDDEN.code
    );
  }

  next();
};

export const deleteOrganisationValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const listOrganisationValidator: ExpressMiddlewareNext = (
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

export const changeOperatingHoursOrganisationValidator: ExpressMiddlewareNext =
  (request, response, next) => {
    if (!request.body.id) {
      return badRequest(response, Constants.MESSAGES.ID_REQ.code);
    }
    if (
      request.body.operating_hours &&
      !Array.isArray(request.body.operating_hours)
    ) {
      return badRequest(
        response,
        Constants.MESSAGES.INVALID_FORMAT.code ||
          "Working hours must be an array"
      );
    }
    next();
  };
