const express = require("express");
const router = express.Router();
const MovieController = require("../controllers/movie.controller")
const AuthController = require("../controllers/auth.controller")

const validate = [AuthController.validateToken]
//
router.get('/',                     MovieController.getMovies ); 
router.get('/watched',  validate,   MovieController.getWatchedMovies ); 
router.get('/:id',      validate,   MovieController.getMovieById ); 
router.post('/',        validate,   MovieController.addMovie ); 

module.exports = router;
