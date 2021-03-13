"use strict";

const http = require("http");
const app = require("router")();

// middleware
app.use(require("./ParseQuery"));

// hide all url from spiderbot
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.end("User-agent: *\nDisallow: /");
});

// server endpoint
app.get(
  "/videoplayback",
  (req, res, next) => {
    const referer = req.headers.referer;
    if (!referer) {
      res.statusCode = 403;
      res.end()
    } else {
      if (referrer == process.env.REFERER) {
        res.statusCode = 403;
        res.end()
      } else {
        next();
      }
    }
  },
  require("./router/videoplayback")
);
app.get("/stat", require("./router/stat"));
app.get(
  "/:provider/:id",
  (req, res, next) => {
    next();
  },
  require("./router/getVideos")
);

module.exports = http.createServer((req, res) => {
  app(req, res, require("finalhandler")(req, res));
});
