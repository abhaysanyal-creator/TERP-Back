import type {ExpressMiddlewareNext } from "../types/express.types.js";
import { badRequest } from "../response/response.js";
import Lang from "../locales/en.json" with {type:"json"}

export const addRolesValidator: ExpressMiddlewareNext = (request, response, next) => {
  if (!request.body.name) {
    return badRequest(response, Lang.NAME_IS_REQUIRED);
  }
     if (!request.body.permissions) {
    return badRequest(response, Lang.ADD_PERM);
  }
  next();
};

export const updateRolesValidator: ExpressMiddlewareNext = (request, response, next) => {
  if(!request.params.id){
    return badRequest(response, Lang.ID_REQUIRED);
  }
  if (!request.body.name) {
    return badRequest(response, Lang.NAME_IS_REQUIRED);
  }
     if (!request.body.permissions) {
    return badRequest(response, Lang.ADD_PERM);
  }
  next();
};

