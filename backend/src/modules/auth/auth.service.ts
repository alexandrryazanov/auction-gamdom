import { pbkdf2Sync, randomBytes } from "crypto";
import {
  BadRequestException,
  UnauthorizedException,
} from "@/exceptions/HttpException";
import prismaClient from "@/modules/prisma/prisma.client";
import { EXPIRES_IN } from "@/modules/auth/auth.constants";
import { DecodedPayload, TokenType } from "@/modules/auth/auth.types";
import { RegisterDto } from "@/modules/auth/dto/register.dto";
import { LoginDto } from "@/modules/auth/dto/login.dto";
import jwt from "jsonwebtoken";

export class AuthService {
  private hashPassword(password: string, salt: string) {
    return pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  }

  async register({ email, password }: RegisterDto) {
    const existedUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existedUser) {
      throw new BadRequestException("Could not use this email");
    }

    const salt = randomBytes(32).toString("hex");

    return prismaClient.user.create({
      data: {
        email,
        hashedPassword: this.hashPassword(password, salt),
        salt,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async login({ email, password }: LoginDto) {
    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException(
        "Wrong credentials",
        "No such user or password incorrect",
      );
    }

    const hashedPassword = this.hashPassword(password, user.salt);

    if (user.hashedPassword !== hashedPassword) {
      throw new BadRequestException(
        "Wrong credentials",
        "No such user or password incorrect",
      );
    }

    return this.generateTokensPair({ sub: user.id });
  }

  async refresh(token: string) {
    if (!token) {
      throw new UnauthorizedException("No token in cookie");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
      return this.generateTokensPair({ sub: decoded.sub });
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  private generateTokensPair(payload: Omit<DecodedPayload, "type">) {
    const accessToken = jwt.sign(
      { ...payload, type: TokenType.ACCESS },
      process.env.JWT_SECRET_KEY || "",
      {
        expiresIn: EXPIRES_IN.ACCESS,
      },
    );
    const refreshToken = jwt.sign(
      { ...payload, type: TokenType.REFRESH },
      process.env.JWT_SECRET_KEY || "",
      {
        expiresIn: EXPIRES_IN.REFRESH,
      },
    );

    return { accessToken, refreshToken };
  }
}
