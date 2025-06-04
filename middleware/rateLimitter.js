const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redisClient = require('../clients/redisClient');

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 60 * 1000, 
  max: 30,
  message: 'Too many requests from this IP, please try again after a minute.',
});

module.exports = limiter;
