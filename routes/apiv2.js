const express = require("express");
const assert = require("assert");
const router = express.Router();
const Movies = require("../models/movies");
const jwt = require("../helpers/jwt");

const _movies = new Movies();
const saltRounds = 10;

// Check voor alle endpoints het token
router.all("*", function(req, res, next) {
  assert(
    typeof req.headers["x-access-token"] == "string",
    "token is not a string!"
  );

  const token = req.header("X-Access-Token") || "";

  jwt.decodeToken(token, (err, payload) => {
    if (err) {
      console.log("Error handler: " + err.message);
      next(err);
    } else {
      next();
    }
  });
});

//
// Get all movies
//
router.get("/movies", function(req, res, next) {
  _movies.readAll((err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });
});

//
// Get movie by id
//
router.get("/movies/:id", function(req, res, next) {
  const id = req.query.id || "";

  _movies.read(id, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });
});

//
// Post new movie
//
router.post("/movies", function(req, res, next) {
  const movie = req.body || {};

  _movies.create(movie, (err, result) => {
    if (err) {
      res.status(500).json(err.toString());
    } else {
      res.status(200).json(result);
    }
  });
});

// Fall back, display some info
router.all("*", function(req, res) {
  res.status(200);
  res.json({
    description: "Movie API version 2"
  });
});

module.exports = router;
