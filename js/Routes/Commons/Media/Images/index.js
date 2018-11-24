const express = require('express');
const imageMediaRouter = express.Router();

const uploadImage = require('./Upload');

imageMediaRouter.use(uploadImage);

module.exports = imageMediaRouter;