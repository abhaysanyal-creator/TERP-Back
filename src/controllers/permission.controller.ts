import { addPermissionService } from "../services/permissions.service.ts";
import type { ExpressMiddleware } from "../types/express.types.ts";
import Lang from "../locales/en.json" with {type:"json"}
import { badRequest, success } from "../response/response.ts";
import { getErrorMessage } from "../middlewares/app.middlewares.ts";

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
