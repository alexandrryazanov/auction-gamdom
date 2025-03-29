import { Server, Socket } from "socket.io";

export interface ExpressListener {
  register(io: Server, socket: Socket): void | Promise<void>;
}
