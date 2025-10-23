import { addPermissionService } from "../services/permissions.service";
import type { ExpressMiddleware } from "../types/express.types";
import Lang from "../locales/en.json"
import { badRequest, success } from "../response/response";
import { getErrorMessage } from "../middlewares/app.middlewares";

export const addPermissionController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const payload = request.body;
    const result = await addPermissionService(payload);
    return success(response,Lang.ADD_SUCCESS,result)
  } catch (error) {
return badRequest(response,getErrorMessage(error))

  }
};
