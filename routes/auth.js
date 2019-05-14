const express = require("express");
const assert = require("assert");
const router = express.Router();
const User = require("../models/users");
const db = require("../db/mysql-connector");
const bcrypt = require("bcryptjs");
const jwt = require("../helpers/jwt");

const saltRounds = 10;

// // Check token except for 'register' and 'login'
// router.all(/^(?!\/login|\/register).*$/, function(req, res, next) {
//   const token = req.header("X-Access-Token") || "";
//   console.log(token);

//   auth.decodeToken(token, (err, payload) => {
//     if (err) {
//       console.log("Error handler: " + err.message);
//       next(err);
//       //res.status((err.status || 401 )).json({error: new Error("Not authorised").message});
//     } else {
//       next();
//     }
//   });
// });

//
// Register new user
//
router.post("/register", function(req, res, next) {
  try {
    // Validate with assert is string etc ..
    assert(typeof req.body.email === "string", "Email is not a string!");
    assert(typeof req.body.password === "string", "Password is not a string!");
    assert(typeof req.body.username === "string", "username is not a string!");

    // Create new user object, hash password (do not store in db).
    // Throws err if no valid object can be constructed
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const user = new User(req.body.email, hash, req.body.username);

    // Construct query object
    const query = {
      sql: "INSERT INTO `user`(email, password, username) VALUES (?,?,?)",
      values: [user.email, hash, user.username],
      timeout: 2000
    };

    // Perform query
    db.query(query, (err, rows, fields) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json(rows);
      }
    });
  } catch (ex) {
    next(ex);
  }
});

//
// Login with username / password
//
router.post("/login", function(req, res, next) {
  try {
    // Validate with assert is string etc ..
    assert(typeof req.body.password === "string", "Password is not a string!");
    assert(typeof req.body.username === "string", "username is not a string!");

    // Construct query object
    const query = {
      sql: "SELECT `password` FROM `user` WHERE `username`=?",
      values: [req.body.username],
      timeout: 2000
    };

    // Perform query
    db.query(query, (err, rows, fields) => {
      if (err) {
        next(err);
      } else {
        if (
          rows.length === 1 &&
          bcrypt.compareSync(req.body.password, rows[0].password)
        ) {
          token = jwt.encodeToken(req.body.username);
          res.status(200).json({ token: token });
        } else {
          next(new Error("Invalid login, bye"));
        }
      }
    });
  } catch (ex) {
    next(ex);
  }
});

// Fall back, display some info
router.all("*", function(req, res, next) {
  next(new Error("Unknown endpoint"));
});

module.exports = router;
