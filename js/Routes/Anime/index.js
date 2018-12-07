const express = require('express');
const animeIndexRouter = express.Router();

// Getting routes

const returnAnime = require('./ReturnAnimes');
const addAnime = require('./AddAnime');
const deleteAnime = require('./DeleteAnime');
const modifyAnime = require('./ModifyAnime');
const miscRoutes = require('./Misc');
const returnAllUnchecked = require('./ReturnAllUncheckedAnimes');
const returnAllRecheckNeeded = require('./ReturnAllAnimesRecheckNeeded');
const approveById = require('./ApproveAnimeById');
const markForRecheckById = require('./MarkAnimeForRecheckById');
const returnAnimeById = require('./ReturnAnimeById');

// CRUD OPERATIONS

animeIndexRouter.use(returnAnime);
animeIndexRouter.use(addAnime);
animeIndexRouter.use(deleteAnime);
animeIndexRouter.use(modifyAnime);
animeIndexRouter.use(miscRoutes);
animeIndexRouter.use(returnAllUnchecked);
animeIndexRouter.use(returnAllRecheckNeeded);
animeIndexRouter.use(approveById);
animeIndexRouter.use(markForRecheckById);
animeIndexRouter.use(returnAnimeById);

module.exports = animeIndexRouter;
