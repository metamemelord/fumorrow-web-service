const express = require("express");
const movieIndexRouter = express.Router();

// Getting routes

const returnMovies = require("./ReturnMovies");
const addMovie = require("./AddMovie");
const deleteMovie = require("./DeleteMovie");
const modifyMovie = require("./ModifyMovie");
const showingAt = require("./AddShowingAt");
const miscRoutes = require("./Misc");
const returnAllUnchecked = require("./ReturnAllUncheckedMovies");
const returnAllRecheckNeeded = require("./ReturnAllMoviesRecheckNeeded");
const approveById = require("./ApproveMovieById");
const markForRecheckById = require("./MarkMovieForRecheckById");
const returnMovieById = require("./ReturnMovieById");

// CRUD OPERATIONS

movieIndexRouter.use(returnMovies);
movieIndexRouter.use(addMovie);
movieIndexRouter.use(deleteMovie);
movieIndexRouter.use(modifyMovie);
movieIndexRouter.use(showingAt);
movieIndexRouter.use(miscRoutes);
movieIndexRouter.use(returnAllUnchecked);
movieIndexRouter.use(returnAllRecheckNeeded);
movieIndexRouter.use(approveById);
movieIndexRouter.use(markForRecheckById);
movieIndexRouter.use(returnMovieById);

module.exports = movieIndexRouter;
