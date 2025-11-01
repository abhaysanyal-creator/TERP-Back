import { Request, Response, NextFunction } from "express";
import { badRequest } from "../response/response";
import { getErrorMessage } from "./app.middlewares";
import Constants from "../locales/constants";

export const assignScopesForRole = (role: string) => {
  switch (role) {
    case "therapist":
      return ["ehr.read"];
    case "system_admin":
      return ["ehr.read", "ehr.write"];
    case "super_admin":
      return ["ehr.read", "ehr.write"];
    default:
      return [];
  }
};

export const requireScope = (scope: string) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = (request as any).user;

      if (!user || !user.role || !user.role.permissions) {
        return response.status(403).json({
          code: Constants.MESSAGES.NO_ACCESS.code,
        });
      }

      const hasPermission = user.role.permissions.some(
        (perm: any) => perm.permission === scope
      );

      if (!hasPermission) {
        return response.status(403).json({
          code: Constants.MESSAGES.NO_ACCESS.code,
          required: scope,
        });
      }

      next();
    } catch (error) {
      return badRequest(response, getErrorMessage(error));
    }
  };
};
