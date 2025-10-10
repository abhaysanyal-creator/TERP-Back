import type { Response } from "express";

export const badRequest = (response: Response, message: string): Response => {
  return response.status(400).json({
    statusCode: 400,
    message: message,
    status: "Bad Request",
  });
};

export const errorResponse = (
  response: Response,
  statusCode: number,
  errorCode: string,
  message: string
): Response => {
  return response.status(statusCode).json({
    status: statusCode,
    success: false,
    error: {
      code: errorCode,
      message: message,
    },
  });
};

export const success = (
  response: Response,
  message: string,
  data: Record<string, any>
): Response => {
  return response.status(200).json({
    statusCode: 200,
    message: message,
    data: data,
    status: "success",
  });
};

export const noToken = (
  response: Response,
  message: string,
  data: Record<string, any>
): Response => {
  return response.status(401).json({
    statusCode: 401,
    message: message,
    data: data,
    status: "No Token Provided!!",
  });
};

export const invalidToken = (
  response: Response,
  message: string,
  data: Record<string, any>
): Response => {
  return response.status(403).json({
    statusCode: 403,
    message: message,
    data: data,
    status: "Invalid Token!!",
  });
};
