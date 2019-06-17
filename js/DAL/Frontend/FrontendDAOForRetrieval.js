var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const isEmpty = require("../../lib/HelperFunctions").isEmpty;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);

var connectionForRetrieval = null;
try {
  connectionForRetrieval = mongoose.createConnection(
    process.env.DATABASE_CONNECTION_STRING_FOR_READING_ONLY,
    { useNewUrlParser: true }
  );

  // Connection to DB

  connectionForRetrieval.on("error", function (error) {
    logger.error(error);
  });

  connectionForRetrieval.once("open", function () {
    logger.info("Connection to read-only user successful!");
  });
} catch (error) {
  logger.error(error);
}

require("assert").notEqual(connectionForRetrieval, null);

const frontendSchema = require("../../Models/FrontendModel");
let frontendDBService = connectionForRetrieval.model("frontend", frontendSchema);

function getAll(callback) {
  frontendDBService
    .find({})
    .exec(function (error, data) {
      if (error) {
        logger.error(error);
        callback(500, "Internal server error", null);
      }
      callback(200, "Success", data);
    });
}

module.exports = {
  getAll
};