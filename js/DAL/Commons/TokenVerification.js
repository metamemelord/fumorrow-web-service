const jwt = require("jsonwebtoken");
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);

function verifyToken(userObject, callback) {
  try {
    jwt.verify(userObject.token, process.env.key, function(error, data) {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return callback(401, "Token expired", null);
        } else {
          logger.error(error);
          return callback(403, "Invalid signature", null);
        }
      } else {
        var result = undefined;
        var privilages = process.env.AVAILABLE_PRIVILAGES;
        if (userObject.domain) {
          if (!privilages.split(",").includes(userObject.domain)) {
            return callback(
              403,
              "Invalid domain, multiple attemps will lead to account suspension",
              null
            );
          }
          result =
            userObject.domain &&
            data.privilages.includes(userObject.domain) &&
            userObject.username === data.username;
        } else {
          result = userObject.username === data.username;
        }
        if (result) return callback(200, "Ok", null);
        else return callback(403, "Unauthorized", null);
      }
    });
  } catch (error) {
    logger.error(error);
    return callback(500, "Internal server error", null);
  }
}

module.exports = verifyToken;
