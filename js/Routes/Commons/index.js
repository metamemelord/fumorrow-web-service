const express = require("express");
const commonsRouter = express.Router();

const loginRouter = require("./Login");
const registrationRouter = require("./Registration");
const celebrityRouter = require("./Celebrity/index");
const verifyTokenRouter = require("./VerifyToken");
const mediaRouter = require("./Media");

commonsRouter.use(loginRouter);
commonsRouter.use(registrationRouter);
commonsRouter.use(celebrityRouter);
commonsRouter.use(verifyTokenRouter);
commonsRouter.use(mediaRouter);

module.exports = commonsRouter;