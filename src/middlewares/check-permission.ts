import { NextFunction, Request, Response } from "express";
import Constants from "../locales/constants";

export const checkPermissions = (routes: string | string[]) => {
  const allowedRoutes = Array.isArray(routes) ? routes : [routes];

  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const requestUser = (req as any).user;
      const userPermissions = requestUser?.role?.permissions || [];
      if (!userPermissions) {
        throw Error(Constants.MESSAGES.NO_ACCESS.code);
      }

      const hasPermission = allowedRoutes.some((route) =>
        userPermissions.some(
          (userPermission: any) => userPermission.permission === route
        )
      );

      console.log(hasPermission)
      if (!hasPermission) {
        throw new Error(Constants.MESSAGES.NO_ACCESS.code);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
