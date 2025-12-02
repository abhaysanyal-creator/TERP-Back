import mongoose from "mongoose";
import { generateCode, ObjectId } from "../utils/helpers";
import Constants from "../locales/constants";
import enums from "../enums.json";
import { getSignedUrlForView } from "../controllers/upload.controller";
import { generateRecurringSessions } from "../utils/getRecurrences";
import { ISession } from "../types/interface.types";

const sessionsModel = mongoose.model("sessions");
const patientsModel = mongoose.model("patients");
const activitiesModel = mongoose.model("activities");

export const createAppointmentService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (payload.patient.id) {
        await patientsModel
          .findOneAndUpdate(
            {
              _id: ObjectId(payload.patient.id),
            },
            {
              $set: {
                therapist: payload.therapist,
              },
            },
            {
              new: true,
            }
          )
          .exec();
      }

      const occurences = payload.recurrence?.occurrences ?? 1;

      const newBooking = await sessionsModel.create({
        ...payload,
        parent_session_id: null,
      });

      if (!newBooking) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);
      }

      if (!payload.is_recurring || !payload.recurrence) {
        resolve([newBooking]);
      }

      const recurringDates = generateRecurringSessions(
        new Date(payload.scheduled_date),
        payload.recurrence
      );

      const childSessions: ISession[] = [];

      for (const date of recurringDates) {
        const isoDate = date.toISOString().split("T")[0];
        const child = await sessionsModel.create({
          ...payload,
          scheduled_date: isoDate,
          parent_session_id: newBooking._id,
          is_recurring: false, // children must not recursively generate
          recurrence: null,
        });

        childSessions.push(child);
        await activitiesModel.updateOne(
          {
            _id: ObjectId(payload.clinic_id),
            "rooms.id": ObjectId(payload.treatment_area.id),
          },
          {
            $push: {
              "rooms.$.bookings": {
                session_id: child.session_id,
                therapist_id: child.therapist.id,
                patient_id: child.patient.id,
                scheduled_date: child.scheduled_date,
                scheduled_start: child.scheduled_start,
                scheduled_end: child.scheduled_end,
                status: enums.Room_Status.BOOKED,
              },
            },
          }
        );
      }

      await activitiesModel.updateOne(
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
      const existingBooking = await sessionsModel
        .findById(ObjectId(payload.id))
        .exec();

      if (!existingBooking) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
      }

      existingBooking.documents = await Promise.all(
        (existingBooking.documents || []).map(async (doc: any) => ({
          ...doc,
          signedUrl: await getSignedUrlForView(doc.key),
        }))
      );
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

      const updatedBooking = await sessionsModel
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

      const updatedBooking = await sessionsModel
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
      const deletedBooking = await sessionsModel
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
      const changedBooking = await sessionsModel
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

      if (payload.date) {
        const start = new Date(payload.date);
        const end = new Date(payload.date);
        end.setDate(end.getDate() + 1);
        console.log(payload.date);

        and.push({
          scheduled_date: {
            $gte: start,
            $lt: end,
          },
        });
      }

      if (payload.from_date && payload.to_date) {
        const start = new Date(payload.from_date);
        const end = new Date(payload.to_date);

        // Include full last day
        end.setDate(end.getDate() + 1);

        and.push({
          scheduled_date: {
            $gte: start,
            $lt: end,
          },
        });
      }

      if (payload.time) {
        const time = new Date(payload.time).toISOString().substring(11, 16);

        and.push({
          $expr: {
            $eq: [{ $substr: ["$scheduled_start", 11, 5] }, time],
          },
        });
      }

      if (payload.patient_id) and.push({ "patient.id": payload.patient_id });

      if (payload.clinic_id)
        and.push({ clinic_id: ObjectId(payload.clinic_id) });

      if (payload.therapist_id)
        and.push({ "therapist.id": ObjectId(payload.therapist_id) });

      if (payload.therapist) and.push({ "therapist.name": payload.therapist });

      if (payload.treatment_id)
        and.push({ "treatment.id": payload.treatment_id });

      if (payload.treatment) and.push({ "treatment.name": payload.treatment });

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
        sessionsModel.aggregate(pipeline),
        sessionsModel.aggregate(countPipeline),
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

export const addRecurringSessionsService = (
  payload: Record<string, any>,
  parent_session: ISession
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const payloadBody = payload.body;

      if (payloadBody.patient.id) {
        await patientsModel
          .findOneAndUpdate(
            {
              _id: ObjectId(payloadBody.patient.id),
            },
            {
              $set: {
                therapist: payloadBody.therapist,
              },
            },
            {
              new: true,
            }
          )
          .exec();
      }

      const occurences = payloadBody.recurrence?.occurrences ?? 1;

      // const newBooking = await sessionsModel.create({
      //   ...payloadBody,
      //   parent_session_id: null,
      // });

      // if (!newBooking) {
      //   throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);
      // }

      // if (!payloadBody.is_recurring || !payloadBody.recurrence) {
      //   resolve([newBooking]);
      // }

      const recurringDates = generateRecurringSessions(
        new Date(parent_session.scheduled_date),
        payloadBody.recurrence
      );

      const recurrenceGroupId =
        parent_session.recurrence_group_id ?? new mongoose.Types.ObjectId();

      if (!parent_session.recurrence_group_id) {
        await sessionsModel.updateOne(
          { _id: parent_session._id },
          { $set: { recurrence_group_id: recurrenceGroupId } }
        );
      }

      const childSessions: Partial<ISession>[] = [];

      for (const date of recurringDates) {
        const isoDate = date.toISOString().split("T")[0];

        const childSessionCode = `${parent_session.session_id}-R-${
          childSessions.length + 1
        }`;
        const childSessionPayload: Partial<ISession> = {
          ...payloadBody,
          session_id: childSessionCode,
          scheduled_date: isoDate,
          is_recurring: true,
          is_parent_session: false,
          recurrence: null,
          parent_session_id: parent_session._id,
          recurrence_group_id: recurrenceGroupId,
        };

        const child = await sessionsModel.create(childSessionPayload);

        childSessions.push(child);

        await activitiesModel.updateOne(
          {
            _id: ObjectId(payloadBody.clinic_id),
            "rooms.id": ObjectId(payloadBody.treatment_area.id),
          },
          {
            $push: {
              "rooms.$.bookings": {
                session_id: child.session_id,
                therapist_id: child.therapist.id,
                patient_id: child.patient.id,
                scheduled_date: child.scheduled_date,
                scheduled_start: child.scheduled_start,
                scheduled_end: child.scheduled_end,
                status: enums.Room_Status.BOOKED,
              },
            },
          }
        );
      }
      resolve(childSessions);
    } catch (error) {
      reject(error);
    }
  });
};
