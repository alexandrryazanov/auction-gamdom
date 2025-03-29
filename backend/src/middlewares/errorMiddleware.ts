import { NextFunction, Request, Response } from "express";
import { HttpException } from "@/exceptions/HttpException";

export const errorMiddleware: (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
) => void = (error, request, response, next) => {
  const status = error.status || 500;
  const message = error.message.replace(/\n/g, "") || "Something went wrong";
  const details = error.details || "Something went wrong";

  return response.status(status).json({ status, message, details });
};
