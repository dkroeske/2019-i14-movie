const assert = require("assert");
const User = require("../models/users");
const db = require("../db/mysql-connector");
const bcrypt = require("bcryptjs");
const jwt = require("../helpers/jwt");

const saltRounds = 10;

const AuthController = {
  //
  // Register new user
  //
  register: (req, res, next) => {
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
  },

  //
  // Login with username / password
  //
  login: (req, res, next) => {
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
          if ( rows.length === 1 && bcrypt.compareSync(req.body.password, rows[0].password) ) {
            const token = jwt.encodeToken(req.body.username);
            res.status(200).json({ token: token });
          } else {
            next(new Error("Invalid login, bye"));
          }
        }
      });
    } catch (ex) {
      next(ex);
    }
  },

  //
  // validate token with database and tie user_id to req.user
  //
  validateToken: (req, res, next) => {
    
    try {
      // get token if exists
      const token = req.header('x-access-token') || '';

      // Validate with assert is string etc ..
      assert(typeof token === "string", "X-Access-Token is not a string!");
       
      // Get JWT token and decode
      jwt.decodeToken( token, (err, payload) => {
        if (err) {
          next(err);
        } else {
          
          // make sure no previous id is kept in memory in case off some error
          req.userid = undefined

          // If token is valid, get user_id
          const query = {
            sql: "SELECT iduser FROM `user` WHERE `username`= ?",
            values: [payload.sub],
            timeout: 2000
          };
          
          // Perform query
          db.query(query, (err, rows, fields) => {
            if (err) {
              next(err);
            } else {
              req.userid = rows[0].iduser;
              next()
            }
          });
        }
      })
    } catch (ex) {
      next(ex);
    }
  },

};

module.exports = AuthController;
