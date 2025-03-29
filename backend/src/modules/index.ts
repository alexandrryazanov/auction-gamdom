import { UsersService } from "@/modules/users/users.service";
import { LotsService } from "@/modules/lots/lots.service";
import { UsersController } from "@/modules/users/users.controller";
import { LotsController } from "@/modules/lots/lots.controller";
import { LotsListener } from "@/modules/lots/lots.listener";
import { BidsListener } from "@/modules/bids/bids.listener";
import { SocketsClient } from "@/modules/sockets/sockets.client";
import { BidsService } from "@/modules/bids/bids.service";

// services
const usersService = new UsersService();
const bidsService = new BidsService();
const lotsService = new LotsService(bidsService);

// controllers
export const controllers = [
  new UsersController(usersService),
  new LotsController(lotsService),
];

// listeners
export const listeners = [
  new SocketsClient(),
  new LotsListener(),
  new BidsListener(),
];
