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
              patient_id: newBooking.patient.id,
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

export const updateAppointmentsService = (
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

export const updateSessionsStatusService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const requestBody = payload.body.status;
      const id = payload.params.id;

      const updatedBooking = await mongoose
        .model("sessions")
        .findOneAndUpdate(
          { _id: ObjectId(id) },
          {
            $set: {
              status: requestBody,
            },
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

export const listAppointmentService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const page = Number(payload.page) || 1;
      const limit = Number(payload.limit) || 10;
      const skip = (page - 1) * limit;

      const match: Record<string, any> = {
        is_deleted: false,
      };

      const or: any[] = [];
      const and: any[] = [];

      if (payload.patient_id) and.push({ "patient.id": payload.patient_id });

      if (payload.clinic_id)
        and.push({ clinic_id: ObjectId(payload.clinic_id) });

      if (payload.therapist_id)
        and.push({ "therapist.id": ObjectId(payload.therapist_id) });

      if (payload.treatment_id)
        and.push({ "treatment.id": payload.treatment_id });

      if (payload.is_active !== undefined)
        and.push({ is_active: payload.is_active });

      if (payload.status) and.push({ status: payload.status });

      if (payload.search) {
        or.push({ "patient.name": { $regex: payload.search, $options: "i" } });
        or.push({ session_id: { $regex: payload.search, $options: "i" } });
      }

      if (or.length) and.push({ $or: or });
      if (and.length) match.$and = and;

      const pipeline: any[] = [
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ];

      const countPipeline = [{ $match: match }, { $count: "total" }];

      const [sessions, countResult] = await Promise.all([
        mongoose.model("sessions").aggregate(pipeline),
        mongoose.model("sessions").aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      resolve({
        data: sessions,
        meta: {
          pages: Math.ceil(totalCount / limit),
          page,
          limit,
          total: totalCount,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};
