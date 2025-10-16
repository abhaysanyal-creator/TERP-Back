import mongoose from "mongoose";
import Constants from "../locales/constants.ts";
import { generateCode, ObjectId } from "../utils/helpers.ts";

export const createOrganisationService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      payload.internal_code = generateCode("ORG");

      const countryName: string = payload.address.country
        .slice(0, 2)
        .toUpperCase();

      payload.institution_code = generateCode(countryName);

      const newOrganisation = await mongoose
        .model("organisations")
        .create(payload);

      newOrganisation
        ? resolve(newOrganisation)
        : reject(Constants.MESSAGES.INVALID_FORMAT.code);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const viewOrganisationService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingOrganisation = await mongoose
        .model("organisations")
        .findOne({ _id: ObjectId(payload.id), is_deleted: false })
        .exec();

      existingOrganisation
        ? resolve(existingOrganisation)
        : reject(Constants.MESSAGES.INVALID_FORMAT.code);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const updateOrganisationService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      delete payload.institution_code;
      delete payload.internal_code;

      const updatedOrganisation = await mongoose
        .model("organisations")
        .findOneAndUpdate(
          { _id: ObjectId(payload.id), is_deleted: false },
          { $set: payload },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedOrganisation)
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);

      resolve(updatedOrganisation);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const deleteOrganisationService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedOrganisation = await mongoose
        .model("organisations")
        .findOneAndUpdate(
          {
            _id: ObjectId(payload.id),
            is_deleted: false,
          },
          {
            $set: { is_deleted: true },
          },
          { new: true }
        );
      resolve(deletedOrganisation);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const listOrganisationService = (
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

      if (payload.org_type) and.push({ org_type: payload.org_type });
      if (payload.number_of_rooms)
        and.push({
          number_of_rooms: payload.number_of_rooms,
        });
      if (payload.protected_space)
        and.push({ protected_space: payload.protected_space });

      if (payload.operating_hours)
        and.push({
          operating_hours: payload.operating_hours,
        });

      if (payload.search) {
        or.push(
          { org_name: { $regex: payload.search, $options: "i" } },
          { institution_code: { $regex: payload.search, $options: "i" } }
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

      const [organisations, countResult] = await Promise.all([
        mongoose.model("organisations").aggregate(pipeline),
        mongoose.model("organisations").aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      resolve({
        data: organisations,
        count: totalCount,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const changeOperatingHoursOrganisationService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const operatingHours = payload.operating_hours;
      const id = payload.id;

      const changedOperatingHours = await mongoose
        .model("organisations")
        .findOneAndUpdate(
          { _id: ObjectId(id), is_deleted: { $ne: true } },
          { $set: { working_hours: operatingHours } },
          { returnDocument: "after" }
        )
        .exec();

      if (!changedOperatingHours) {
        throw new Error("Problem Changing the working hours!!");
      }
      resolve(changedOperatingHours);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
