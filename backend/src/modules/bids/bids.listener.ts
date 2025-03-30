import { Server, Socket } from "socket.io";
import { ExpressListener } from "@/types/listener";
import { PlaceBidDto } from "@/modules/bids/dto/place-bid.dto";
import { getBidsQueue } from "@/modules/bids/bids.utils";

export class BidsListener implements ExpressListener {
  register(io: Server, socket: Socket) {
    socket.on("bid", (data) =>
      this.onPlaceBid(socket, {
        ...data,
        userId: socket["userId"],
        email: socket["email"],
      }),
    );
  }

  private async onPlaceBid(socket: Socket, data: Omit<PlaceBidDto, "lotId">) {
    try {
      const lotId = Number(socket.handshake.query.lotId);
      const bidsQueue = getBidsQueue(lotId);
      console.log("Send bid to queue");
      await bidsQueue.add("bid", { lotId, ...data, socketId: socket.id });
      console.log("sent to queue");
    } catch (e) {
      socket.emit("error", e.message);
    }
  }
}
