import mongoose from "mongoose";
import { generateCode, ObjectId } from "../utils/helpers";
import Constants from "../locales/constants";

export const createBookingService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const booking_code = generateCode("B");
      payload.booking_id = booking_code;

      const newBooking = await mongoose.model("bookings").create(payload);

      if (!newBooking) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);
      }

      //Update the status of the rooms as booked
      await mongoose.model("rooms").findByIdAndUpdate(payload.room_id, {
        $push: {
          bookings: {
            day: payload.booking_details.day,
            slots: payload.booking_details.slots,
            booking_id: newBooking._id,
          },
        },
      });
      resolve(newBooking);
    } catch (error) {
      reject(error);
    }
  });
};

export const viewBookingService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingBooking = await mongoose
        .model("bookings")
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
        .model("employees")
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
