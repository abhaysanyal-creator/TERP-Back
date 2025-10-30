import { badRequest } from "../response/response";
import Lang from "../locales/en.json";
import { ExpressMiddlewareNext } from "../types/express.types";

export const assignPermissionsValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  // ✅ Basic required fieldsclg

  console.log("first")
  if (!request.body.created_by) {
    return badRequest(response, Lang.CREATED_BY_REQ);
  }
  // ✅ Validate optional `permissions` array if provided
  if (request.body.permissions && !Array.isArray(request.body.permissions)) {
    return badRequest(response, "Permissions must be an array");
  }
  
  if (request.body.permissions && Array.isArray(request.body.permissions)) {
    for (const [index, permission] of request.body.permissions.entries()) {
      if (!permission.name) {
        return badRequest(
          response,
          `Permission name missing at index ${index}`
        );
      }
      if (!permission.permission) {
        return badRequest(response, `Permission key missing at index ${index}`);
      }
      if (!permission.module) {
        return badRequest(response, `Module missing at index ${index}`);
      }
    }
  }
  
  next();
};
