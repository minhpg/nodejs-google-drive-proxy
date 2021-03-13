"use strict";
const redisClient = require("../Redis");
const base64 = require("base64url");
const handleError = require("../HandleError");
const request = require("request");
const redis_client = require("../Redis");

module.exports = (req, res) => {
  try{  if (!req.query.hash) throw new Error();
    const referrer = req.headers.referrer
    if (!referrer) {
      res.statusCode = 403
      res.end('??????')
    }
    else {
      if (!referrer.includes(process.env.REFERRER)){
        res.statusCode = 403
        res.end('??????')
      }
    }

    const upstream = JSON.parse(base64.decode(req.query.hash));
    delete req.query.hash;
    console.log(upstream);
    const originVideo = {
      url: upstream.domain,
      cookie: upstream.cookie,
    };
    originVideo.cookie.push(process.env.COOKIE);
    const headers = Object.assign({}, req.headers, {
      cookie: originVideo.cookie,
    });
    delete headers.host;
    delete headers.referer;
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);
    redis_client.select(3, (err, _) => {
      if (err) {
        handleError(err);
      }
      const time = new Date();
      redis_client.set(ip.toString(), time);
      console.log("NEW REQUEST FROM " + ip);
    });
    const playback = request({
      url: originVideo.url,
      method: "GET",
      resolveWithFullResponse: true,
      headers: headers,
    });
  
    playback
      .on("response", (response) => {
        res.statusCode = response.statusCode;
        Object.keys(response.headers).forEach((key) => {
          res.setHeader(key, response.headers[key]);
        });
      })
      .on("error", handleError)
      .pipe(res);
    res.on("close", () => {
      redis_client.select(3, (err, _) => {
        if (err) {
          handleError(err);
        }
        redis_client.del(ip.toString());
        console.log("REQUEST CLOSED " + ip);
        playback.destroy();
      });
    });
  }
  catch(err){
    console.log(err.message)
    res.send(JSON.stringify(err))
  }
};
