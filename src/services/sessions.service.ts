import mongoose from "mongoose";
import { generateCode, ObjectId } from "../utils/helpers";
import Constants from "../locales/constants";
import enums from "../enums.json";

export const createAppointmentService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newBooking = await mongoose.model("sessions").create(payload);

      if (!newBooking) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);
      }

      const pushed = await mongoose.model("activities").updateOne(
        {
          _id: ObjectId(payload.clinic_id),
          "rooms.id": ObjectId(payload.treatment_area.id),
        },
        {
          $push: {
            "rooms.$.bookings": {
              session_id: newBooking.session_id,
              therapist_id: newBooking.therapist.id,
              patient_id: newBooking.patient,
              scheduled_date: newBooking.scheduled_date,
              scheduled_start: newBooking.scheduled_start,
              scheduled_end: newBooking.scheduled_end,
              status: enums.Room_Status.BOOKED,
            },
          },
        }
      );

      resolve(newBooking);
    } catch (error) {
      reject(error);
    }
  });
};

export const viewAppointmentService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingBooking = await mongoose
        .model("sessions")
        .findById(ObjectId(payload.id))
        .exec();

      if (!existingBooking) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
      }

      resolve(existingBooking);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const updateBookingService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const requestBody = payload.body;
      const id = payload.params.id;

      const updatedBooking = await mongoose
        .model("sessions")
        .findOneAndUpdate(
          { _id: ObjectId(id) },
          {
            $set: requestBody,
          },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedBooking) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.UPDATE.code);
      }

      resolve(updatedBooking);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteBookingService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedBooking = await mongoose
        .model("bookings")
        .findOneAndUpdate(
          { _id: ObjectId(payload.id), is_deleted: { $ne: true } },
          { $set: { is_deleted: true } },
          { new: true, runValidators: true }
        )
        .exec();

      if (!deletedBooking) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.DELETE.code);
      }
      resolve(deletedBooking);
    } catch (error) {
      reject(error);
    }
  });
};

export const changeBookingStatusService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const changedBooking = await mongoose
        .model("bookings")
        .findOneAndReplace(
          { _id: payload.id, is_deleted: false },
          { $set: { status: payload.status } },
          { new: true, runValidators: true }
        )
        .exec();

      if (!changedBooking) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.UPDATE.code);
      }

      resolve(changedBooking);
    } catch (error) {
      reject(error);
    }
  });
};
