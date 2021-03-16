'use strict'
//var heapdump = require('heapdump')
require('dotenv').config({silent: true})
const PORT = process.env.PORT || 6969
const log = require('./Log')
const server = require('./Server')
const redisClient = require('./Redis')
server.listen(PORT, () => {
  log.info(`http://0.0.0.0:${PORT}`)
})


setInterval(() => {
  redisClient.select(3, () => {
    redisClient.flushdb(() => {
      if(err) {
        console.log(err.message)
      }
      else {
        console.log('success')
      }
    })
  })
}, 6000 * 1)