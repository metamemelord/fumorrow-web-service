const express = require("express");
const celebrityRouter = express.Router();

const addCelebrityRoute = require("./AddCelebrity");
const deleteCelebrityRoute = require("./DeleteCelebrity");
const updateCelebrityRoute = require("./UpdateCelebrity");
const returnCelebrityByIdRoute = require("./ReturnCelebrityById");
const returnAllCelebritiesRoute = require("./ReturnAllCelebrities");
const returnUnapprovedCelebrities = require("./UnapprovedCelebrities");
const searchCelebrity = require("./SearchCelebrity");
const approveCelebrityById = require("./ApproveCelebrityById");

celebrityRouter.use(addCelebrityRoute);
celebrityRouter.use(deleteCelebrityRoute);
celebrityRouter.use(updateCelebrityRoute);
celebrityRouter.use(returnAllCelebritiesRoute);
celebrityRouter.use(returnUnapprovedCelebrities);
celebrityRouter.use(approveCelebrityById);
celebrityRouter.use(searchCelebrity);
celebrityRouter.use(returnCelebrityByIdRoute);

module.exports = celebrityRouter;