import { badRequest } from "../response/response";
import type { ExpressMiddlewareNext } from "../types/express.types";
import Constants from "../locales/constants";

export const createClinicValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.created_by) {
    return badRequest(response, Constants.MESSAGES.CREATED_BY_REQ.code);
  }

  if (!request.body.branch_name)
    return badRequest(response, Constants.MESSAGES.BRANCH_NAME_REQ.code);

  if (!request.body.clinic_id)
    return badRequest(response, Constants.MESSAGES.CLINIC_ID_REQ.code);

  if (!request.body.owner)
    return badRequest(response, Constants.MESSAGES.OWNER_REQ.code);

  if (!request.body.manager)
    return badRequest(response, Constants.MESSAGES.MANAGER_REQ.code);

  if (!request.body.address)
    return badRequest(response, Constants.MESSAGES.ADDRESS_REQ.code);

  const { city, country, address, postal_code } = request.body.address;
  if (!city) return badRequest(response, Constants.MESSAGES.CITY_REQ.code);
  if (!country)
    return badRequest(response, Constants.MESSAGES.COUNTRY_REQ.code);
  if (!address)
    return badRequest(response, Constants.MESSAGES.ADDRESS_FIELD_REQ.code);
  if (!postal_code)
    return badRequest(response, Constants.MESSAGES.POSTAL_CODE_REQ.code);

  if (
    request.body.no_of_rooms === undefined ||
    typeof request.body.no_of_rooms !== "number"
  ) {
    return badRequest(response, Constants.MESSAGES.INVALID_ROOMS_FORMAT.code);
  }

  console.log(request.body.working_hours);
  if (request.body.working_hours) {
    const workingHours = Array.isArray(request.body.working_hours)
      ? request.body.working_hours
      : JSON.parse(request.body.working_hours);

    if (workingHours.length === 0) {
      return badRequest(
        response,
        Constants.MESSAGES.OPERATING_HOURS_REQUIRED.code
      );
    }

    for (const item of workingHours) {
      if (
        typeof item.day !== "number" ||
        !Array.isArray(item.slots) ||
        item.slots.length === 0
      ) {
        return badRequest(
          response,
          Constants.MESSAGES.INVALID_OPERATING_HOURS.code
        );
      }

      for (const slot of item.slots) {
        if (
          !slot.start_time ||
          !slot.end_time ||
          isNaN(Date.parse(slot.start_time)) ||
          isNaN(Date.parse(slot.end_time))
        ) {
          return badRequest(
            response,
            Constants.MESSAGES.INVALID_OPERATING_HOURS.code
          );
        }
      }
    }
  }

  if (!request.body.therapists || !Array.isArray(request.body.therapists)) {
    return badRequest(response, Constants.MESSAGES.INVALID_FORMAT.code);
  }
  for (const t of request.body.therapists) {
    if (
      !t.id ||
      !t.name ||
      !t.employee_id ||
      !t.specialisation ||
      !t.working_hours ||
      !t.organisation
    )
      return badRequest(response, Constants.MESSAGES.THERAPIST_FIELD_REQ.code);
  }

  if (
    !request.body.specialisation ||
    !Array.isArray(request.body.specialisation)
  )
    return badRequest(response, Constants.MESSAGES.INVALID_FORMAT.code);

  for (const s of request.body.specialisation) {
    if (
      !s.name ||
      typeof s.price_to_customer !== "number" ||
      typeof s.cost_price !== "number"
    )
      return badRequest(
        response,
        Constants.MESSAGES.SPECIALISATION_FIELD_REQ.code
      );
  }

  next();
};

export const viewClinicValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const updateClinicValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.created_by) {
    return badRequest(response, Constants.MESSAGES.CREATED_BY_REQ.code);
  }
  if (!request.body.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
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

export const listClinicValidator:ExpressMiddlewareNext = (request, response, next) => {
  if (!request.body.page) {
    return badRequest(response, Constants.MESSAGES.PAGE.code);
  }
  if (!request.body.limit) {
    return badRequest(response, Constants.MESSAGES.LIMIT.code);
  }
  next();
};
