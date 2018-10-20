var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
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

const carSchema = require('../../Models/CarsModel');
let CarDBService = connection.model('car', carSchema);

// Service methods

function addCar(object, callback) {
	try {
		object._id = mongoose.Types.ObjectId(object._id);
		CarDBService.findOne({ $or: [{ "_id": object._id }, { "uid": object.uid }] }, function (error, data) {
			if (data) {
				callback(409, "Entry already exists", null);
			} else if (error) {
				logger.error(error);
				callback(500, "Internal server error", null);
			} else {
				var carToAdd = new CarDBService(object);
				carToAdd.save(object, function (error) {
					if (error) {
						logger.error(error);
						callback(500, "Error while saving the car", null);
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
		CarDBService.findOneAndRemove({
			_id: id
		}, function (error, data) {
			if (error) {
				logger.error(error);
				callback(500, "Internal server error", null);
			} else if (data === null) {
				callback(404, "Entry does not exist", null);
			} else {
				callback(200, "Success", {
					"name": data.car_name
				});
			}
		})
	}
	catch (error) {
		logger.error(error);
		callback(500, "Internal server error", null);
	}
}

function modifyCar(object, callback) {
	try {
		object.recheck_needed = false;
		object.is_approved = false;
		CarDBService.findOneAndUpdate({ "_id": object._id },
			object,
			{ overwrite: true },
			function (error) {
				if (error) {
					logger.error(error);
					callback(500, "Internal server error", null);
				} else {
					callback(200, "Successfully modified", {
						"_id": object._id,
						"car_name": object.car_name
					});
				}
			});
	} catch (error) {
		logger.error(error);
		callback(500, "Internal server error", null);
	}
}

function incrementCounterById(id, callback) {
	CarDBService.findOneAndUpdate({ _id: id }, {
		$inc: {
			'click_counter': 1
		}
	}, function (error, data) {
		if (error instanceof mongoose.CastError) {
			callback(412, "Invalid ID", null);
		} else if (error) {
			logger.error(error);
			callback(500, "Internal error", null);
		} else if (data === null) {
			callback(404, "Content not found on the server", null);
		} else {
			callback(200, "Increment successful", null);
		}
	});
}

function approveById(id, callback) {
	CarDBService.findOneAndUpdate({ _id: id }, {
		'is_approved': true,
		'recheck_needed': false
	}, function (error, data) {
		if (error instanceof mongoose.CastError) {
			callback(412, "Invalid ID", null);
		} else if (error) {
			logger.error(error);
			callback(500, "Internal error", null);
		} else if (data === null) {
			callback(404, "Content not found on the server", null);
		} else {
			callback(200, "Approved", {
				"_id": id
			});
		}
	});
}

function markForRecheckById(id, callback) {
	CarDBService.findOneAndUpdate({ _id: id }, {
		'recheck_needed': true,
		'is_approved': false
	}, function (error, data) {
		if (error instanceof mongoose.CastError) {
			callback(412, "Invalid ID", null);
		} else if (error) {
			logger.error(error);
			callback(500, "Internal error", null);
		} else if (data === null) {
			callback(404, "Content not found on the server", null);
		} else {
			callback(200, "Marked for recheck", {
				"_id": id
			});
		}
	});
}

module.exports = {
	addCar: addCar,
	removeById: removeById,
	modifyCar: modifyCar,
	incrementCounterById: incrementCounterById,
	approveById: approveById,
	markForRecheckById: markForRecheckById
};