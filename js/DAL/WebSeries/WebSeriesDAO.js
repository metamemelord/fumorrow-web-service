var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const isEmpty = require("../../lib/HelperFunctions").isEmpty;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);

var connection = null;
try {
  connection = mongoose.createConnection(
    process.env.DATABASE_CONNECTION_STRING_FOR_WRITING,
    { useNewUrlParser: true }
  );
  // Connection to DB

  connection.on("error", function(error) {
    logger.error(error);
  });

  connection.once("open", function() {
    logger.info("Connection to RW user successful!");
  });
} catch (error) {
  logger.error(error);
}

require("assert").notEqual(connection, null);

// Importing webSeries schema service

const webSeriesSchema = require("../../Models/WebSeriesModel");
const seasonSchema = require("../../Models/SeasonModel");
const episodeSchema = require("../../Models/EpisodeModel");
let webSeriesDBService = connection.model("Serie", webSeriesSchema);
let seasonDBService = connection.model("Season", seasonSchema);
let episodeDBService = connection.model("Episode", episodeSchema);

// Service methods

function addWebSeries(object, callback) {
  try {
    object._id = mongoose.Types.ObjectId(object._id);
    webSeriesDBService.findOne(
      { $or: [{ _id: object._id }, { uid: object.uid }] },
      function(error, data) {
        if (data) {
          callback(409, "Entry already exists", null);
        } else if (error) {
          logger.error(error);
          callback(500, "Internal server error", null);
        } else {
          var webSeriesToAdd = new webSeriesDBService(object);
          webSeriesToAdd.save(function(error) {
            if (error) {
              if (error.name === "ValidationError") {
                callback(400, "Error while parsing values", null);
              } else {
                logger.error(error);
                callback(500, "Error while saving the webSeries", null);
              }
            } else
              callback(201, "Success", {
                id: object._id,
                name: object.title
              });
          });
        }
      }
    );
  } catch (error) {
    logger.error(error);
    callback(500, "Internal server error", null);
  }
}

function addSeason(object, callback) {
  webSeriesDBService
    .findOne({ _id: object.series_id })
    .populate("seasons.season")
    .exec()
    .then(series => {
      if (isEmpty(series)) {
        callback(404, "Could not find web-series", null);
      } else {
        let alreadyExists = false;
        for (let season of series.seasons) {
          alreadyExists =
            season && object.season_number == season.season_number;
          if (alreadyExists) break;
        }
        if (alreadyExists) {
          callback(409, "Season with this season number already exists", null);
        } else {
          const newSeason = new seasonDBService(object);
          newSeason.save((error, result) => {
            if (error) {
              logger.error(error);
              callback(500, "Error while saving season", null);
            } else {
              let imageLinkToSet = "";
              for(const image of newSeason.images) {
                if (type === "cover") {
                  imageLinkToSet = image.url
                  break;
                }
              }
              if (isEmpty(imageLinkToSet) && newSeason.images.length) {
                imageLinkToSet = newSeason.images[0].url
              }
              series.seasons.push({
                season: result._id,
                season_number: result.season_number,
                image_link: imageLinkToSet
              });
              series.save((error, result) => {
                if (error) {
                  seasonDBService.findByIdAndDelete(newSeason._id);
                  logger.error(error);
                  callback(
                    500,
                    "Error while updating webseries\nRoll back triggered for season",
                    null
                  );
                } else {
                  callback(201, "Success", {
                    web_series: series.title,
                    season_number: object.season_number
                  });
                }
              });
            }
          });
        }
      }
    })
    .catch(error => {
      logger.error(error);
      callback(500, "Internal server error", null);
    });
}

function addEpisode(object, callback) {
  seasonDBService
    .findOne({ _id: object.season_id })
    .populate("episodes")
    .exec()
    .then(season => {
      if (isEmpty(season)) {
        callback(404, "Could not find season to add episode", null);
      } else {
        let episodeAlreadyExists = false;
        for (let episode of season.episodes) {
          episodeAlreadyExists =
            episode.episode_number === object.episode_number;
        }
        if (episodeAlreadyExists) {
          callback(409, "Episode already exists", null);
        } else {
          const newEpisode = new episodeDBService(object);
          newEpisode.save((error, result) => {
            if (error) {
              logger.error(error);
              callback(500, "Error while saving episode", null);
            } else {
              season.episodes.push(result._id);
              season.save((error, result) => {
                if (error) {
                  logger.error(error);
                  newEpisode.findByIdAndDelete(newEpisode._id);
                  callback(
                    500,
                    "Error while updating season\nRoll back triggered for episode",
                    null
                  );
                } else {
                  callback(201, "Success", {
                    season_number: season.season_number,
                    episode_numer: newEpisode.episode_number
                  });
                }
              });
            }
          });
        }
      }
    })
    .catch(error => {
      logger.error(error);
      callback(500, "Internal server error", null);
    });
}

