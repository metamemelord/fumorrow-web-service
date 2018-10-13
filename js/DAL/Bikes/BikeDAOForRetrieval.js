var mongoose = require('mongoose');
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);

var connectionForRetrieval = null;
try {
	connectionForRetrieval = mongoose.createConnection(process.env.DATABASE_CONNECTION_STRING_FOR_READING_ONLY, { useNewUrlParser: true });

	// Connection to DB

	connectionForRetrieval.on('error', function (error) {
		logger.error(error);
	});

	connectionForRetrieval.once('open', function () {
		logger.info("Connection to read-only user successful!");
	});
} catch (error) {
	logger.error(error);
}

require('assert').notEqual(connectionForRetrieval, null);

const bikeSchema = require('../../Models/BikesModel');
let BikeDBService = connectionForRetrieval.model('bike', bikeSchema);


function returnAll(callback) {
	BikeDBService.find({ "is_approved": true }).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnInRange(begin, limit, callback) {
	BikeDBService.find({ "is_approved": true }).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnAllByFilter(filter, callback) {
	BikeDBService.find({ $and: [
							{
								$or: [
									{ "language": { "$in": filter } }, 
									{ "genres": { "$in": filter } }
								]
							},
							{ "is_approved": true }
						]
						}).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}
function returnInRangeByFilter(filter, begin, limit, callback) {
	BikeDBService.find({ $or: [{ "language": { "$in": filter } }, { "genres": { "$in": filter } }] }).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnById(id, callback) {
	BikeDBService.findOne({_id:id}, function (error, data) {
		if (error) {
			if(error.name === "CastError") {
				callback(400, "Invalid ID", null);
			} else {
				logger.error(error);
				callback(500, "Internal server error", null);
			}
		} else if (!data) {
			callback(404, "Data not found on server", null);
		} else {
			callback(200, "Success", data);
		}
	});
}

function returnAllForRechecking(callback) {
	BikeDBService.find({
		$and: [{ "recheck_needed": true }, { "is_approved": false }]
	}).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnAllUnchecked(callback) {
	BikeDBService.find({ 
		$and: [ {"recheck_needed": false}, {"is_approved": false}] 
	}).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}


function returnAllReferrers(callback) {
	BikeDBService.aggregate([
		{
			$group: {
				"_id": "$referrer_name",
				"count": { "$sum": 1 }
			}
		},
		{
			$sort: { "count": -1 }
		}
	], function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		} else {
			callback(200, "Success", data);
		}
	});
}

function returnAllLanguages(callback) {
	BikeDBService.distinct("language", function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		} else {
			callback(200, "Success", data);
		}
	});
}

module.exports = {
	getAll: returnAll,
	getById: returnById,
	getInRange: returnInRange,
	getAllByFilter: returnAllByFilter,
	getInRangeByFilter: returnInRangeByFilter,
	getAllForRechecking: returnAllForRechecking,
	getAllUnchecked: returnAllUnchecked,
	getAllReferrers: returnAllReferrers,
	getAllLanguages: returnAllLanguages
};