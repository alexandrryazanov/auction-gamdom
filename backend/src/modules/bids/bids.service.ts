import redisClient from "@/modules/redis/redis.client";
import { io } from "@/modules/sockets/sockets.client";
import { Lot } from "@prisma/client";

export class BidsService {
  async placeBid({
    userId,
    email,
    value,
    lot,
    socketId,
  }: {
    userId: number;
    email: string;
    value: number;
    lot: Lot;
    socketId: string;
  }) {
    console.log("BID PLACED");
    const lotName = `lot-${lot.id}`;
    const lotBidsString = await redisClient?.get(lotName);
    const lotBids = JSON.parse(lotBidsString || "[]") as {
      value: number;
      userId: number;
      email: string;
    }[];
    if (userId === lotBids[0]?.userId) {
      io
        ?.to(socketId)
        .emit("error", "Cannot bid twice. Wait for another user's bid");
      return;
    }

    const lastBid = lotBids[0] ? Number(lotBids[0]?.value) : undefined;
    const lastPrice = lastBid || lot.startPriceInCents;
    if (
      value < lastPrice + lot.minPriceStep ||
      value > lastPrice + lot.maxPriceStep
    ) {
      io
        ?.to(socketId)
        .emit(
          "error",
          `bid should be between ${lastPrice + lot.minPriceStep} and ${lastPrice + lot.maxPriceStep}`,
        );
      return;
    }

    const updatedBids = [{ userId, email, value }, ...lotBids];

    await redisClient.set(lotName, JSON.stringify(updatedBids));
    io?.to(String(lot.id)).emit("bid:placed", updatedBids);
  }
}
