import mongoose from "mongoose";
import { ObjectId } from "../utils/helpers";
import Constants from "../locales/constants";

export const changeActiveStatusService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedStatus = await mongoose
        .model(payload.module)
        .findOneAndUpdate(
          { _id: ObjectId(payload.id), is_deleted: false },
          { $set: { is_active: payload.status } },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedStatus) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.UPDATE.code);
      }

      resolve(updatedStatus);
    } catch (error) {
      reject(error);
    }
  });
};
