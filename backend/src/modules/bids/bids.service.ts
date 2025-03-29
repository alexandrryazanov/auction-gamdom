import redisClient from "@/modules/redis/redis.client";
import { io } from "@/modules/sockets/sockets.client";
import { Lot } from "@prisma/client";

export class BidsService {
  async placeBid({
    userId,
    value,
    lot,
  }: {
    userId: number;
    value: number;
    lot: Lot;
  }) {
    const lotName = `lot-${lot.id}`;
    const lotBidsString = await redisClient?.get(lotName);
    const lotBids = JSON.parse(lotBidsString || "[]") as {
      value: number;
      userId: number;
    }[];
    if (userId === lotBids[0]?.userId) {
      // Cannot bid twice
      return;
    }
    const lastPrice = lotBids[0]?.value || lot.startPriceInCents;
    if (
      value < lastPrice + lot.minPriceStep ||
      value > lastPrice + lot.maxPriceStep
    ) {
      // max/min
      return;
    }

    const updatedBids = [{ userId, value }, ...lotBids];

    await redisClient.set(lotName, JSON.stringify(updatedBids));
    io?.to(lotName).emit("bid:placed", updatedBids);
  }
}
