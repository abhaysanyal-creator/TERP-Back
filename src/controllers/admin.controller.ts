import { badRequest, success } from "../response/response.js";
import { createAdmin, viewAdminService } from "../services/admin.service.js";
import type { ExpressMiddleware } from "../types/express.types.js";
import Lang from "../locales/en.json" with {type:"json"}
import { getErrorMessage } from "../middlewares/app.middlewares.js";
import { request } from "http";

export const adminCreateController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const payload = request.body;

    const result = await createAdmin(payload)
   
    return success(response,Lang.USER_CREATED,result)
  } catch (error) {
    return badRequest(response,getErrorMessage(error))
  }
};

export const viewAdminController:ExpressMiddleware = async (request,response) => {
try {
  const payload = request.params;
  const result = await viewAdminService(payload)
return success(response,Lang.SUCCESS,result)
} catch (error) {
  return badRequest(response,getErrorMessage(error))
}
}

export const updateAdminController:ExpressMiddleware = async (request,response)=>{
  try {
    
  } catch (error) {
    
  }
}