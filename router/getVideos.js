"use strict";

const getDriveProxy = require("../GetDriveProxy");
const extractVideos = require("../GetVideoInfo");
const createProxyVideo = require("../Proxy");
const handleError = require("../HandleError");
const redisClient = require("../Redis");

const fs = require("fs");

const getProxy = () => {
  const data = fs.readFileSync(process.env.PROXY_LIST, "utf8");
  const obj = JSON.parse(data);
  const proxy = obj[Math.floor(Math.random() * obj.length)];
  return "http://" + proxy.auth + "@" + proxy.ip + ":" + proxy.port;
}

const isValidProvider = (provider) => {
  const allowed = ["drive"];
  return Boolean(allowed.indexOf(provider.toLowerCase()) !== -1);
};

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf8");

  if (isValidProvider(req.params.provider) === false) {
    throw new Error("provider invalid");
  }
  redisClient.select(1, (err, _) => {
    if (err) {
      throw err;
    }
    redisClient.get(req.params.id, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      if (data != null) {
        res.end(JSON.parse(data));
      } else {
        const proxy = getProxy();
        getDriveProxy(req.params.id, proxy)
          .then((response) => ({
            videos: extractVideos(response.body),
            driveCookieHeader: response.headers["set-cookie"],
          }))
          .then(({ videos, driveCookieHeader }) => {
            const proxied = videos.map((video) =>
              createProxyVideo(video, driveCookieHeader,req.params.id)
            );
            const result = JSON.stringify({
              status: "OK",
              title: proxied[0]["title"],
              data: [...proxied].map((video) => {
                delete video.title;
                delete video.originSrc;
                return video;
              }),
            });
            redisClient.setex(req.params.id, 3600, result);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json; charset=utf8");
            return res.end(result);
          })
          .catch((err) => {
            handleError(err);
            res.statusCode = 200;
            return res.end(
              JSON.stringify({
                status: "FAIL",
                reason: err.toString(),
              })
            );
          });
      }
    });
  });
};
