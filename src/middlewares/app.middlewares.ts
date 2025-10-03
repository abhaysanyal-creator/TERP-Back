import express from "express";

export const applicationMiddlewares = (app: express.Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error occurred";
};
