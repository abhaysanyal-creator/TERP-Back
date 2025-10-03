import type { Request, Response, NextFunction } from "express";

export type ExpressMiddleware = (request: Request, response: Response) => void;

export type ExpressMiddlewareNext = (
  request: Request,
  response: Response,
  next: NextFunction
) => void;
