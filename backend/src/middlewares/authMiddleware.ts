import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "@/exceptions/HttpException";
import { DecodedPayload, TokenType } from "@/modules/auth/auth.types";
import jwt from "jsonwebtoken";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = (req.headers as unknown as { authorization: string })
    .authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedException(`There is no token in headers`));
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
  } catch (e) {
    return next(new UnauthorizedException(`Token could not be verified. ` + e));
  }

  const { sub, type } = payload as DecodedPayload;

  if (type !== TokenType.ACCESS) {
    return next(new UnauthorizedException(`Wrong token type`));
  }

  if (!sub) {
    return next(new UnauthorizedException(`There is no userId in token`));
  }

  req["userId"] = payload.sub;

  return next();
}
