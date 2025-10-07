import { badRequest, success } from "../response/response.js";
import type { ExpressMiddleware } from "../types/express.types.js";
import { getErrorMessage } from "../middlewares/app.middlewares.js";
import { loginService, verifyOtpService } from "../services/auth.service.js";

export const loginController: ExpressMiddleware = async (request, response) => {
  try {
    const payload = request.body;

    const result = await loginService(payload);

    return success(response, result.message, {
      userId: result.userId,
    });
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
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
      userId: result.userId,
      role: result.role,
    });
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};
