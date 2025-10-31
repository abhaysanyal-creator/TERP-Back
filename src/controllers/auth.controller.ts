import { badRequest, errorResponse, success } from "../response/response";
import type { ExpressMiddleware } from "../types/express.types";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { loginService, verifyOtpService } from "../services/auth.service";

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
    const { userId, otp } = request.body;
    const result = await verifyOtpService(userId, otp);

    return success(response, result.response.code, {
      message: result.response.message,
      token: result.token,
      user: result.user,
      scope: result.user.role.permissions.map((p: any) => p.permission),
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
