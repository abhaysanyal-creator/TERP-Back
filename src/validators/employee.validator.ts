import { badRequest } from "../response/response";
import type { ExpressMiddlewareNext } from "../types/express.types";
import Lang from "../locales/en.json";
import enums from "../enums.json";
import Constants from "../locales/constants";

export const createEmployeeValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.created_by) {
    return badRequest(response, Lang.CREATED_BY_REQ || "Created By Required");
  }
  if (!request.body.first_name || request.body.first_name.trim() === "") {
    return badRequest(
      response,
      Constants.MESSAGES.FIRST_NAME_REQ.code || "First Name is required"
    );
  }

  if (!request.body.last_name || request.body.last_name.trim() === "") {
    return badRequest(
      response,
      Constants.MESSAGES.LAST_NAME_REQ.code || "Last Name is required"
    );
  }

  if (!request.body.national_id) {
    return badRequest(
      response,
      Constants.MESSAGES.NATIONAL_ID_REQ.code || "National ID is required"
    );
  }

  if (!request.body.employee_type) {
    return badRequest(
      response,
      Constants.MESSAGES.INVALID_EMP_TYPE.code || "Invalid employee type"
    );
  }

  if (
    !request.body.gender ||
    !Object.values(enums.Gender).includes(request.body.gender)
  ) {
    return badRequest(response, Lang.INVALID_GENDER || "Invalid gender");
  }

  if (!request.body.hire_date || isNaN(Date.parse(request.body.hire_date))) {
    return badRequest(
      response,
      Constants.MESSAGES.HIRE_DATE_REQUIRED.code ||
        "Valid hire date is required"
    );
  }
  if (request.body.specialisation.length > 0) {
    const hasEmpty = request.body.specialisation.some((spec: any) =>
      Object.values(spec).some((value) => !value)
    );

    if (hasEmpty) {
      return badRequest(
        response,
        Constants.MESSAGES.SPECIALISATION_FIELD_REQ.code
      );
    }
  }

  if (!request.body.dob || isNaN(Date.parse(request.body.dob))) {
    return badRequest(
      response,
      Constants.MESSAGES.DOB_REQ.code || "Valid date of birth is required"
    );
  }

  if (
    request.body.job_percentage === undefined ||
    typeof request.body.job_percentage !== "number" ||
    request.body.job_percentage < 0 ||
    request.body.job_percentage > 100
  ) {
    return badRequest(
      response,
      Constants.MESSAGES.JOB_PERCENTAGE_INVALID.code ||
        "Job percentage must be between 0 and 100"
    );
  }

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

  if (request.body.organization_assignments) {
    const hasEmpty = request.body.organization_assignments.some((item: any) =>
      Object.values(item).some((value) => !value)
    );

    if (hasEmpty) {
      return badRequest(response, Constants.MESSAGES.ORG_NAME_REQUIRED.code);
    }
  }

  if (!request.body.mobile_phone) {
    return badRequest(
      response,
      Constants.MESSAGES.CONTACT_NUM_REQ.code ||
        "At least one mobile phone number is required"
    );
  }

  if (!request.body.email) {
    return badRequest(
      response,
      Constants.MESSAGES.EMAIL_REQ.code || "Email address is required"
    );
  }

  if (typeof request.body.team_leader !== "boolean") {
    return badRequest(
      response,
      Constants.MESSAGES.TEAM_LEAD_REQ_TRUE_FALSE.code ||
        "Team Leader must be true or false"
    );
  }

  if (!request.body.position_types) {
    return badRequest(
      response,
      Constants.MESSAGES.INVALID_EMP_TYPE.code ||
        "At least one position type is required"
    );
  }

  if (!request.body.employee_roles) {
    return badRequest(
      response,
      Constants.MESSAGES.INVALID_ROLE.code ||
        "At least one employee role is required"
    );
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
  next();
};

export const viewEmployeeValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Lang.ID_REQUIRED);
  }
  next();
};

export const updateEmployeeValidator: ExpressMiddlewareNext = (
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
  next();
};

export const deleteEmployeeValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const changeWorkingHoursEmployeeValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  if (
    request.body.working_hours &&
    !Array.isArray(request.body.working_hours)
  ) {
    return badRequest(
      response,
      Constants.MESSAGES.INVALID_FORMAT.code || "Working hours must be an array"
    );
  }
  next();
};

export const listEmployeeValidator: ExpressMiddlewareNext = (
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


