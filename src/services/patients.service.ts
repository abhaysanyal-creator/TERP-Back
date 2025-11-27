import mongoose from "mongoose";
import { generateCode, ObjectId } from "../utils/helpers";
import Constants from "../locales/constants";
import { getSignedUrlForView } from "../controllers/upload.controller";

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
      const updatedPatient = await mongoose.model("patients").findOneAndUpdate(
        { _id: ObjectId(payload.params.id) },
        {
          $set: payload.body,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedPatient) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.UPDATE.code);
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

      if (payload.contact_number)
        and.push({ contact_number: payload.contact_number });

      if (payload.is_active !== undefined)
        and.push({ is_active: payload.is_active });

      if (payload.therapist_id) {
        and.push({ "therapist.id": ObjectId(payload.therapist_id) });
      }

      if (payload.search) {
        or.push({
          $expr: {
            $regexMatch: {
              input: { $concat: ["$first_name", " ", "$last_name"] },
              regex: payload.search.trim(),
              options: "i",
            },
          },
        });
        or.push({
          patient_id: { $regex: payload.search.trim(), $options: "i" },
        });
        or.push({
          "organisation_assignment.name": {
            $regex: payload.search,
            $options: "i",
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

      const [patients, countResult] = await Promise.all([
        mongoose.model("patients").aggregate(pipeline),
        mongoose.model("patients").aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      resolve({
        data: patients,
        meta: {
          total: totalCount,
          page: page,
          limit: limit,
          pages: Math.floor(totalCount / limit) + 1,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};
