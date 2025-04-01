import "express-async-errors";
import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import { errorMiddleware } from "@/middlewares/errorMiddleware";
import { controllers, listeners } from "@/modules";
import redisClient from "@/modules/redis/redis.client";
import cors from "cors";
import cookieParser from "cookie-parser";

// --------------------- HTTP server ------------------------
const app = express();
const PORT = 8080;

// middlewares
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.HOST }));
app.use(cookieParser());

// handle all controllers
controllers.forEach((controller) => {
  app.use(controller.path, controller.router);
});

// handle errors
app.use(errorMiddleware);

const httpServer = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// ---------------------- WS server -------------------------
const io = new Server(httpServer, {
  cors: { origin: "*" },
  path: "/ws",
  transports: ["websocket"],
});
io.on("connection", async (socket) => {
  for (const listener of listeners) {
    await listener.register(io, socket);
  }
});

// ------------------------ Redis ---------------------------
redisClient
  .connect()
  .then(() => console.log("Redis connected"))
  .catch((err) => console.log(err));
