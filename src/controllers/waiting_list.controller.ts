import mongoose from "mongoose";
import { ExpressMiddleware } from "../types/express.types";
import enums from "../enums.json";
import Constants from "../locales/constants";
import { badRequest, success } from "../response/response";
import { getErrorMessage } from "../middlewares/app.middlewares";

export const createEntryController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const priorityRating =
      Date.now() +
      (request.body.funding_type === enums.FundingTypes.PRIVATE ? -1000 : 0) +
      (request.body.funding_type === enums.FundingTypes.GOVERNMENT_AID
        ? -500
        : 0);

    const result = await mongoose.model("waiting_list").create({
      ...request.body,
      priorityRating,
    });

    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};
