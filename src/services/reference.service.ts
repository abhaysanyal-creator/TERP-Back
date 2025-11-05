import mongoose from "mongoose";
import Constants from "../locales/constants";
import { ObjectId } from "../utils/helpers";
import enums from "../enums.json";

export const listCountriesService = (): Promise<Record<string, any>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const countryData = await mongoose
        .model("countries")
        .find()
        .select("-created_at -updated_at")
        .exec();

      if (!countryData) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
      }

      resolve(countryData);
    } catch (error) {
      reject(error);
    }
  });
};

export const listStatesService = (
  payload: Record<string, any>
): Promise<Record<string, any>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const match = { "country._id": ObjectId(payload.country) };

      const aggregate: any = [
        {
          $match: match,
        },
      ];

      const stateData = await mongoose
        .model("states")
        .aggregate(aggregate)
        .exec();

      if (!stateData) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
      }

      resolve(stateData);
    } catch (error) {
      reject(error);
    }
  });
};

export const listCitiesService = (
  payload: Record<string, any>
): Promise<Record<string, any>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const match = {
        "country._id": ObjectId(payload.country),
        "state._id": ObjectId(payload.state),
      };

      const aggregate: any = [
        {
          $match: match,
        },
        {
          $project: {
            _id: 1,
            country: 1,
            code: 1,
            state: 1,
            name: 1,
          },
        },
      ];

      const stateData = await mongoose
        .model("cities")
        .aggregate(aggregate)
        .exec();

      if (!stateData) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
      }

      resolve(stateData);
    } catch (error) {
      reject(error);
    }
  });
};

export const createSpecialisationService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const finalPayload = payload.body;
      const type: string = payload.params.type;

      finalPayload.type = type;

      const newItem = await mongoose.model("metadatas").create(finalPayload);

      if (!newItem) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);
      }
      newItem.value === payload.name;

      resolve(newItem);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateSpecialisationService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newSpecialisation = await mongoose
        .model("metadatas")
        .findOneAndUpdate(
          { _id: payload.params.id },
          { $set: payload.body },
          { new: true, runValidators: true }
        );

      resolve(newSpecialisation);
    } catch (error) {
      reject(error);
    }
  });
};

export const listSpecialisationService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await mongoose
        .model("metadatas")
        .find({ is_deleted: false, type: payload.body.type })
        .exec();

      if (!data) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
      }

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteSpecialisationService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const specData = await mongoose.model("metadatas").findOneAndUpdate(
        { _id: ObjectId(payload.id) },
        {
          $set: { is_deleted: true },
        },
        { new: true, runValidators: true }
      );

      resolve(specData);
    } catch (error) {
      reject(error);
    }
  });
};

export const listEnumsService = async (): Promise<Record<string, any>> => {
  try {
    if (!enums) {
      throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
    }
    return enums;
  } catch (error) {
    throw error;
  }
};
