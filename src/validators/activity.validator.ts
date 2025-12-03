import { badRequest } from "../response/response";
import type { ExpressMiddlewareNext } from "../types/express.types";
import Constants from "../locales/constants";
import enums from "../enums.json";

export const createActivityValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (
    !request.body.type ||
    !Object.values(enums.ActivityType).includes(request.body.type)
  ) {
    return badRequest(response, Constants.MESSAGES.TYPE_REQUIRED.code);
  }

  // if (
  //   !request.body.organisation ||
  //   !request.body.organisation.id ||
  //   !request.body.organisation.name
  // )
  //   return badRequest(response, Constants.MESSAGES.ORG_ID_REQUIRED.code);

  // if (
  //   !request.body.department ||
  //   !request.body.department.id ||
  //   !request.body.department.name
  // )
  //   return badRequest(response, Constants.MESSAGES.DEPARTMENT_ID_REQ.code);

  // if (!request.body.activity_id)
  //   return badRequest(response, Constants.MESSAGES.ACTIVITY_ID_REQ.code);

  if (!request.body.internal_code)
    return badRequest(response, Constants.MESSAGES.INTERNAL_CODE_REQUIRED.code);

  if (!request.body.building_size)
    return badRequest(response, Constants.MESSAGES.INVALID_BUILDING_SIZE.code);

  if (
    !request.body.area_in ||
    !Object.values(enums.AreaIn).includes(request.body.area_in)
  )
    return badRequest(response, Constants.MESSAGES.INVALID_AREA_IN.code);

  if (
    !request.body.protected_space ||
    typeof request.body.protected_space !== "boolean"
  )
    return badRequest(
      response,
      Constants.MESSAGES.INVALID_PROTECTED_SPACE.code
    );

  if (!request.body.address) {
    return badRequest(
      response,
      Constants.MESSAGES.ADDRESS_FIELD_REQ.code || "Address is required"
    );
  }
  const { city, country, postal_code, address } = request.body.address;
  if (!city || !country || !address || !postal_code) {
    return badRequest(
      response,
      Constants.MESSAGES.ADDRESS_FIELD_REQ.code ||
        "All address fields are required"
    );
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

  if (
    request.body.working_hours &&
    !Array.isArray(request.body.working_hours)
  ) {
    return badRequest(
      response,
      Constants.MESSAGES.INVALID_WORKING_HOURS.code ||
        "Working hours must be an array"
    );
  }

  if (!Array.isArray(request.body.rooms) || !(request.body.rooms.length > 0)) {
    return badRequest(response, Constants.MESSAGES.INVALID_ROOMS_FORMAT.code);
  }

  // if (!request.body.treatment || !Array.isArray(request.body.treatment))
  //   return badRequest(response, Constants.MESSAGES.INVALID_FORMAT.code);

  // for (const t of request.body.treatment) {
  //   if (
  //     !t.specialisation ||
  //     typeof t.platform_cost !== "number" ||
  //     typeof t.organisation_cost !== "number"
  //   )
  //     return badRequest(
  //       response,
  //       Constants.MESSAGES.SPECIALISATION_FIELD_REQ.code
  //     );
  // }

  next();
};

export const viewActivityValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const updateActivityValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ORG_ID_REQUIRED.code);
  }

  if (request.body.activity_id) {
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

export const deleteClinicValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const listClinicValidator: ExpressMiddlewareNext = (
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

export const createExpenseValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ACTIVITY_ID_REQ.code);
  }
  if (!request.body.map((expense: any) => expense.name)) {
    return badRequest(response, Constants.MESSAGES.EXPENSE_NAME_REQ.code);
  }
  if (!request.body.amount) {
    return badRequest(response, Constants.MESSAGES.AMOUNT_REQUIRED.code);
  }
  if (!request.body.category) {
    return badRequest(
      response,
      Constants.MESSAGES.EXPENSE_CATEGORY_REQUIRED.code
    );
  }
  if (
    request.body.category &&
    !Object.values(enums.CostRecurrence).includes(request.body.category)
  ) {
    return badRequest(
      response,
      Constants.MESSAGES.EXPENSE_CATEGORY_REQUIRED_FORMAT.code
    );
  }
  next();
};

export const updateExpenseValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ACTIVITY_ID_REQ.code);
  }
  if (!request.params.exp_id) {
    return badRequest(response, Constants.MESSAGES.ACTIVITY_ID_REQ.code);
  }
  if ("name" in request.body) {
    if (!request.body.name || request.body.name.trim() === "") {
      return badRequest(response, Constants.MESSAGES.EXPENSE_NAME_REQ.code);
    }
  }
  if ("amount" in request.body) {
    if (typeof request.body.amount !== "number") {
      return badRequest(response, Constants.MESSAGES.AMOUNT_REQUIRED.code);
    }
  }
  if ("category" in request.body) {
    if (!Object.values(enums.CostRecurrence).includes(request.body.category)) {
      return badRequest(
        response,
        Constants.MESSAGES.EXPENSE_CATEGORY_REQUIRED_FORMAT.code
      );
    }
  }
  next();
};

export const deleteExpenseValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ACTIVITY_ID_REQ.code);
  }
  if (!request.params.exp_id) {
    return badRequest(response, Constants.MESSAGES.ACTIVITY_ID_REQ.code);
  }
  next();
};

export const addEmployeeClinicValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.CLINIC_ID_REQ.code);
  }
  if (!request.body.id) {
    return badRequest(response, Constants.MESSAGES.EMP_ID_REQ.code);
  }
  if (!request.body.role) {
    return badRequest(response, Constants.MESSAGES.ROLE_IS_REQ.code);
  }
  if (!request.body.name) {
    return badRequest(response, Constants.MESSAGES.EMPLOYEE_NAME_REQ.code);
  }

  next();
};

export const addIndexPriceValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.CLINIC_ID_REQ.code);
  }
  next();
};
