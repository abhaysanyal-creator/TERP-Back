import express from "express";
import morgan from "morgan";

export const applicationMiddlewares = (app: express.Application) => {
  console.log("✅ App Middlewares loaded");

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
