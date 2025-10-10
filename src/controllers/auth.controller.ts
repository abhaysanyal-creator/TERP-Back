import { badRequest, errorResponse, success } from "../response/response.js";
import type { ExpressMiddleware } from "../types/express.types.js";
import { getErrorMessage } from "../middlewares/app.middlewares.js";
import { loginService, verifyOtpService } from "../services/auth.service.js";

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

    return success(response, result.message, {
      token: result.token,
      user: { id: result.user.id, name: result.user.name },
      role: result.role,
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
