import mongoose from "mongoose";
import { ObjectId } from "../utils/helpers";
import Constants from "../locales/constants";

export const createPatientService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newPatient = await mongoose.model("patients").create(payload);

      resolve(newPatient);
    } catch (error) {
      reject(error);
    }
  });
};

export const viewPatientService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const patient = await mongoose.model("patients").findOne({
        _id: ObjectId(payload.id),
        is_deleted: false,
      });

      if (patient) {
        resolve(patient);
      } else {
        return {
          code: "SOMETHING_WENT_WRONG",
          message: "Something went wrong!!",
        };
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const updatePatientService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (payload.patient_id) {
        delete payload.patient_id;
      }

      if (payload.national_id) {
        const existing = await mongoose.model("patients").findOne({
          national_id: payload.national_id,
          _id: { $ne: payload.id },
        });

        if (existing) {
          const error: any = new Error(
            "National ID already exists for another patient"
          );
          error.code = "DUPLICATE_NATIONAL_ID";
          throw error;
        }
      }

      const updatedPatient = await mongoose.model("patients").findOneAndUpdate(
        { _id: ObjectId(payload.id) },
        {
          $set: payload,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedPatient) {
        const error = new Error("Patient not found");
        throw error;
      }

      resolve(updatedPatient);
    } catch (error) {
      reject(error);
    }
  });
};

export const deletePatientService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedPatient = await mongoose.model("patients").findOneAndUpdate(
        { _id: ObjectId(payload.id) },
        {
          $set: { is_deleted: true },
        },
        { new: true, runValidators: true }
      );

      if (!deletedPatient) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.DELETE.code);
      }
      resolve(deletedPatient);
    } catch (error) {
      reject(error);
    }
  });
};
