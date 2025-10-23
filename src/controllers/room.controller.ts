import { createRoomService } from "../services/room.service";
import { ExpressMiddleware } from "../types/express.types";

export const createRoomController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await createRoomService(request.body);
  } catch (error) {}
};
