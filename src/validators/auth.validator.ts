import type {ExpressMiddlewareNext } from "../types/express.types";
import { badRequest } from "../response/response";
import Lang from "../locales/en.json"

export const loginValidator: ExpressMiddlewareNext = (request, response, next) => {
  if (!request.body.email) {
    return badRequest(response, Lang.EMAIL_IS_REQUIRED);
  }
   if (!request.body.password) {
    return badRequest(response, Lang.PASSWORD_IS_REQUIRED);
  }
  next();
};

export const resendCodeValidator: ExpressMiddlewareNext = (request, response, next) => {
  if (!request.body.email) {
    return badRequest(response, Lang.EMAIL_IS_REQUIRED);
  }
  next();
};