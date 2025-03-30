import { Lot, Status } from "@prisma/client";
import { Queue, Worker } from "bullmq";
import { REDIS_CONFIGURATION } from "@/modules/redis/redis.client";
import prismaClient from "@/modules/prisma/prisma.client";
import { BidsService } from "@/modules/bids/bids.service";
import { io } from "@/modules/sockets/sockets.client";

export class LotsWorkers {
  constructor(private readonly bidsService: BidsService) {}

  async initAllWorkers() {
    const lots = await prismaClient.lot.findMany({
      where: { status: Status.OPEN },
    });

    if (!lots.length) return;

    for (const lot of lots) {
      await this.addBidsWorker(lot);
      await this.addEndWorker(lot);
    }
  }

  private async addBidsWorker(lot: Lot) {
    console.log("Worker init for", lot.id);
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

  private async addEndWorker(lot: Lot) {
    const lotsQueue = new Queue("lots-queue", {
      connection: REDIS_CONFIGURATION,
    });

    await lotsQueue.add(
      "end-lot",
      { lotId: lot.id },
      {
        delay: lot.timeInSec * 1000,
        jobId: `end-${lot.id}`,
      },
    );

    new Worker(
      "lots-queue",
      async (job) => {
        const { lotId } = job.data;

        const updated = await prismaClient.lot.updateMany({
          where: { id: lotId, status: Status.OPEN },
          data: { status: Status.CLOSED },
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
}
