import { noToken } from "./../response/response";
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import {
  internalServerError,
  invalidToken,
  unAuthorisedAccess,
} from "../response/response";
import type { JwtInterface } from "../types/interface.types";
import type { ExpressMiddlewareNext } from "../types/express.types";
import mongoose from "mongoose";
import { ObjectId } from "../utils/helpers";
import Constants from "../locales/constants";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authorisationMiddleware: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return noToken(response, Constants.MESSAGES.NO_TOKEN.code, {});
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userPayload = decodedToken as JwtInterface;
    (request as any).user = userPayload; // attach user to request object
    next();
  } catch (error) {
    return invalidToken(response, "Invalid Token", { error: error });
  }
};

export const authorizePermission = (requiredPermission: string) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userRole = (request as any).user.role;

      const roleDoc = await mongoose
        .model("roles")
        .findOne({ _id: ObjectId(userRole) })
        .exec();

      if (!roleDoc) {
        return response.status(403).json({ message: "Role not found" });
      }

      const hasPermission = roleDoc.permissions.includes(requiredPermission);

      if (!hasPermission) {
        return unAuthorisedAccess(response, Constants.MESSAGES.NO_ACCESS.code);
      }

      next();
    } catch (error) {
      console.error(error);
      return internalServerError(
        response,
        Constants.MESSAGES.INTERNAL_SERVER_ERROR.code
      );
    }
  };
};

// const rolePermissions = {
//   super_admin: ["*"],
//   admin: ["create_user", "delete_user", "view_reports"],
//   user: ["view_profile"],
// };

// export const authorize = (permission: string) => {
//   return (request: Request, response: Response, next: NextFunction) => {
//     const user = (request as any).user;

//     if (!user) {
//       return response.status(401).json({ message: "Unauthorized" });
//     }

//     const permissions = rolePermissions[user.role] || [];

//
//     if (permissions.includes("*")) {
//       return next();
//     }

//     if (!permissions.includes(permission)) {
//       return response.status(403).json({ message: "Forbidden - no access" });
//     }

//     next();
//   };
// };
