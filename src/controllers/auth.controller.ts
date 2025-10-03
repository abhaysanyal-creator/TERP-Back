import { badRequest, success } from "../response/response.js";
import type { ExpressMiddleware } from "../types/express.types.js";
import { getErrorMessage } from "../middlewares/app.middlewares.js";
import { loginService } from "../services/auth.service.js";

export const loginController: ExpressMiddleware = async (request, response) => {
  try {
    const payload = request.body;

    const result = await loginService(payload);

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
