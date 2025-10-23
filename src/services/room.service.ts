import { ObjectId } from "./../utils/helpers";
import mongoose from "mongoose";
import Constants from "../locales/constants";

export const createRoomService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newRoom = await mongoose.model("rooms").create(payload);
      if (!newRoom) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);
      }
      resolve(newRoom);
    } catch (error) {
      reject(error);
    }
  });
};

export const viewRoomService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await mongoose
        .model("rooms")
        .findOne({ _id: ObjectId(payload.id) })
        .exec();

      if (!room) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
      }
      resolve(room);
    } catch (error) {
      reject(error);
    }
  });
};

