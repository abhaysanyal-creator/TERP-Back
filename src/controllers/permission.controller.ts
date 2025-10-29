import {
  assignPermissionService,
  listPermissionService,
} from "../services/permissions.service";
import type { ExpressMiddleware } from "../types/express.types";
import { badRequest, success } from "../response/response";
import { getErrorMessage } from "../middlewares/app.middlewares";
import Constants from "../locales/constants";

// export const addPermissionController: ExpressMiddleware = async (
//   request,
//   response
// ) => {
//   try {
//     const payload = request.body;
//     const result = await addPermissionService(payload);
//     return success(response,Lang.ADD_SUCCESS,result)
//   } catch (error) {
// return badRequest(response,getErrorMessage(error))

//   }
// };

export const assignPermissionController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await assignPermissionService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error: any) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const listPermissionController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listPermissionService();
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error: any) {
    return badRequest(response, getErrorMessage(error));
  }
};
