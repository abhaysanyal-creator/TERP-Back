import mongoose from "mongoose";
import { ExpressMiddleware } from "../types/express.types";
import enums from "../enums.json";
import Constants from "../locales/constants";
import { badRequest, success } from "../response/response";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { assigningWaitingListService } from "../services/assignWaitingListService";
import { ObjectId } from "../utils/helpers";

export const createEntryController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const priorityRating =
      Date.now() +
      (request.body.funding_type === enums.FundingTypes.PRIVATE ? -1000 : 0) +
      (request.body.funding_type === enums.FundingTypes.GOVERNMENT_AID
        ? -500
        : 0);

    const result = await mongoose.model("waiting_list").create({
      ...request.body,
      priorityRating,
    });

    assigningWaitingListService();
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const listEntryController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const payload = request.body;
    const page = Number(payload.page) || 1;
    const limit = Number(payload.limit) || 10;
    const skip = (page - 1) * limit;

    const match: Record<string, any> = {
      is_deleted: false,
    };

    const or: any[] = [];
    const and: any[] = [];

    // if (payload.patient_id) and.push({ "patient.id": payload.patient_id });

    // if (payload.clinic_id) and.push({ clinic_id: ObjectId(payload.clinic_id) });

    // if (payload.therapist_id)
    //   and.push({ "therapist.id": ObjectId(payload.therapist_id) });

    // if (payload.treatment_id)
    //   and.push({ "treatment.id": payload.treatment_id });

    // if (payload.is_active !== undefined)
    //   and.push({ is_active: payload.is_active });

    // if (payload.status) and.push({ status: payload.status });

    // if (payload.search) {
    //   or.push({ "patient.name": { $regex: payload.search, $options: "i" } });
    //   or.push({ session_id: { $regex: payload.search, $options: "i" } });
    // }

    if (payload.scheduled_date) {
      const start = new Date(payload.scheduled_date);
      const end = new Date(payload.scheduled_date);
      end.setDate(end.getDate() + 1);

      and.push({
        scheduled_date: {
          $gte: start,
          $lt: end,
        },
      });
    }
    if (payload.scheduled_time) {
      const time = new Date(payload.scheduled_time)
        .toISOString()
        .substring(11, 16);

      and.push({
        $expr: {
          $eq: [{ $substr: ["$scheduled_start", 11, 5] }, time],
        },
      });
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

    const [entries, countResult] = await Promise.all([
      mongoose.model("waiting_list").aggregate(pipeline),
      mongoose.model("waiting_list").aggregate(countPipeline),
    ]);

    const totalCount = countResult[0]?.total || 0;

    return {
      data: entries,
      meta: {
        pages: Math.ceil(totalCount / limit),
        page,
        limit,
        total: totalCount,
      },
    };
  } catch (error) {
    return error;
  }
};
