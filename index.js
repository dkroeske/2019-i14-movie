const config = require("./config/config.json");
const express = require("express");
const bodyParser = require("body-parser");
// const apiv1 = require("./routes/apiv1");
// const apiv2 = require("./routes/movies");
// const auth = require("./routes/auth");
const logger = require("tracer").dailyfile({
  root: "./logs",
  maxLogFiles: 10,
  allLogsFileName: "movies",
  format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
  dateformat: "HH:MM:ss.L"
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middelware, logging voor alle request
app.all("*", function(req, res, next) {
  logger.info("%s", req.hostname);
  next();
});

app.use("/apiv2", require("./routes/auth.routes"));
app.use("/apiv2/movie", require("./routes/movie.routes"));


// Fall back, display some info
app.all("*", function(req, res, next) {
  res.status(501);
  res.json({ mgs: "Invalid endpoint" });
});

// Optional log error
function errorLoggerHandler(err, req, res, next) {
  logger.error("%s", err.message);
  next(err);
}

// Set default error handler
function errorResponseHandler(err, req, res, next) {
  res.status(500);
  res.json({ mgs: "Go, you hacker!" });
}

// Register the error handlers
app.use(errorLoggerHandler);
app.use(errorResponseHandler);

// ECMA 6
const port = process.env.PORT || config.remote.app.port;
const server = app.listen(port, () => {
  console.log(
    "The Movie app, the magic happens at port " + server.address().port
  );
});

module.exports = app;