function removeById(id, callback) {
  try {
    webSeriesDBService.findOneAndDelete(
      {
        _id: id
      },
      function(error, data) {
        if (error) {
          logger.error(error);
          callback(500, "Internal server error", null);
        } else if (isEmpty(data)) {
          callback(404, "Entry does not exist", null);
        } else {
          callback(200, "Success", {
            _id: id,
            name: data.title
          });
        }
      }
    );
  } catch (error) {
    logger.error(error);
    callback(500, "Internal server error", null);
  }
}

function modifyWebSeries(object, callback) {
  try {
    object.recheck_needed = false;
    object.is_approved = false;
    webSeriesDBService.findOne({ uid: object.uid }, function(error, data) {
      if (error) {
        logger.error(error);
        return callback(500, "Internal server error", null);
      } else if (!isEmpty(data) && !object.override_uid_check) {
        return callback(409, "Entry already exists", null);
      } else {
        webSeriesDBService.findOneAndUpdate(
          { _id: object._id },
          object,
          { overwrite: true },
          function(error, data) {
            if (error) {
              if (error.name === "ValidationError") {
                callback(400, "Error while parsing values", null);
              } else {
                logger.error(error);
                callback(500, "Error while modifying the webSeries", null);
              }
            } else if (isEmpty(data)) {
              callback(404, "Content not found on the server", null);
            } else {
              callback(200, "Successfully modified", {
                _id: object._id,
                name: object.title
              });
            }
          }
        );
      }
    });
  } catch (error) {
    logger.error(error);
    callback(500, "Internal server error", null);
  }
}

function incrementCounterById(id, callback) {
  webSeriesDBService.findOneAndUpdate(
    {
      $and: [{ _id: id }, { is_approved: true }]
    },
    {
      $inc: {
        click_counter: 1
      }
    },
    function(error, data) {
      if (error instanceof mongoose.CastError) {
        callback(412, "Invalid ID", null);
      } else if (error) {
        logger.error(error);
        callback(500, "Internal error", null);
      } else if (isEmpty(data)) {
        callback(404, "Content not found on the server", null);
      } else {
        callback(200, "Increment successful", null);
      }
    }
  );
}

function approveById(id, callback) {
  webSeriesDBService.findOneAndUpdate(
    { _id: id },
    {
      is_approved: true,
      recheck_needed: false
    },
    function(error, data) {
      if (error instanceof mongoose.CastError) {
        callback(412, "Invalid ID", null);
      } else if (error) {
        logger.error(error);
        callback(500, "Internal error", null);
      } else if (isEmpty(data)) {
        callback(404, "Content not found on the server", null);
      } else {
        callback(200, "Approved", {
          _id: id,
          name: data.title
        });
      }
    }
  );
}

function markForRecheckById(id, callback) {
  webSeriesDBService.findOneAndUpdate(
    { _id: id },
    {
      recheck_needed: true,
      is_approved: false
    },
    function(error, data) {
      if (error instanceof mongoose.CastError) {
        callback(412, "Invalid ID", null);
      } else if (error) {
        logger.error(error);
        callback(500, "Internal error", null);
      } else if (isEmpty(data)) {
        callback(404, "Content not found on the server", null);
      } else {
        callback(200, "Checked", {
          _id: id,
          name: data.title
        });
      }
    }
  );
}

function markReleasedById(id, callback) {
  webSeriesDBService.findOneAndUpdate(
    { _id: id },
    {
      is_released: true
    },
    function(error, data) {
      if (error instanceof mongoose.CastError) {
        callback(412, "Invalid ID", null);
      } else if (error) {
        logger.error(error);
        callback(500, "Internal error", null);
      } else if (isEmpty(data)) {
        callback(404, "Content not found on the server", null);
      } else {
        callback(200, "Marked passed", {
          _id: id,
          name: data.title
        });
      }
    }
  );
}

module.exports = {
  addWebSeries,
  addSeason,
  addEpisode,
  removeById,
  modifyWebSeries,
  incrementCounterById,
  approveById,
  markForRecheckById,
  markReleasedById
};
