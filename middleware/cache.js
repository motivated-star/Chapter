const redisClient = require('../clients/redisClient');

const cacheMiddleware = async (req, res, next) => {
  try {
    // Normalize query keys to avoid cache misses due to key order
    const normalizedQuery = Object.keys(req.query).sort().reduce((obj, key) => {
      obj[key] = req.query[key];
      return obj;
    }, {});
    const key = `chapters:${JSON.stringify(normalizedQuery)}`;

    const cached = await redisClient.get(key);
    if (cached) {
      try {
        console.log('Cache hit for key:', key);
        return res.json(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse cached data', e);
      }
    }
    res.locals.cacheKey = key;
    next();
  } catch (err) {
    console.error('Redis cache error:', err);
    next();
  }
};

module.exports = cacheMiddleware;
