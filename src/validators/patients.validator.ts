import { badRequest } from "../response/response";
import type { ExpressMiddlewareNext } from "../types/express.types";
import Constants from "../locales/constants";
import enums from "../enums.json";

export const createPatientValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
 

  if (!request.body.first_name) {
    return badRequest(response, Constants.MESSAGES.FIRST_NAME_REQ.code);
  }

  if (!request.body.last_name) {
    return badRequest(response, Constants.MESSAGES.LAST_NAME_REQ.code);
  }

  if (!request.body.national_id) {
    return badRequest(response, Constants.MESSAGES.NATIONAL_ID_REQ.code);
  }

  if (
    request.body.gender &&
    !Object.values(enums.Gender).includes(request.body.gender)
  ) {
    return badRequest(response, Constants.MESSAGES.GENDER_REQ.code);
  }

  if (!request.body.dob) {
    return badRequest(response, Constants.MESSAGES.DOB_REQ.code);
  }

  if (!request.body.address) {
    return badRequest(response, Constants.MESSAGES.ADDRESS_REQ.code);
  }

  const { address } = request.body;
  if (!address.city) {
    return badRequest(response, Constants.MESSAGES.CITY_REQ.code);
  }
  if (!address.country) {
    return badRequest(response, Constants.MESSAGES.COUNTRY_REQ.code);
  }
  if (!address.address) {
    return badRequest(response, Constants.MESSAGES.ADDRESS_FIELD_REQ.code);
  }
  if (!address.postal_code) {
    return badRequest(response, Constants.MESSAGES.POSTAL_CODE_REQ.code);
  }

  if (!request.body.companions_list) {
    return badRequest(response, Constants.MESSAGES.COMPANION_REQ.code);
  }

  const companions = Array.isArray(request.body.companions_list)
    ? request.body.companions_list
    : [request.body.companions_list];

  for (const comp of companions) {
    if (!comp.full_name) {
      return badRequest(response, Constants.MESSAGES.COMPANION_NAME_REQ.code);
    }
    if (!comp.contact_number) {
      return badRequest(response, Constants.MESSAGES.CONTACT_NUM_REQ.code);
    }
    if (!comp.national_id) {
      return badRequest(response, Constants.MESSAGES.COMPANION_NID_REQ.code);
    }
    if (!comp.relation_patient) {
      return badRequest(response, Constants.MESSAGES.RELATION_REQ.code);
    }
  }

  next();
};

export const viewPatientValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const updatePatientValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }

  if (request.body.patient_id) {
    return badRequest(
      response,
      Constants.MESSAGES.FORBIDDEN_INTERNAL_FIELDS.PATIENTS.code
    );
  }
  if (
    request.body.first_name !== undefined &&
    request.body.first_name.trim() === ""
  ) {
    return badRequest(response, Constants.MESSAGES.FIRST_NAME_REQ.code);
  }
  if (
    request.body.last_name !== undefined &&
    request.body.last_name.trim() === ""
  ) {
    return badRequest(response, Constants.MESSAGES.LAST_NAME_REQ.code);
  }

  if (
    request.body.national_id !== undefined &&
    request.body.national_id.trim() === ""
  ) {
    return badRequest(response, Constants.MESSAGES.NATIONAL_ID_REQ.code);
  }

  if (
    request.body.gender !== undefined &&
    !Object.values(enums.Gender).includes(request.body.gender)
  ) {
    return badRequest(response, Constants.MESSAGES.GENDER_REQ.code);
  }

  if (request.body.dob !== undefined) {
    const date = new Date(request.body.dob);
    if (isNaN(date.getTime())) {
      return badRequest(response, Constants.MESSAGES.DOB_REQ.code);
    }
  }

  if (request.body.address !== undefined) {
    const addr = request.body.address;
    if (!addr.city || addr.city.name.trim() === "") {
      return badRequest(response, Constants.MESSAGES.CITY_REQ.code);
    }
    if (!addr.country || addr.country.name.trim() === "") {
      return badRequest(response, Constants.MESSAGES.COUNTRY_REQ.code);
    }
    if (!addr.address || addr.address.trim() === "") {
      return badRequest(response, Constants.MESSAGES.ADDRESS_FIELD_REQ.code);
    }
    if (!addr.postal_code || addr.postal_code.trim() === "") {
      return badRequest(response, Constants.MESSAGES.POSTAL_CODE_REQ.code);
    }
  }


  next();
};

export const deletePatientValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }

  next();
};
