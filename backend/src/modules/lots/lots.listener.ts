import { Server, Socket } from "socket.io";
import prismaClient from "@/modules/prisma/prisma.client";
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
      const user = await prismaClient.user.findUnique({
        where: { id: Number(decoded.sub) },
      });
      if (!user) {
        socket.emit("error", "No such user");
        return;
      }
      socket["userId"] = decoded.sub;
      socket["email"] = user.email;
    } catch (e) {
      socket.emit("error", "Wrong token!");
      return;
    }

    if (!lotId) {
      socket.emit("error", "Specify lotId");
      return;
    }

    // connect to them room
    socket.join(lotId);

    // send all bids
    const lotName = `lot-${lotId}`;
    const lotBidsString = await redisClient?.get(lotName);
    const lotBids = JSON.parse(lotBidsString || "[]") as {
      value: number;
      userId: number;
      email: string;
    }[];
    socket.emit("bid:placed", lotBids);

    socket.on("disconnect", () => {
      socket.leave(lotId);
      io.to(lotId).emit("user:disconnected", {});
    });
  }
}
