import prismaClient from "@/modules/prisma/prisma.client";
import {
  BadRequestException,
  NotFoundException,
} from "@/exceptions/HttpException";
import { Lot, Status } from "@prisma/client";
import { LotCreateDto } from "@/modules/lots/dto/lot-create.dto";
import { LotGetAllDto } from "@/modules/lots/dto/lot-get-all.dto";
import { LotUpdateDto } from "@/modules/lots/dto/lot-update.dto";
import { Queue, Worker } from "bullmq";
import { REDIS_CONFIGURATION } from "@/modules/redis/redis.client";
import { BidsService } from "@/modules/bids/bids.service";
import { io } from "@/modules/sockets/sockets.client";

export class LotsService {
  constructor(private readonly bidsService: BidsService) {}

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

    await this.addEndWorker(lot);
    this.addBidsWorker(lot);

    return lot;
  }

  private async addEndWorker(lot: Lot) {
    const lotsQueue = new Queue("lots-queue", {
      connection: REDIS_CONFIGURATION,
    });

    await lotsQueue.add(
      "end-lot",
      { lotId: lot.id },
      {
        delay: lot.timeInSec * 1000, // ⏰ через 5 минут
        jobId: `end-${lot.id}`,
      },
    );

    new Worker(
      "lots-queue",
      async (job) => {
        const { lotId } = job.data;

        const updated = await prismaClient.lot.updateMany({
          where: {
            id: lotId,
            status: Status.OPEN,
          },
          data: {
            status: Status.CLOSED,
          },
        });

        if (updated.count > 0) {
          console.log(`Lot ${lotId} is finished.`);
          io?.to(String(lotId)).emit(`lot:ended`);
        } else {
          console.log(`Lot ${lotId} is already finished.`);
        }
      },
      { connection: REDIS_CONFIGURATION },
    );
  }

  addBidsWorker(lot: Lot) {
    new Worker(
      `lot-${lot.id}`,
      async (bid) => {
        const { value, userId } = bid.data;
        await this.bidsService.placeBid({ value, userId, lot });
      },
      { connection: REDIS_CONFIGURATION },
    );
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
