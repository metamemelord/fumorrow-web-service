const express = require('express');
const filename = require('path').basename(__filename);
const videoGameIndexRouter = express.Router();

// Getting routes

const returnVideoGames = require('./ReturnVideoGames');
const addVideoGame = require('./AddVideoGame');
const deleteVideoGame = require('./DeleteVideoGame');
const modifyVideoGame = require('./ModifyVideoGame');
const miscRoutes = require('./Misc');
const returnAllUnchecked = require('./ReturnAllUncheckedVideoGames');
const returnAllRecheckNeeded = require('./ReturnAllVideoGamesRecheckNeeded');
const approveById = require('./ApproveVideoGameById');
const markForRecheckById = require('./MarkVideoGameForRecheckById');
const returnVideoGameById = require('./ReturnVideoGameById');

// CRUD OPERATIONS

videoGameIndexRouter.use(returnVideoGames);
videoGameIndexRouter.use(addVideoGame);
videoGameIndexRouter.use(deleteVideoGame);
videoGameIndexRouter.use(modifyVideoGame);
videoGameIndexRouter.use(miscRoutes);
videoGameIndexRouter.use(returnAllUnchecked);
videoGameIndexRouter.use(returnAllRecheckNeeded);
videoGameIndexRouter.use(approveById);
videoGameIndexRouter.use(markForRecheckById);
videoGameIndexRouter.use(returnVideoGameById);

module.exports = videoGameIndexRouter;
