import { badRequest } from "../response/response.ts";
import type { ExpressMiddlewareNext } from "../types/express.types.ts";
import Lang from "../locales/en.json" with {type:"json"}

export const addPermissionsValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.created_by) {
    return badRequest(response, Lang.CREATED_BY_REQ);
  }
  if (!request.body.name) {
    return badRequest(response, Lang.NAME_IS_REQUIRED);
  }
  if (!request.body.icon) {
    return badRequest(response, Lang.ICON_REQUIRED);
  }
  next();
};
