import { Server, Socket } from "socket.io";
import { ExpressListener } from "@/types/listener";

export let io: Server | null;

export class SocketsClient implements ExpressListener {
  async register(_io: Server, socket: Socket) {
    io = _io;
  }
}
