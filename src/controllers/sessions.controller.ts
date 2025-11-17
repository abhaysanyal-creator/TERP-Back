import { getErrorMessage } from "../middlewares/app.middlewares";
import { badRequest, success } from "../response/response";
import { ExpressMiddleware } from "../types/express.types";
import Constants from "../locales/constants";
import {
  changeBookingStatusService,
  createAppointmentService,
  deleteBookingService,
  listAppointmentService,
  updateBookingService,
  viewAppointmentService,
} from "../services/sessions.service";
import mongoose from "mongoose";
import { generateCode, ObjectId } from "../utils/helpers";
import isEqual from "lodash/isEqual";
import enums from "../enums.json";

export const createAppointmentController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const session_id = await generateCode("TH", 10);
    request.body.session_id = session_id;

    const overlappingBooking = await mongoose.model("activities").findOne({
      _id: ObjectId(request.body.clinic_id),
      "rooms.id": ObjectId(request.body.treatment_area.id),
      "rooms.bookings": {
        $elemMatch: {
          scheduled_date: request.body.scheduled_date,
          $or: [
            {
              scheduled_start: { $lt: request.body.scheduled_end },
              scheduled_end: { $gt: request.body.scheduled_start },
            },
          ],
          status: "booked",
        },
      },
    });

    if (overlappingBooking) {
      return badRequest(response, Constants.MESSAGES.ROOM_UNAVAIL.code);
    }

    const therapist = await mongoose
      .model("employees")
      .findOne({ _id: ObjectId(request.body.therapist.id) })
      .lean()
      .exec();

    if (!therapist) {
      return badRequest(
        response,
        Constants.MESSAGES.THERAPIST_DOESNT_EXIST.code
      );
    }

    const overLappingAppointment = await mongoose.model("sessions").findOne({
      "therapist.id": ObjectId(request.body.therapist.id),
      scheduled_date: request.body.scheduled_date,
      status: { $ne: enums.SessionStatus.CANCELLED },
      scheduled_start: { $lt: request.body.scheduled_end },
      scheduled_end: { $gt: request.body.scheduled_start },
    });

    if (overLappingAppointment) {
      return badRequest(response, Constants.MESSAGES.THERAPIST_UNAVAIL.code);
    }
    const result = await createAppointmentService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewAppointmentController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isBookingExist = await mongoose
      .model("sessions")
      .findOne({ _id: ObjectId(request.params.id), is_deleted: false })
      .exec();

    console.log(isBookingExist);
    if (!isBookingExist) {
      return badRequest(response, Constants.MESSAGES.ID_REQ.code);
    }

    const result = await viewAppointmentService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(Error));
  }
};

export const updateBookingsController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingBooking = await mongoose
      .model("bookings")
      .findById(request.body.id)
      .exec();

    if (!existingBooking) {
      return badRequest(response, Constants.MESSAGES.ID_REQ.code);
    }

    const { start_time, end_time, therapist } = request.body;

    let hasChanges = false;

    if (
      isEqual(start_time, existingBooking.start_time) ||
      isEqual(end_time, existingBooking.end_time)
    ) {
      hasChanges = true;
    }

    if (therapist && existingBooking.therapist) {
      const therapistChanged = isEqual(therapist, existingBooking.therapist);
      if (therapistChanged) hasChanges = true;
    }

    if (!hasChanges) {
      return badRequest(response, Constants.MESSAGES.NO_CHANGES.code);
    }

    const result = await updateBookingService(request.body);

    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const deleteBookingsController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const id = request.params.id as string;

    const existingBooking = await mongoose
      .model("bookings")
      .findById(ObjectId(id))
      .exec();

    if (!existingBooking) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }
    const result = await deleteBookingService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const changeBookingStatusController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingBooking = await mongoose
      .model("bookings")
      .findById(request.body.id)
      .exec();

    if (!existingBooking) {
      return badRequest(response, Constants.MESSAGES.ID_REQ.code);
    }

    if (existingBooking.status === request.body.status) {
      return badRequest(response, Constants.MESSAGES.NO_CHANGES.code);
    }

    const result = await changeBookingStatusService(request.body);

    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const listAppointmentController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listAppointmentService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};