const redisClient = require('../Redis')

module.exports = (req,res) => {
    return Status(req,res)
}

const Status = (req,res) => {
    try {
        redisClient.select(1,() => {
            redisClient.keys('*', (err,data) => {
                const count = data.length
                res.end(JSON.stringify({
                    connections: count
                }))
            })
        })
    }
    catch(err){
        throw err
    }
}