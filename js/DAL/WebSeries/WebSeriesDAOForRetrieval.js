var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const isEmpty = require("../../lib/HelperFunctions").isEmpty;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);

const privateWebSeriesFields = {
  is_approved: 0,
  recheck_needed: 0,
  click_counter: 0,
  predicted_ratings: 0,
  user_visit_info: 0,
  uid: 0,
  __v: 0
};

var connectionForRetrieval = null;
try {
  connectionForRetrieval = mongoose.createConnection(
    process.env.DATABASE_CONNECTION_STRING_FOR_READING_ONLY,
    { useNewUrlParser: true }
  );

  // Connection to DB

  connectionForRetrieval.on("error", function(error) {
    logger.error(error);
  });

  connectionForRetrieval.once("open", function() {
    logger.info("Connection to read-only user successful!");
  });
} catch (error) {
  logger.error(error);
}

require("assert").notEqual(connectionForRetrieval, null);

const webSeriesSchema = require("../../Models/WebSeriesModel");
const seasonSchema = require("../../Models/SeasonModel");
const episodeSchema = require("../../Models/EpisodeModel");
let webSeriesDBService = connectionForRetrieval.model("Serie", webSeriesSchema);
let seasonDBService = connectionForRetrieval.model("Season", seasonSchema);
let episodeDBService = connectionForRetrieval.model("Episode", episodeSchema);

function getAll(callback) {
  webSeriesDBService
    .find({ is_approved: true }, privateWebSeriesFields)
    .sort({ release_date: 1 })
    .exec(function(error, data) {
      if (error) {
        logger.error(error);
        callback(500, "Internal server error", null);
      }
      callback(200, "Success", data);
    });
}

function getAllWithSeasons(callback) {
  webSeriesDBService
    .find({ is_approved: true }, privateWebSeriesFields)
    .populate("seasons")
    .sort({ release_date: 1 })
    .exec(function(error, data) {
      if (error) {
        logger.error(error);
        callback(500, "Internal server error", null);
      }
      callback(200, "Success", data);
    });
}

function getSeasonById(id, callback) {
  seasonDBService.findOne(
    {
      $and: [{ _id: id }, { is_approved: true }]
    },
    privateWebSeriesFields,
    function(error, data) {
      if (error) {
        logger.error(error);
        if (error.name === "CastError") {
          callback(400, "Invalid ID", null);
        } else {
          callback(500, "Internal server error", null);
        }
      } else if (!data) {
        callback(404, "Data not found on server", null);
      } else {
        callback(200, "Success", data);
      }
    }
  );
}

function getSeasonWithEpisodesById(id, callback) {
  seasonDBService.findOne(
    {
      $and: [{ _id: id }, { is_approved: true }]
    },
    privateWebSeriesFields)
    .populate("episodes")
    .then(function(data, error) {
      if (error) {
        logger.error(error);
        if (error.name === "CastError") {
          callback(400, "Invalid ID", null);
        } else {
          callback(500, "Internal server error", null);
        }
      } else if (!data) {
        callback(404, "Data not found on server", null);
      } else {
        callback(200, "Success", data);
      }
    });
}

function getAllWithEpisodes(callback) {
  webSeriesDBService
    .find({ is_approved: true }, privateWebSeriesFields)
    .populate("seasons")
    .populate({
      path: "seasons",
      populate: {
        model: "Episode",
        path: "episodes"
      }
    })
    .sort({ release_date: 1 })
    .exec(function(error, data) {
      if (error) {
        logger.error(error);
        callback(500, "Internal server error", null);
      }
      callback(200, "Success", data);
    });
}

function getEpisodeById(id, callback) {
  episodeDBService.findOne(
    {
      $and: [{ _id: id }, { is_approved: true }]
    },
    privateWebSeriesFields,
    function(error, data) {
      if (error) {
        logger.error(error);
        if (error.name === "CastError") {
          callback(400, "Invalid ID", null);
        } else {
          callback(500, "Internal server error", null);
        }
      } else if (!data) {
        callback(404, "Data not found on server", null);
      } else {
        callback(200, "Success", data);
      }
    }
  );
}

