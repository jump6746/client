import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

const getRedisClient = ():Redis => {

  if(!redis){
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN
    });
  }

  return redis;
}

export default getRedisClient;