import { addPermissionService } from "../services/permissions.service.js";
import type { ExpressMiddleware } from "../types/express.types.js";
import Lang from "../locales/en.json" with {type:"json"}
import { badRequest, success } from "../response/response.js";
import { getErrorMessage } from "../middlewares/app.middlewares.js";

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
