import { badRequest } from "../response/response";
import { ExpressMiddlewareNext } from "../types/express.types";
import Constants from "../locales/constants";

export const createAppointmentValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.patient) {
    return badRequest(response, Constants.MESSAGES.PATIENT_ID_REQ.code);
  }
  if (!request.body.clinic_id) {
    return badRequest(response, Constants.MESSAGES.CLINIC_ID_REQ.code);
  }
  if (!request.body.treatment) {
    return badRequest(response, Constants.MESSAGES.TREATMENT_TYPE_REQ.code);
  }

  if (request.body.therapist) {
    const therapist = request.body.therapist;
    if (therapist.first_name === "") {
      return badRequest(response, Constants.MESSAGES.THERAPIST.NAME_REQ.code);
    }
    if (therapist.name === "") {
      return badRequest(response, Constants.MESSAGES.THERAPIST.NAME_REQ.code);
    }
    if (therapist.id==="") {
      return badRequest(response, Constants.MESSAGES.THERAPIST.ID_REQ.code);
    }
  }
  if (!request.body.treatment_area) {
    return badRequest(response, Constants.MESSAGES.ROOM_ID_REQ.code);
  }
  if (!request.body.scheduled_date) {
    return badRequest(response, Constants.MESSAGES.SESSION_DATE_REQ.code);
  }
  if (!request.body.scheduled_start) {
    return badRequest(response, Constants.MESSAGES.START_TIME_REQ.code);
  }
  if (!request.body.scheduled_end) {
    return badRequest(response, Constants.MESSAGES.START_TIME_REQ.code);
  }
  next();
};

export const viewAppointmentValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const updateBookingValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }

  if (request.body.clinic_id && request.body.clinic_id === "") {
    return badRequest(response, Constants.MESSAGES.CLINIC_ID_REQ.code);
  }

  if (request.body.room_id && request.body.room_id === "") {
    return badRequest(response, Constants.MESSAGES.ROOM_TYPE_REQ.code);
  }

  if (request.body.patient_id && request.body.patient_id === "") {
    return badRequest(response, Constants.MESSAGES.PATIENT_ID_REQ.code);
  }

  if (request.body.therapist) {
    const therapist = request.body.therapist;

    if ("name" in therapist && therapist.name === "") {
      return badRequest(response, Constants.MESSAGES.THERAPIST.NAME_REQ.code);
    }

    if ("id" in therapist && !therapist.id) {
      return badRequest(response, Constants.MESSAGES.THERAPIST.ID_REQ.code);
    }

    if ("organisation" in therapist && !therapist.organisation) {
      return badRequest(
        response,
        Constants.MESSAGES.THERAPIST.ORGANISATION_REQ.code
      );
    }
  }

  if (request.body.start_time && request.body.start_time === "") {
    return badRequest(response, Constants.MESSAGES.START_TIME_REQ.code);
  }

  if (request.body.end_time && request.body.end_time === "") {
    return badRequest(response, Constants.MESSAGES.END_TIME_REQ.code);
  }

  next();
};

export const deleteBookingValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const changeBookingStatusValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};
