const express = require('express');
const celebrityRouter = express.Router();
const addCelebrityRoute = require('./AddCelebrity');
const deleteCelebrityRoute = require('./DeleteCelebrity');
const returnCelebrityByIdRoute = require('./ReturnCelebrityById');
const returnAllCelebritiesRoute = require('./ReturnAllCelebrities');

celebrityRouter.use(addCelebrityRoute);
celebrityRouter.use(deleteCelebrityRoute);
celebrityRouter.use(returnCelebrityByIdRoute);
celebrityRouter.use(returnAllCelebritiesRoute);

module.exports = celebrityRouter;