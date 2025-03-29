import { Server, Socket } from "socket.io";
import prismaClient from "@/modules/prisma/prisma.client";
import { Status } from "@prisma/client";
import { ExpressListener } from "@/types/listener";

export class LotsListener implements ExpressListener {
  async register(io: Server, socket: Socket) {
    const { lotId } = socket.handshake.query as { lotId: string };

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
      io?.close();
      return;
    }

    // connect to room
    socket.join(lotId);
    socket.emit("lot", { ...lot, timeLeft });
    io.to(lotId).emit("user:connected", {});

    socket.on("disconnect", () => {
      socket.leave(lotId);
      io.to(lotId).emit("user:disconnected", {});
    });
  }
}
