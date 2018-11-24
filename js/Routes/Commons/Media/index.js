const express = require('express');
const mediaRouter = express.Router();

const imageMediaRouter = require('./Images');

mediaRouter.use(imageMediaRouter);

module.exports = mediaRouter;