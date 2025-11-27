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

export const forgotPasswordValidator: ExpressMiddlewareNext = (request, response, next) => {
  if (!request.body.email) {
    return badRequest(response, Lang.EMAIL_IS_REQUIRED);
  }
  next();
};

export const resetPasswordValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (
    !request.body.session_id ||
    !request.body.password ||
    !request.body.email
  ) {
    return badRequest(
      response,
      request.body.password
        ? request.body.session_id
          ? Lang.EMAIL_IS_REQUIRED
          : Lang.TOKEN_REQUIRED
        : Lang.PASSWORD_IS_REQUIRED
    );
  }
  next();
};