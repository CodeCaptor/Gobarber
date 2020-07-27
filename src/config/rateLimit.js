import RateLimitRedis from 'rate-limit-redis';
import redis from 'redis';

export default {
  store: new RateLimitRedis({
    client: redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  }),
  windowMs: 1000 * 60 * 15,
  max: 10,
};
