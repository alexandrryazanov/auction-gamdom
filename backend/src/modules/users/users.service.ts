import prismaClient from "@/modules/prisma/prisma.client";
import { BadRequestException } from "@/exceptions/HttpException";

export class UsersService {
  async getAll() {
    const users = await prismaClient.user.findMany();

    if (users.length === 0) {
      throw new BadRequestException("No users found");
    }

    return users;
  }
}
