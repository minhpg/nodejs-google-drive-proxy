
const redis = require("redis");
const redis_client = redis.createClient('redis://redis:6379');

module.exports = redis_client