import { createClient, RedisClientType } from "redis";

let redis: RedisClientType | null = null;

export const REDIS_CONFIGURATION = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : undefined,
  password: process.env.REDIS_PASSWORD,
};

function getRedisClient() {
  if (!redis) {
    const { host, port, password } = REDIS_CONFIGURATION;
    redis = createClient({
      url: "redis://:" + password + "@" + host + ":" + port,
      disableOfflineQueue: true,
    });
  }

  return redis;
}

export default getRedisClient();
