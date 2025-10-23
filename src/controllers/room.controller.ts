import constants from "../locales/constants";
import { badRequest, success } from "../response/response";
import { createRoomService, viewRoomService } from "../services/room.service";
import { ExpressMiddleware } from "../types/express.types";
import Constants from "../locales/constants";
import { getErrorMessage } from "../middlewares/app.middlewares";
import mongoose from "mongoose";
export const createRoomController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await createRoomService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewRoomController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingRoom = await mongoose
      .model("rooms")
      .findById(request.params.id)
      .exec();

    if (!existingRoom) {
      return badRequest(response, Constants.MESSAGES.ID_REQ.code);
    }

    const result = await viewRoomService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};


export const updateRoomController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await createRoomService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};