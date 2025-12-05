import { getErrorMessage } from "../middlewares/app.middlewares";
import { badRequest, success } from "../response/response";
import { ExpressMiddleware } from "../types/express.types";
import Constants from "../locales/constants";
import {
  addRecurringSessionsService,
  createAppointmentService,
  // getCalendarDataService,
  listAppointmentService,
  updateAppointmentsService,
  updateSessionsStatusService,
  viewAppointmentService,
} from "../services/sessions.service";
import mongoose from "mongoose";
import { generateCode, ObjectId } from "../utils/helpers";
import enums from "../enums.json";
import { assigningWaitingListService } from "../services/assignWaitingListService";

const sessionsModel = mongoose.model("sessions");
const activityModel = mongoose.model("activities");
const employeeModel = mongoose.model("employees");
const waitingListModel = mongoose.model("waiting_list");

export const createAppointmentController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const session_id = await generateCode("TH", 10);
    request.body.session_id = session_id;

    // Checking for the recurrence

    const isRecurring = request.body.is_recurring === true;
    //validating only the parent session
    const validateDate = request.body.scheduled_date;
    const validateStart = request.body.scheduled_start;
    const validateEnd = request.body.scheduled_end;

    // Check for room overlap
    const overlappingBooking = await activityModel.findOne({
      _id: ObjectId(request.body.activity.id),
      "rooms.id": ObjectId(request.body.treatment_area.id),
      "rooms.bookings": {
        $elemMatch: {
          scheduled_date: validateDate,
          $or: [
            {
              scheduled_start: { $lt: validateEnd },
              scheduled_end: { $gt: validateStart },
            },
          ],
          status: "booked",
        },
      },
    });

    if (overlappingBooking) {
      return badRequest(response, Constants.MESSAGES.ROOM_UNAVAIL.code);
    }

    const therapist = await employeeModel
      .findOne({ _id: ObjectId(request.body.therapist.id) })
      .lean()
      .exec();

    // if (!therapist) {
    //   return badRequest(
    //     response,
    //     Constants.MESSAGES.THERAPIST_DOESNT_EXIST.code
    //   );
    // }

    // const overLappingAppointment = await sessionsModel.findOne({
    //   "therapist.id": ObjectId(request.body.therapist.id),
    //   scheduled_date: validateDate,
    //   status: { $ne: enums.SessionStatus.CANCELLED },
    //   scheduled_start: { $lt: validateEnd },
    //   scheduled_end: { $gt: validateStart },
    // });

    // if (overLappingAppointment) {
    //   await waitingListModel.create({
    //     therapist_id: request.body.therapist.id,
    //     patient_id: request.body.patient.id,
    //     preferred_date: validateDate,
    //     preferred_start: validateStart,
    //     preferred_end: validateEnd,
    //   });
    //   return badRequest(
    //     response,
    //     Constants.MESSAGES.THERAPIST_UNAVAIL_ADDING_TO_WAIT_LIST.code
    //   );
    // }
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

export const updateAppointmentsController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingSession = await mongoose
      .model("sessions")
      .findOne({ _id: ObjectId(request.params.id) })
      .exec();

    if (!existingSession)
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);

    const result = await updateAppointmentsService(request);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const updateSessionStatusController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingSession = await mongoose
      .model("sessions")
      .findOne({ _id: ObjectId(request.params.id) })
      .exec();

    if (!existingSession)
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);

    if (request.body.status === existingSession.status) {
      return badRequest(response, Constants.MESSAGES.NO_CHANGES.code);
    }

    const result = await updateSessionsStatusService(request);

    if (
      (result && request.body.status === enums.SessionStatus.CANCELLED) ||
      request.body.status === enums.SessionStatus.COMPLETED
    ) {
      assigningWaitingListService();
    }
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

export const addRecurringSessionsController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const parent_session = await sessionsModel.findById(
      ObjectId(request.params.id)
    );

    if (!parent_session) {
      return badRequest(response, Constants.MESSAGES.SESSION_ID_REQ.code);
    }

    const validateDate = request.body.scheduled_date;
    const validateStart = request.body.scheduled_start;
    const validateEnd = request.body.scheduled_end;

    const overlappingBooking = await activityModel.findOne({
      _id: ObjectId(parent_session.activity.id),
      "rooms.id": ObjectId(parent_session.treatment_area.id),
      "rooms.bookings": {
        $elemMatch: {
          scheduled_date: validateDate,
          $or: [
            {
              scheduled_start: { $lt: validateEnd },
              scheduled_end: { $gt: validateStart },
            },
          ],
          status: "booked",
        },
      },
    });

    if (overlappingBooking) {
      return badRequest(response, Constants.MESSAGES.ROOM_UNAVAIL.code);
    }

    const result = await addRecurringSessionsService(request, parent_session);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};


// export const getCalendarDataController: ExpressMiddleware = async (
//   request,
//   response
// ) => {
//   try {
//     const result = await getCalendarDataService(request.body);
//     return success(response, Constants.MESSAGES.SUCCESS.code, result);
//   } catch (error) {
//     console.error(error);
//     return badRequest(response, getErrorMessage(error));
//   }
// };