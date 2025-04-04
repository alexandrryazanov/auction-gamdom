import { UsersService } from "@/modules/users/users.service";
import { LotsService } from "@/modules/lots/lots.service";
import { UsersController } from "@/modules/users/users.controller";
import { LotsController } from "@/modules/lots/lots.controller";
import { LotsListener } from "@/modules/lots/lots.listener";
import { BidsListener } from "@/modules/bids/bids.listener";
import { SocketsClient } from "@/modules/sockets/sockets.client";
import { BidsService } from "@/modules/bids/bids.service";
import { LotsWorkers } from "@/modules/lots/lots.workers";
import { AuthService } from "@/modules/auth/auth.service";
import { AuthController } from "@/modules/auth/auth.controller";
import { ExpressController } from "@/types/controller";
import { ExpressListener } from "@/types/listener";

// services and workers
const usersService = new UsersService();
const authService = new AuthService();
const bidsService = new BidsService();
const lotsWorkers = new LotsWorkers(bidsService);
const lotsService = new LotsService(lotsWorkers);

void new LotsWorkers(bidsService).initAllWorkers();

// controllers
export const controllers: ExpressController[] = [
  new UsersController(usersService),
  new AuthController(authService),
  new LotsController(lotsService),
];

// listeners
export const listeners: ExpressListener[] = [
  new SocketsClient(),
  new LotsListener(),
  new BidsListener(),
];
