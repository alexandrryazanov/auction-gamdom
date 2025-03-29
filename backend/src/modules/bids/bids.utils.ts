import { Queue } from "bullmq";
import { REDIS_CONFIGURATION } from "@/modules/redis/redis.client";

const queues = new Map<number, Queue>();

export function getBidsQueue(lotId: number): Queue {
  if (!queues.has(lotId)) {
    queues.set(
      lotId,
      new Queue(`lot-${lotId}`, { connection: REDIS_CONFIGURATION }),
    );
  }
  return queues.get(lotId)!;
}
