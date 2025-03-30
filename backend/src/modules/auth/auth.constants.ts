import ms, { StringValue } from "ms";
import { CookieOptions } from "express-serve-static-core";

export const EXPIRES_IN: Record<string, StringValue> = {
  ACCESS: "10m",
  REFRESH: "1d",
};

export const COOKIE_OPTIONS: CookieOptions = {
  maxAge: ms(EXPIRES_IN.REFRESH),
  httpOnly: true,
  secure: process.env.ENV === "production",
};
