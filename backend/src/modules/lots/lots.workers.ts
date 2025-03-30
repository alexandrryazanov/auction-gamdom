import { Lot, Status } from "@prisma/client";
import { Queue, Worker } from "bullmq";
import redisClient, { REDIS_CONFIGURATION } from "@/modules/redis/redis.client";
import prismaClient from "@/modules/prisma/prisma.client";
import { BidsService } from "@/modules/bids/bids.service";
import { io } from "@/modules/sockets/sockets.client";

export class LotsWorkers {
  private endLotWorker: Worker | null = null;
  constructor(private readonly bidsService: BidsService) {}

  async initAllWorkers() {
    this.initEndWorker();

    const lots = await prismaClient.lot.findMany({
      where: { status: Status.OPEN },
    });

    if (!lots.length) return;

    for (const lot of lots) {
      await this.addBidsWorker(lot);
      await this.addLotToEndWorker(lot);
    }
  }

  async addBidsWorker(lot: Lot) {
    console.log("Bids worker init for", lot.id);
    new Worker(
      `lot-${lot.id}`,
      async (bid) => {
        const { value, userId, socketId, email } = bid.data;
        await this.bidsService.placeBid({
          value,
          userId,
          lot,
          socketId,
          email,
        });
      },
      { connection: REDIS_CONFIGURATION },
    );
  }

  async addLotToEndWorker(lot: Lot) {
    console.log("Ending worker init for", lot.id);
    const lotsQueue = new Queue("lots-queue", {
      connection: REDIS_CONFIGURATION,
    });

    const currentDuration = Math.floor(
      (new Date().getTime() - new Date(lot.createdAt).getTime()) / 1000,
    );
    const timeLeft = lot.timeInSec - currentDuration;

    try {
      await lotsQueue.remove(`end-lot-${lot.id}`); // if exists
      await lotsQueue.add(
        `end-lot-${lot.id}`,
        { lotId: lot.id },
        {
          delay: (timeLeft < 0 ? 0 : timeLeft) * 1000,
          jobId: `end-lot-${lot.id}`,
        },
      );
    } catch (e) {
      console.log(e);
    }
  }

  private initEndWorker() {
    console.log("End worker init");
    this.endLotWorker = new Worker(
      "lots-queue",
      async (job) => {
        const { lotId } = job.data;
        console.log("Start ending lot", lotId);

        // Calc the winner
        const lotName = `lot-${lotId}`;
        const lotBidsString = await redisClient?.get(lotName);
        const lotBids = JSON.parse(lotBidsString || "[]") as {
          value: number;
          userId: number;
          email: string;
        }[];

        const winnerId = lotBids[0]?.userId || null;

        const updated = await prismaClient.lot.update({
          where: { id: lotId, status: Status.OPEN },
          data: { status: Status.CLOSED, winnerId },
          include: { winner: { select: { id: true, email: true } } },
        });

        if (updated) {
          console.log(`Lot ${lotId} is finished.`);
          io?.to(String(lotId)).emit(`lot:ended`, { winner: updated.winner });
        } else {
          console.log(`Lot ${lotId} is already finished.`);
        }
      },
      { connection: REDIS_CONFIGURATION },
    );
  }
}
