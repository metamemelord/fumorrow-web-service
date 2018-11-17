const express = require('express');
const commonsRouter = express.Router();

const loginRouter = require('./Login');
const registrationRouter = require('./Registration');
const celebrityRouter = require('./Celebrity/index');
const verifyTokenRouter = require('./VerifyToken');

commonsRouter.use(loginRouter);
commonsRouter.use(registrationRouter);
commonsRouter.use(celebrityRouter);
commonsRouter.use(verifyTokenRouter);

module.exports = commonsRouter;