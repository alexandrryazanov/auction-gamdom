import prismaClient from "@/modules/prisma/prisma.client";
import { BadRequestException } from "@/exceptions/HttpException";

export class UsersService {
  async getById(id: number) {
    const user = await prismaClient.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException("No such user");
    }

    return user;
  }
}
