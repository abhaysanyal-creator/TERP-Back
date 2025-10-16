import mongoose from "mongoose";
import type { ExpressMiddleware } from "../types/express.types";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants.ts";
import { createClinicService } from "../services/clinic.service";
import { getErrorMessage } from "../middlewares/app.middlewares";

export const createClinicController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const isClinicExist = await mongoose
      .model("clinics")
      .findOne({ branch_name: request.body.branch_name })
      .exec();

    if (isClinicExist) {
      return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);
    }

    const result = await createClinicService(request.body);
    
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};
