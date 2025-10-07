import express from "express";
import type { ExpressMiddlewareNext } from "../types/express.types.js";
import morgan from "morgan";
// export const apiLogger: ExpressMiddlewareNext = (req, res, next) => {
//   const start = Date.now();

//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     console.log(
//       `➡️ [${new Date().toISOString()}] ${req.method} ${req.originalUrl} | ` +
//         `Status: ${res.statusCode} | Duration: ${duration}ms | IP: ${req.ip}`
//     );
//   });

//   next();
// };

export const applicationMiddlewares = (app: express.Application) => {
  console.log("✅ Middlewares loaded");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(apiLogger);
  app.use(morgan("dev"))
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error occurred";
};
