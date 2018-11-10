var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const isEmpty = require('../../Utils/HelperFunctions').isEmpty;
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);

var connection = null;
try {
	connection = mongoose.createConnection(process.env.DATABASE_CONNECTION_STRING_FOR_WRITING, { useNewUrlParser: true });
	// Connection to DB

	connection.on('error', function (error) {
		logger.error(error);
	});

	connection.once('open', function () {
		logger.info("Connection to RW user successful!");
	});
} catch (error) {
	logger.error(error);
}

require('assert').notEqual(connection, null);

// Importing movie schema service

const movieSchema = require('../../Models/MovieModel');
let movieDBService = connection.model('movie', movieSchema);

// Service methods

function addMovie(object, callback) {
	try {
		object._id = mongoose.Types.ObjectId(object._id);
		movieDBService.findOne({ $or: [{ "_id": object._id }, { "uid": object.uid }] }, function (error, data) {
			if (data) {
				callback(409, "Entry already exists", null);
			} else if (error) {
				logger.error(error);
				callback(500, "Internal server error", null);
			} else {
				var movieToAdd = new movieDBService(object);
				movieToAdd.save(object, function (error) {
					if (error) {
						if (error.name === 'ValidationError') {
							callback(400, "Error while parsing values", null);
						} else {
							logger.error(error);
							callback(500, "Error while saving the movie", null);
						}
					} else callback(201, "Success", {
						"id": object._id,
						"name": object.title
					});
				});
			}
		});
	} catch (error) {
		logger.error(error);
		callback(500, "Internal server error", null);
	}
}

function removeById(id, callback) {
	try {
		movieDBService.findOneAndDelete({
			_id: id
		}, function (error, data) {
			if (error) {
				logger.error(error);
				callback(500, "Internal server error", null);
			} else if (isEmpty(data)) {
				callback(404, "Entry does not exist", null);
			} else {
				callback(200, "Success", {
					"_id": id,
					"name": data.title
				});
			}
		})
	}
	catch (error) {
		logger.error(error);
		callback(500, "Internal server error", null);
	}
}

function modifyMovie(object, callback) {
	try {
		object.recheck_needed = false;
		object.is_approved = false;
		movieDBService.findOne({ "uid": object.uid }, function (error, data) {
			if (error) {
				logger.error(error);
				return callback(500, "Internal server error", null);
			} else if (!isEmpty(data) && !(object.override_uid_check)) {
				return callback(409, "Entry already exists", null);
			} else {
				movieDBService.findOneAndUpdate({ "_id": object._id },
					object,
					{ overwrite: true },
					function (error) {
						if (error, data) {
							if (error.name === 'ValidationError') {
								callback(400, "Error while parsing values", null);
							} else {
								logger.error(error);
								callback(500, "Error while modifying the movie", null);
							}
						} else if (isEmpty(data)) {
							callback(404, "Content not found on the server", null);
						} else {
							callback(200, "Successfully modified", {
								"_id": object._id,
								"name": object.title
							});
						}
					});
			}
		});
	} catch (error) {
		logger.error(error);
		callback(500, "Internal server error", null);
	}
}

function incrementCounterById(id, callback) {
	movieDBService.findOneAndUpdate({
		$and: [{ "_id": id }, { "is_approved": true }]
	}, {
			$inc: {
				'click_counter': 1
			}
		}
		, function (error, data) {
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
		});
}

function approveById(id, callback) {
	movieDBService.findOneAndUpdate({ _id: id }, {
		'is_approved': true,
		'recheck_needed': false
	}, function (error, data) {
		if (error instanceof mongoose.CastError) {
			callback(412, "Invalid ID", null);
		} else if (error) {
			logger.error(error);
			callback(500, "Internal error", null);
		} else if (isEmpty(data)) {
			callback(404, "Content not found on the server", null);
		} else {
			callback(200, "Approved", {
				"_id": id,
				"name": data.title
			});
		}
	});
}

function markForRecheckById(id, callback) {
	movieDBService.findOneAndUpdate({ _id: id }, {
		'recheck_needed': true,
		'is_approved': false
	}, function (error, data) {
		if (error instanceof mongoose.CastError) {
			callback(412, "Invalid ID", null);
		} else if (error) {
			logger.error(error);
			callback(500, "Internal error", null);
		} else if (isEmpty(data)) {
			callback(404, "Content not found on the server", null);
		} else {
			callback(200, "Checked", {
				"_id": id,
				"name": data.title
			});
		}
	});
}

function addShowingAt(id, showing_at, callback) {
	movieDBService.findOneAndUpdate({ _id: id }, {
		$push: {
			'showing_at': showing_at
		}
	},
		function (error, data) {
			if (error instanceof mongoose.CastError) {
				callback(412, "Invalid ID", null);
			} else if (error) {
				logger.error(error);
				callback(500, "Internal error", null);
			} else if (isEmpty(data)) {
				callback(404, "Content not found on the server", null);
			} else {
				callback(200, "Added theaters", {
					"_id": id,
					"name": data.title,
					"showing_at": showing_at
				});
			}
		}
	);
}

function markReleasedById(id, callback) {
	movieDBService.findOneAndUpdate({ _id: id }, {
		'is_released': true
	}, function (error, data) {
		if (error instanceof mongoose.CastError) {
			callback(412, "Invalid ID", null);
		} else if (error) {
			logger.error(error);
			callback(500, "Internal error", null);
		} else if (isEmpty(data)) {
			callback(404, "Content not found on the server", null);
		} else {
			callback(200, "Marked passed", {
				"_id": id,
				"name": data.title
			});
		}
	});
}

module.exports = {
	addMovie,
	removeById,
	modifyMovie,
	incrementCounterById,
	approveById,
	markForRecheckById,
	addShowingAt,
	markReleasedById
};
