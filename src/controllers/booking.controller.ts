import { getErrorMessage } from "../middlewares/app.middlewares";
import { badRequest, success } from "../response/response";
import { ExpressMiddleware } from "../types/express.types";
import Constants from "../locales/constants";
import {
  changeBookingStatusService,
  createBookingService,
  deleteBookingService,
  updateBookingService,
  viewBookingService,
} from "../services/booking.service";
import mongoose from "mongoose";
import { isRoomAvailable, ObjectId } from "../utils/helpers";
import isEqual from "lodash/isEqual";

export const createBookingController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isClinicExist = await mongoose
      .model("clinics")
      .findById(request.body.clinic_id)
      .exec();

    if (!isClinicExist) {
      return badRequest(response, Constants.MESSAGES.CLINIC_ID_REQ.code);
    }

    // Therpist Availability Check

    const therapist = await mongoose
      .model("employees")
      .findById(ObjectId(request.body.therapist.id))
      .exec();

    if (!therapist) {
      return badRequest(response, Constants.MESSAGES.THERAPIST_FIELD_REQ.code);
    }

    const therapistBusy = therapist.bookings?.some(
      (b: any) =>
        b.day === request.body.day &&
        b.slots.some(
          (slot: any) =>
            request.body.start_time < slot.end_time &&
            request.body.end_time > slot.start_time
        )
    );

    if (therapistBusy) {
      return badRequest(response, Constants.MESSAGES.THERAPIST_UNAVAIL.code);
    }

    // Room Availability Check

    const room = await mongoose.model("rooms").find({
      clinic_id: request.body.clinic_id,
      $nor: [
        {
          booked_slots: {
            $elemMatch: {
              start_time: { $lt: request.body.end_time },
              end_time: { $gt: request.body.start_time },
            },
          },
        },
      ],
    });

    if (!room) {
      return badRequest(response, Constants.MESSAGES.INVALID_ROOMS.code);
    }

    if (
      !isRoomAvailable(
        room,
        request.body.day,
        request.body.start_time,
        request.body.end_time
      )
    ) {
      return badRequest(response, Constants.MESSAGES.ROOM_UNAVAIL.code);
    }

    const result = await createBookingService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewBookingController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isBookingExist = await mongoose
      .model("bookings")
      .findOne({ _id: ObjectId(request.params.id), is_deleted: false })
      .exec();

    if (!isBookingExist) {
      return badRequest(response, Constants.MESSAGES.ID_REQ.code);
    }

    const result = await viewBookingService(request.params);
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
