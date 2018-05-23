const express = require('express');
const commonsRouter = express.Router();
const loginRouter = require('./Login');
const registrationRouter = require('./Registration');
commonsRouter.use(loginRouter);
commonsRouter.use(registrationRouter);

module.exports = commonsRouter;