"use strict";
const redisClient = require("../Redis");
const base64 = require("base64url");
const handleError = require("../HandleError");
const request = require("request");
const redis_client = require("../Redis");

module.exports = (req, res) => {
  if (!req.query.hash) throw new Error();

  const upstream = JSON.parse(base64.decode(req.query.hash));
  delete req.query.hash;
  const originVideo = {
    url: upstream.domain,
    cookie: upstream.cookie,
  };
  const headers = Object.assign({}, req.headers, {
    cookie: originVideo.cookie,
  });
  delete headers.host;
  delete headers.referer;
  headers.referer = 'https://youtube.com/'
  console.log(headers)
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
      playback.destroy();
    });
  });
};
