import { badRequest, success } from "../response/response.ts";
import { createAdmin, viewAdminService } from "../services/admin.service.ts";
import type { ExpressMiddleware } from "../types/express.types.ts";
import Lang from "../locales/en.json" with {type:"json"}
import { getErrorMessage } from "../middlewares/app.middlewares.ts";

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