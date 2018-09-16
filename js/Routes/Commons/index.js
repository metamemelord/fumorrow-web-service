const express = require('express');
const commonsRouter = express.Router();
const loginRouter = require('./Login');
const registrationRouter = require('./Registration');
const celebrityRouter = require('./Celebrity/index');

commonsRouter.use(loginRouter);
commonsRouter.use(registrationRouter);
commonsRouter.use(celebrityRouter);

module.exports = commonsRouter;