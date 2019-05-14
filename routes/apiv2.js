const express = require("express");
const assert = require("assert");
const router = express.Router();
const Movie = require("../models/movie");
const jwt = require("../helpers/jwt");
const db = require("../db/mysql-connector");

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


// Get alle bekeken movies voor alle gebruikers
//router.get("/summary/:user", (req, res, next) => {
router.get("/summary", (req, res, next) => {

    //const user = req.params.user || ''
    const user =  req.query.user || ''


    // Construct query object
    const query = {
      sql: `
        SELECT u.username, m.titel
        FROM user as u, movie as m, user_movie as um
        WHERE u.iduser = um.user_id AND m.idmovie = um.movie_id AND u.username=?;
      `,
      values: [user],
      timeout: 2000
    };

    try {
      db.query(query, (err, rows, fields) => {
        if(err) { 
          next(err)
        } else {
          try {
            res.status(200).json(rows)
            // let movies = []
            // rows.forEach( (element) => {
            //   movies.push(new Movie(element.titel, element.jaar, element.rating))
            // })
            // res.status(200).json(movies)
          } catch(err) {
            next(err)
          }
          //res.status(200).json(rows)
        }
      })
    } catch(err) {
      next(err)
    }
});


//Get all movies

router.get("/movies/:year", function(req, res, next) {
  
  const year = req.params.year || ''

  try {

    // Construct query object
    const query = {
      sql: "SELECT `titel`, `jaar`, `rating` FROM movie WHERE `jaar`= ?;",
      values: [year],
      timeout: 2000
    };

    // Perform query
    db.query(query, (err, rows, fields) => {
      if (err) {
        next(err);
      } else {
        try {
          let movies = [];
          rows.forEach(element => {
            movies.push(new Movie(element.titel, element.jaar, element.rating))
          });
          res.status(200).json(movies);

        } catch(err) {
          next(err)
        }
      }
    });
  } catch (ex) {
    next(ex);
  }
});

//
// Get movie by id
//
router.get("/movies", function(req, res, next) {
  
  const year = req.query.year || '';

  try {
     
    let query = {};

    if( year === '') {
      // Construct query object
      query = {
        sql: "SELECT `titel`, `jaar`, `rating` FROM movie;",
        values: [year],
        timeout: 2000
      };
    } else {
      query = {
        sql: "SELECT `titel`, `jaar`, `rating` FROM movie WHERE `jaar`=?;",
        values: [year],
        timeout: 2000
      };
    }
      
    // Perform query
    db.query(query, (err, rows, fields) => {
      if (err) {
        next(err);
      } else {
        try {
          let movies = [];
          rows.forEach(element => {
            movies.push(new Movie(element.titel, element.jaar, element.rating))
          });
          res.status(200).json(movies);
        } catch(err) {
          next(err)
        }
      }
    });
  } catch(err) {
    next(err)
  }

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
