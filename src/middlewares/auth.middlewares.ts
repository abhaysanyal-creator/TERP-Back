import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { invalidToken, noToken } from "../response/response.js";
import type { JwtInterface } from "../types/interface.types.js";
import type { ExpressMiddlewareNext } from "../types/express.types.js";
import mongoose from "mongoose";
import { ObjectId } from "../utils/helpers.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authorisationMiddleware: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return noToken(response, "No Token Provided", {});
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
        return response
          .status(403)
          .json({ message: "Access denied: insufficient permissions" });
      }

      next();
    } catch (err) {
      console.error(err);
      response
        .status(500)
        .json({ message: "Server error while checking permissions" });
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
