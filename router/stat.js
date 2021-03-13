const redisClient = require('../Redis')
const handleError = require("../HandleError");
module.exports = (req,res) => {
    return Status(req,res)
}

const Status = (req,res) => {
    try {
        redisClient.select(2,() => {
            redisClient.keys('*', (err,data) => {
                const count = data.length
                console.log(data)
                res.end(JSON.stringify({
                    connections: count,
                    ip: data
                }))
            })
        })
    }
    catch(err){
        handleError(err)
    }
}