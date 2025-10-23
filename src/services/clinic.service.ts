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
