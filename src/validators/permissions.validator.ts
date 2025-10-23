import { badRequest } from "../response/response";
import type { ExpressMiddlewareNext } from "../types/express.types";
import Lang from "../locales/en.json"

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
