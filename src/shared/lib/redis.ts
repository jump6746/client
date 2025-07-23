import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

const getRedisClient = (): Redis => {
  if (!redis) {
    // 환경변수 검증
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      console.error("Redis environment variables missing:", {
        hasUrl: !!url,
        hasToken: !!token,
        url: url ? `${url.substring(0, 20)}...` : 'undefined'
      });
      throw new Error("Redis environment variables are not properly configured");
    }

    try {
      redis = new Redis({
        url,
        token,
      });
      console.log("Redis client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Redis client:", error);
      throw error;
    }
  }

  return redis;
};

export default getRedisClient;