function getInRange(begin, limit, callback) {
  webSeriesDBService
    .find({ is_approved: true }, privateWebSeriesFields)
    .sort({ _id: 1 })
    .skip(begin)
    .limit(limit)
    .exec(function(error, data) {
      if (error) {
        logger.error(error);
        callback(500, "Internal server error", null);
      }
      callback(200, "Success", data);
    });function getById(id, callback) {
      webSeriesDBService.findOne(
        {
          $and: [{ _id: id }, { is_approved: true }]
        },
        privateWebSeriesFields,
        function(error, data) {
          if (error) {
            logger.error(error);
            if (error.name === "CastError") {
              callback(400, "Invalid ID", null);
            } else {
              callback(500, "Internal server error", null);
            }
          } else if (!data) {
            callback(404, "Data not found on server", null);
          } else {
            callback(200, "Success", data);
          }
        }
      );
    }
}

function getAllByFilter(filter, callback) {
  webSeriesDBService
    .find(
      {
        $and: [
          { $or: [{ language: { $in: filter } }, { genres: { $in: filter } }] },
          { is_approved: true }
        ]
      },
      privateWebSeriesFields
    )
    .sort({ _id: 1 })
    .exec(function(error, data) {
      if (error) {
        logger.error(error);
        callback(500, "Internal server error", null);
      }
      callback(200, "Success", data);
    });
}
function getInRangeByFilter(filter, begin, limit, callback) {
  webSeriesDBService
    .find(
      {
        $and: [
          { $or: [{ language: { $in: filter } }, { genres: { $in: filter } }] },
          { is_approved: true }
        ]
      },
      privateWebSeriesFields
    )
    .sort({ _id: 1 })
    .skip(begin)
    .limit(limit)
    .exec(function(error, data) {
      if (error) {
        logger.error(error);
        callback(500, "Internal server error", null);
      }
      callback(200, "Success", data);
    });
}

function getById(id, callback) {
  webSeriesDBService.findOne(
    {
      $and: [{ _id: id }, { is_approved: true }]
    },
    privateWebSeriesFields,
    function(error, data) {
      if (error) {
        logger.error(error);
        if (error.name === "CastError") {
          callback(400, "Invalid ID", null);
        } else {
          callback(500, "Internal server error", null);
        }
      } else if (!data) {
        callback(404, "Data not found on server", null);
      } else {
        callback(200, "Success", data);
      }
    }
  );
}

function getAllForRechecking(callback) {
  webSeriesDBService
    .find({
      $and: [{ recheck_needed: true }, { is_approved: false }]
    })
    .sort({ _id: 1 })
    .exec(function(error, data) {
      if (error) {
        logger.error(error);
        callback(500, "Internal server error", null);
      }
      callback(200, "Success", data);
    });
}

function getAllUnchecked(callback) {
  webSeriesDBService
    .find()
    // .find({
    //   $and: [{ recheck_needed: false }, { is_approved: false }]
    // })
    .exec()
    .then(data => {
      callback(200, "Success", data);
    })
    .catch(error => {
      logger.error(error);
      callback(500, "Internal server error", null);
    });
}

function getAllReferrers(callback) {
  webSeriesDBService.aggregate(
    [
      { $match: { is_approved: true } },
      { $unwind: "$partners" },
      {
        $group: {
          _id: {
            partner_id: "$partners.partner_id",
            is_sponsored: "$partners.is_sponsored"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      {
        $group: {
          _id: null,
          partners: {
            $push: {
              id: "$_id.partner_id",
              is_sponsored: "$_id.is_sponsored",
              count: "$count"
            }
          }
        }
      },
      { $project: { partners: 1, _id: 0 } }
    ],
    function(error, data) {
      if (error) {
        logger.error(error);
        callback(500, "Internal server error", null);
      } else if (isEmpty(data)) {
        callback(204, "No data", null);
      } else {
        callback(200, "Success", data[0]);
      }
    }
  );
}

function getAllLanguages(callback) {
  webSeriesDBService.distinct("language", function(error, data) {
    if (error) {
      logger.error(error);
      callback(500, "Internal server error", null);
    } else {
      callback(200, "Success", data);
    }
  });
}

module.exports = {
  getAll,
  getAllWithSeasons,
  getSeasonById,
  getSeasonWithEpisodesById,
  getAllWithEpisodes,
  getEpisodeById,
  getById,
  getInRange,
  getAllByFilter,
  getInRangeByFilter,
  getAllForRechecking,
  getAllUnchecked,
  getAllReferrers,
  getAllLanguages
};
