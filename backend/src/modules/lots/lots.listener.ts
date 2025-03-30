import { Server, Socket } from "socket.io";
import prismaClient from "@/modules/prisma/prisma.client";
import { Status } from "@prisma/client";
import { ExpressListener } from "@/types/listener";
import redisClient from "@/modules/redis/redis.client";
import jwt from "jsonwebtoken";

export class LotsListener implements ExpressListener {
  async register(io: Server, socket: Socket) {
    const { lotId } = socket.handshake.query as { lotId: string };
    const token: string | undefined = socket.handshake.auth.token;

    if (!token) {
      socket.emit("error", "You are not logged in!");
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
      socket["userId"] = decoded.sub;
    } catch (e) {
      socket.emit("error", "Wrong token!");
      return;
    }

    if (!lotId) {
      socket.emit("error", "Specify lotId");
      return;
    }

    const lot = await prismaClient.lot.findUnique({ where: { id: +lotId } });
    if (!lot) {
      socket.emit("error", "No such lotId");
      return;
    }
    const currentDuration = Date.now() - new Date(lot.createdAt).getTime();
    const timeLeft = lot.timeInSec * 1000 - currentDuration;

    if (lot.status === Status.CLOSED || timeLeft <= 0) {
      socket.emit("error", "Lot is closed");
      socket.disconnect();
      return;
    }

    // connect to room
    socket.join(lotId);
    socket.emit("lot", { ...lot, timeLeft });
    io.to(lotId).emit("user:connected", {});

    // send all bids
    const lotName = `lot-${lot.id}`;
    const lotBidsString = await redisClient?.get(lotName);
    const lotBids = JSON.parse(lotBidsString || "[]") as {
      value: number;
      userId: number;
    }[];
    socket.emit("bid:placed", lotBids);

    socket.on("disconnect", () => {
      socket.leave(lotId);
      io.to(lotId).emit("user:disconnected", {});
    });
  }
}
