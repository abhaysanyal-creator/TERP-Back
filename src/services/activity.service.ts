import mongoose from "mongoose";
import Constants from "../locales/constants";
import { ObjectId } from "../utils/helpers";

export const createActivityService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newActivity = await mongoose.model("activities").create(payload);

      if (!newActivity) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);
      }
      resolve(newActivity);
    } catch (error) {
      reject(error);
    }
  });
};

export const viewActivityService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = ObjectId(payload.id);

      const activity = await mongoose
        .model("activities")
        .findOne({ _id: id })
        .exec();

      if (!activity) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
      }

      resolve(activity);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateActivityService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (payload.body.activity_id) {
        delete payload.body.activity_id;
      }

      if (payload.body.internal_code) {
        delete payload.body.internal_code;
      }

      const updatedActivity = await mongoose
        .model("activities")
        .findOneAndUpdate(
          { _id: ObjectId(payload.params.id) },
          { $set: payload.body },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedActivity) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.UPDATE.code);
      }
      resolve(updatedActivity);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteActivityService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedActivity = await mongoose
        .model("activities")
        .findOneAndUpdate(
          {
            _id: ObjectId(payload.id),
          },
          {
            $set: { is_deleted: true },
          },
          { new: true }
        );
      resolve(deletedActivity);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const listActivityService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const page = Number(payload.page) || 1;
      const limit = Number(payload.limit) || 10;
      const skip = (page - 1) * 10;

      const match: Record<string, any> = {
        is_deleted: false,
      };

      const or: any[] = [];
      const and: any[] = [];

      if (payload.id) and.push({ id: ObjectId(payload.id) });
      if (payload.activity_name) and.push({ id: payload.activity_name });
      if (payload.organisation_id)
        and.push({
          "organisation.id": ObjectId(payload.organisation_id),
        });
      if (payload.department_id)
        and.push({
          "department.id": ObjectId(payload.department_id),
        });

      if (payload.protected_space)
        and.push({ protected_space: payload.protected_space });

      if (payload.working_hours)
        and.push({
          operating_hours: payload.operating_hours,
        });

      if (payload.search) {
        or.push(
          { "organisation.name": { $regex: payload.search, $options: "i" } },
          { "department.name": { $regex: payload.search, $options: "i" } }
        );
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

      const [activities, countResult] = await Promise.all([
        mongoose.model("activities").aggregate(pipeline),
        mongoose.model("activities").aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      resolve({
        data: activities,
        count: totalCount,
      });
    } catch (error) {
      reject(error);
    }
  });
};
