import { JwtPayload } from "jsonwebtoken";

export interface DecodedPayload extends Omit<JwtPayload, "sub"> {
  sub: number; // userId
  type: TokenType;
}

export enum TokenType {
  ACCESS,
  REFRESH,
}
