import type {ExpressMiddlewareNext } from "../types/express.types.js";
import { badRequest } from "../response/response.js";
import Lang from "../locales/en.json" with {type:"json"}

export const loginValidator: ExpressMiddlewareNext = (request, response, next) => {
  if (!request.body.email) {
    return badRequest(response, Lang.EMAIL_IS_REQUIRED);
  }
   if (!request.body.password) {
    return badRequest(response, Lang.PASSWORD_IS_REQUIRED);
  }
  next();
};

