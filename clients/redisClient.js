const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

module.exports = redisClient;
