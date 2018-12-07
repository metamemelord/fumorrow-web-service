const express = require('express');
const filename = require('path').basename(__filename);
const webSeriesIndexRouter = express.Router();

// Getting routes

const returnWebSeries = require('./ReturnWebSeries');
const addWebSeries = require('./AddWebSeries');
const deleteWebSeries = require('./DeleteWebSeries');
const modifyWebSeries = require('./ModifyWebSeries');
const miscRoutes = require('./Misc');
const returnAllUnchecked = require('./ReturnAllUncheckedWebSeries');
const returnAllRecheckNeeded = require('./ReturnAllWebSeriesRecheckNeeded');
const approveById = require('./ApproveWebSeriesById');
const markForRecheckById = require('./MarkWebSeriesForRecheckById');
const returnWebSeriesById = require('./ReturnWebSeriesById');

// CRUD OPERATIONS

webSeriesIndexRouter.use(returnWebSeries);
webSeriesIndexRouter.use(addWebSeries);
webSeriesIndexRouter.use(deleteWebSeries);
webSeriesIndexRouter.use(modifyWebSeries);
webSeriesIndexRouter.use(showingAt);
webSeriesIndexRouter.use(miscRoutes);
webSeriesIndexRouter.use(returnAllUnchecked);
webSeriesIndexRouter.use(returnAllRecheckNeeded);
webSeriesIndexRouter.use(approveById);
webSeriesIndexRouter.use(markForRecheckById);
webSeriesIndexRouter.use(returnWebSeriesById);

module.exports = webSeriesIndexRouter;
