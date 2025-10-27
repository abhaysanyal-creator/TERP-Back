import mongoose from "mongoose";
import { generateCode, ObjectId } from "../utils/helpers";
import Constants from "../locales/constants";

export const createPatientService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const patientId = await generateCode("PAT", 10);

      payload.patient_id = patientId;

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
            Constants.MESSAGES.DUPLICATE_NATIONAL_ID.code
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

export const listPatientService = (
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

      const [patients, countResult] = await Promise.all([
        mongoose.model("patients").aggregate(pipeline),
        mongoose.model("patients").aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      resolve({
        data: patients,
        count: totalCount,
      });
    } catch (error) {
      reject(error);
    }
  });
};
