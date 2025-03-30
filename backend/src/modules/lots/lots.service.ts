import prismaClient from "@/modules/prisma/prisma.client";
import {
  BadRequestException,
  NotFoundException,
} from "@/exceptions/HttpException";
import { Status } from "@prisma/client";
import { LotCreateDto } from "@/modules/lots/dto/lot-create.dto";
import { LotGetAllDto } from "@/modules/lots/dto/lot-get-all.dto";
import { LotUpdateDto } from "@/modules/lots/dto/lot-update.dto";
import { LotsWorkers } from "@/modules/lots/lots.workers";

export class LotsService {
  constructor(private readonly lotsWorkers: LotsWorkers) {}

  async getAll({ limit = 10, offset = 0 }: LotGetAllDto) {
    return prismaClient.lot.findMany({
      take: limit,
      skip: offset,
      orderBy: [{ createdAt: "desc" }],
    });
  }

  async getById(id: number) {
    const lot = await prismaClient.lot.findUnique({
      where: { id },
      include: {
        winner: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!lot) {
      throw new NotFoundException("lot", id);
    }

    return lot;
  }

  async create(dto: LotCreateDto) {
    const lot = await prismaClient.lot.create({
      data: {
        startPriceInCents: dto.startPriceInCents,
        minPriceStep: dto.minPriceStep,
        maxPriceStep: dto.maxPriceStep,
        name: dto.name,
        timeInSec: dto.timeInSec,
      },
    });

    await this.lotsWorkers.addBidsWorker(lot);
    await this.lotsWorkers.addEndWorker(lot);

    return lot;
  }

  async updateById(id: number, dto: LotUpdateDto) {
    const lot = await prismaClient.lot.findUnique({
      where: { id },
    });

    if (!lot) {
      throw new NotFoundException("lot", 1);
    }

    if (lot.status === Status.CLOSED) {
      throw new BadRequestException("Could not change closed lot");
    }

    return prismaClient.lot.update({
      where: { id },
      data: {
        name: dto.name,
        maxPriceStep: dto.maxPriceStep,
        minPriceStep: dto.minPriceStep,
      },
    });
  }

  async deleteById(id: number) {
    const lot = await prismaClient.lot.findUnique({
      where: { id },
    });

    if (!lot) {
      throw new NotFoundException("lot", 1);
    }

    return prismaClient.lot.delete({ where: { id } });
  }
}
