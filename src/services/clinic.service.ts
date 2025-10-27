import mongoose from "mongoose";
import Constants from "../locales/constants";
import { ObjectId } from "../utils/helpers";

export const createClinicService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newClinic = await mongoose.model("clinics").create(payload);

      if (!newClinic) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);
      }
      resolve(newClinic);
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

      const clinic = await mongoose
        .model("clinics")
        .findOne({ _id: id })
        .exec();

      if (!clinic) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
      }

      resolve(clinic);
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
      if (payload.clinic_id) {
        delete payload.clinic_id;
      }

      const updatedClinic = await mongoose
        .model("clinics")
        .findOneAndUpdate(
          { _id: ObjectId(payload.id) },
          { $set: payload },
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

export const deleteClinicService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedClinic = await mongoose.model("clinics").findOneAndUpdate(
        {
          _id: ObjectId(payload.id),
        },
        {
          $set: { is_deleted: true },
        },
        { new: true }
      );
      resolve(deletedClinic);
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

      // if (payload.org_type) and.push({ org_type: payload.org_type });
      // if (payload.number_of_rooms)
      //   and.push({
      //     number_of_rooms: payload.number_of_rooms,
      //   });
      // if (payload.protected_space)
      //   and.push({ protected_space: payload.protected_space });

      if (payload.working_hours)
        and.push({
          operating_hours: payload.operating_hours,
        });

      if (payload.search) {
        or.push(
          { clinic_id: { $regex: payload.search, $options: "i" } },
          { name: { $regex: payload.search, $options: "i" } }
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

      const [clinics, countResult] = await Promise.all([
        mongoose.model("clinics").aggregate(pipeline),
        mongoose.model("clinics").aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      resolve({
        data: clinics,
        count: totalCount,
      });
    } catch (error) {
      reject(error);
    }
  });
};