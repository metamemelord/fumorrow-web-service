const express = require('express');
const celebrityRouter = express.Router();
const addCelebrityRoute = require('./AddCelebrity');
const deleteCelebrityRoute = require('./DeleteCelebrity');
const returnCelebrityByIdRoute = require('./ReturnCelebrityById');
const returnAllCelebritiesRoute = require('./ReturnAllCelebrities');
const returnUnapprovedCelebrities = require('./UnapprovedCelebrities');
const approveCelebrityById = require('./ApproveCelebrityById');

celebrityRouter.use(addCelebrityRoute);
celebrityRouter.use(approveCelebrityById);
celebrityRouter.use(deleteCelebrityRoute);
celebrityRouter.use(returnCelebrityByIdRoute);
celebrityRouter.use(returnAllCelebritiesRoute);
celebrityRouter.use(returnUnapprovedCelebrities);

module.exports = celebrityRouter;