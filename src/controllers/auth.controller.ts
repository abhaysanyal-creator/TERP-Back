import { badRequest, errorResponse, success } from "../response/response";
import type { ExpressMiddleware } from "../types/express.types";
import { getErrorMessage } from "../middlewares/app.middlewares";
import {
  forgotPasswordService,
  getMeService,
  loginService,
  resendOtpService,
  resetPasswordService,
  verifyOtpService,
} from "../services/auth.service";
import Constants from "../locales/constants";

export const loginController: ExpressMiddleware = async (request, response) => {
  try {
    const payload = request.body;

    const result = await loginService(payload);

    return success(response, result.message, {
      userId: result.userId,
      otp: result.otp,
    });
  } catch (error) {
    const err = error as any;
    if (err.status && err.error) {
      return errorResponse(
        response,
        err.status,
        err.error.code,
        err.error.message
      );
    }
    return badRequest(response, getErrorMessage(err));
  }
};

export const verifyOtpController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const { userId, otp, isMFA } = request.body;
    const result = await verifyOtpService(userId, otp, isMFA);

    return success(response, result.response.code, {
      message: result.response.message,
      token: result.token,
      user: result.result,
      session_id: result.sessionId
    });
  } catch (error) {
    const err = error as any;
    if (err.status && err.error) {
      return errorResponse(
        response,
        err.status,
        err.error.code,
        err.error.message
      );
    }
    return badRequest(response, getErrorMessage(err));
  }
};

export const getMeController: ExpressMiddleware = async (request, response) => {
  try {
    const user = (request as any).user;
    const result = await getMeService(user);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const resendOtpController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await resendOtpService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const forgotPasswordController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result =await forgotPasswordService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const resetPasswordController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result =await resetPasswordService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};
