import mongoose from "mongoose";
import Constants from "../locales/constants";
import { ObjectId } from "../utils/helpers";

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
