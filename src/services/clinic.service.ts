import mongoose, { PipelineStage } from "mongoose";
import Constants from "../locales/constants";
import { ObjectId } from "../utils/helpers";
import { Clinic } from "../types/interface.types";

const clinicModel = mongoose.model<Clinic>("clinics");

export const createClinicService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newActivity = await clinicModel.create(payload);

      if (!newActivity) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);
      }
      resolve(newActivity);
    } catch (error) {
      reject(error);
    }
  });
};

export const viewClinicService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = ObjectId(payload.id);

      const activity = await clinicModel.findOne({ _id: id }).exec();

      if (!activity) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
      }

      resolve(activity);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateClinicService = (
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

      const updatedActivity = await clinicModel
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

export const deleteClinicService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedActivity = await clinicModel.findOneAndUpdate(
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

export const listClinicService = (
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
      if (payload.organisation_id)
        and.push({
          "organisation.id": ObjectId(payload.organisation_id),
        });

      if (payload.protected_space)
        and.push({ protected_space: payload.protected_space });

      if (payload.working_hours)
        and.push({
          operating_hours: payload.operating_hours,
        });

      if (payload.search) {
        or.push(
          {
            "organisation.name": {
              $regex: payload.search.trim(),
              $options: "i",
            },
          },
          {
            name: { $regex: payload.search.trim(), $options: "i" },
          }
        );
      }

      if (or.length) and.push({ $or: or });
      if (and.length) match.$and = and;

      const pipeline: PipelineStage[] = [
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ];

      const countPipeline = [{ $match: match }, { $count: "total" }];

      const [clinics, countResult] = await Promise.all([
        clinicModel.aggregate(pipeline),
        clinicModel.aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      resolve({
        data: clinics,
        meta: {
          count: totalCount,
          pages: Math.ceil(totalCount / limit),
          page: page,
          limit: limit,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const addEmployeeClinicService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (payload.body.internal_code) {
        delete payload.body.internal_code;
      }

      const updatedClinic = await clinicModel
        .findOneAndUpdate(
          { _id: ObjectId(payload.params.id) },
          {
            $push: {
              employees: payload.body,
            },
          },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedClinic) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.UPDATE.code);
      }
      resolve(updatedClinic);
    } catch (error) {
      reject(error);
    }
  });
};
