import mongoose from "mongoose";
import Constants from "../locales/constants";

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
