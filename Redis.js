
const redis = require("redis");

const port_redis = process.env.REDIS_PORT || 6379;
const redis_client = redis.createClient(port_redis);

module.exports = redis_client