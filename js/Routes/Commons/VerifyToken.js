const express = require("express");
const DAL = require("../../DAL/index");
const tokenVerifier = DAL.TokenVerification;
const tokenDecrypt = require("../../Utils/Token/TokenVerifier");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);

var tokenVerificationRouter = express.Router();

tokenVerificationRouter.post("/api/admin/auth", tokenDecrypt, function(
  req,
  res
) {
  try {
    var username = req.body.username;
    var domain = req.body.domain;
    var userObject = {
      username,
      domain,
      token: req.token
    };
    tokenVerifier(userObject, function(status, message, data) {
      return res.status(status).json({
        status: {
          code: status,
          message: message
        },
        data: data
      });
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: {
        code: 500,
        message: "Internal server error"
      },
      data: null
    });
  }
});

module.exports = tokenVerificationRouter;
