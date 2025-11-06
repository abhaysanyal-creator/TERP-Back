import mongoose from "mongoose";
import { changeActiveStatusService } from "../services/common.service";
import { ExpressMiddleware } from "../types/express.types";
import { ObjectId } from "../utils/helpers";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants";
import { getErrorMessage } from "../middlewares/app.middlewares";

export const changeActiveStatusController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existing = await mongoose
      .model(request.body.module)
      .findOne({ _id: ObjectId(request.body.id) })
      .exec();

    if (!existing) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }
    const result = await changeActiveStatusService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};
