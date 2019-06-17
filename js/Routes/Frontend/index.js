const express = require("express");
const frontendIndexRouter = express.Router();

// Getting routes

const returnFrontend = require("./ReturnFrontend");
const addFrontend = require("./AddFrontend");
const deleteFrontend = require("./DeleteFrontend");
const modifyFrontend = require("./ModifyFrontend");

//CURD OPERATIONS

frontendIndexRouter.use(returnFrontend);
frontendIndexRouter.use(addFrontend);
frontendIndexRouter.use(deleteFrontend);
frontendIndexRouter.use(modifyFrontend);

module.exports = frontendIndexRouter;