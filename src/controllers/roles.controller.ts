import { badRequest, success } from "../response/response.ts";
import { addRolesService, updateRolesService, viewRolesService } from "../services/roles.service.ts";
import type { ExpressMiddleware } from "../types/express.types.ts";
import Lang from "../locales/en.json" with {type:"json"}
import { getErrorMessage } from "../middlewares/app.middlewares.ts";

export const addRolesController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const payload = request.body;

    const result = await addRolesService(payload) 
    return success(response,Lang.USER_CREATED,result)
  } catch (error) {
return badRequest(response,getErrorMessage(error))
  }
};

export const viewRolesController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const payload = request.body;

    const result = await viewRolesService(payload) 
    return success(response,Lang.SUCCESS,result)
  } catch (error) {
return badRequest(response,getErrorMessage(error))
  }
};

export const updateRolesController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const payload = request;

    const result = await updateRolesService(payload) 
    return success(response,Lang.USER_CREATED,result)
  } catch (error) {
return badRequest(response,getErrorMessage(error))
  }
};