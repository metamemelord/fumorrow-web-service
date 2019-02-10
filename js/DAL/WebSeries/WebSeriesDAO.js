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
let webSeriesDBService = connection.model("webseries", webSeriesSchema);

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
					webSeriesToAdd.save(object, function(error) {
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
	try {
		object._id = mongoose.Types.ObjectId(object._id);
		webSeriesDBService.findOne(
			{ $or: [{ _id: object._id }, { uid: object.uid }] },
			function(error, data) {
				if (isEmpty(data)) {
					callback(404, "Could not find web-series", null);
				} else if (error) {
					logger.error(error);
					callback(500, "Internal server error", null);
				} else {
					for (var idx = 0; idx < data.seasons.length; idx++) {
						if (data.seasons[idx].season_number === object.data.season_number) {
							return callback(409, "Season already exists", null);
						}
					}
					data.seasons.push(object.data);
					var webSeriesToAdd = new webSeriesDBService(data);
					webSeriesToAdd.save(object, function(error) {
						if (error) {
							if (error.name === "ValidationError") {
								callback(400, "Error while parsing values", null);
							} else {
								logger.error(error);
								callback(500, "Error while saving the webSeries", null);
							}
						} else
							callback(201, "Success", {
								season_number: object.season_number,
								name: object.data.title
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

function addEpisode(object, callback) {
	try {
		object._id = mongoose.Types.ObjectId(object._id);
		webSeriesDBService.findOne(
			{ $or: [{ _id: object._id }, { uid: object.uid }] },
			function(error, data) {
				if (isEmpty(data)) {
					callback(404, "Could not find web-series", null);
				} else if (error) {
					logger.error(error);
					callback(500, "Internal server error", null);
				} else {
					let seasonToAddEpisode = null;
					for (let idx = 0; idx < data.seasons.length; idx++) {
						let season = data.seasons[idx];
						if (
							season.season_number === object.season_number && season.season_number !== undefined
						) {
							seasonToAddEpisode = season;
						}
					}
					if (seasonToAddEpisode === null) {
						return callback(404, "Season not found", null);
					}
					for (let idx = 0; idx < seasonToAddEpisode.episodes.length; idx++) {
						if (
							seasonToAddEpisode.episodes[idx].episode_number ===
              object.data.episode_number
						) {
							return callback(409, "Episode already exists", null);
						}
					}
					seasonToAddEpisode.episodes.push(object.data);
					seasonToAddEpisode.runtime += object.data.runtime;
					var webSeriesToAdd = new webSeriesDBService(data);
					webSeriesToAdd.save(object, function(error) {
						if (error) {
							if (error.name === "ValidationError") {
								callback(400, "Error while parsing values", null);
							} else {
								logger.error(error);
								callback(500, "Error while saving the webSeries", null);
							}
						} else
							callback(201, "Success", {
								episode_number: object.data.episode_number,
								name: object.data.title
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
