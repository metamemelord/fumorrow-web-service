const express = require("express");
const bikeIndexRouter = express.Router();

// Getting routes

const returnBikes = require("./ReturnBikes");
const addBike = require("./AddBike");
const deleteBike = require("./DeleteBike");
const miscRoutes = require("./Misc");
const returnBikeById = require("./ReturnBikeById");
const returnAllUnchecked = require("./ReturnAllUncheckedBikes");
const returnAllRecheckNeeded = require("./ReturnAllBikesRecheckNeeded");
const markForRecheckById = require("./MarkBikeForRecheckById");
const approveById = require("./ApproveBikeById");
const modifyBike = require("./ModifyBike");

// CRUD OPERATIONS

bikeIndexRouter.use(returnBikes);
bikeIndexRouter.use(addBike);
bikeIndexRouter.use(deleteBike);
bikeIndexRouter.use(modifyBike);
bikeIndexRouter.use(miscRoutes);
bikeIndexRouter.use(returnAllUnchecked);
bikeIndexRouter.use(returnAllRecheckNeeded);
bikeIndexRouter.use(approveById);
bikeIndexRouter.use(markForRecheckById);
bikeIndexRouter.use(returnBikeById);

module.exports = bikeIndexRouter;
