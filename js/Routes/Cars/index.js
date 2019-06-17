const express = require("express");
const carIndexRouter = express.Router();

// Getting routes

const returnCars = require("./ReturnCars");
const addCar = require("./AddCar");
const deleteCar = require("./DeleteCar");
const miscRoutes = require("./Misc");
const returnCarById = require("./ReturnCarById");
const returnAllUnchecked = require("./ReturnAllUncheckedCars");
const returnAllRecheckNeeded = require("./ReturnAllCarsRecheckNeeded");
const markForRecheckById = require("./MarkCarForRecheckById");
const approveById = require("./ApproveCarById");
const modifyCar = require("./ModifyCar");

// CRUD OPERATIONS

carIndexRouter.use(returnCars);
carIndexRouter.use(addCar);
carIndexRouter.use(deleteCar);
carIndexRouter.use(modifyCar);
carIndexRouter.use(miscRoutes);
carIndexRouter.use(returnAllUnchecked);
carIndexRouter.use(returnAllRecheckNeeded);
carIndexRouter.use(approveById);
carIndexRouter.use(markForRecheckById);
carIndexRouter.use(returnCarById);

module.exports = carIndexRouter;
