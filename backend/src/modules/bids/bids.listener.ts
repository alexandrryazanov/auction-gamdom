import { Server, Socket } from "socket.io";
import { ExpressListener } from "@/types/listener";
import { PlaceBidDto } from "@/modules/bids/dto/place-bid.dto";
import { getBidsQueue } from "@/modules/bids/bids.utils";

export class BidsListener implements ExpressListener {
  register(io: Server, socket: Socket) {
    socket.on("bid:place", (data) => this.onPlaceBid(socket, data));
  }

  private async onPlaceBid(socket: Socket, data: PlaceBidDto) {
    try {
      const bidsQueue = getBidsQueue(data.lotId);
      await bidsQueue.add("bid", data);
    } catch (e) {
      socket.emit("error", e.message);
    }
  }
}
