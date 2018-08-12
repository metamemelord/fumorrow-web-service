var mongoose = require('mongoose');
const logger = require('../../Loggers/index').Logger;
const filename = require('path').basename(__filename);

var connectionForRetrieval = null;
try {
	connectionForRetrieval = mongoose.createConnection(process.env.DATABASE_CONNECTION_STRING_FOR_READING_ONLY, { useNewUrlParser: true });

	// Connection to DB

	connectionForRetrieval.on('error', function (error) {
		logger.error(filename + ": " + error);
	});

	connectionForRetrieval.once('open', function () {
		logger.info(filename + " - Connection to read-only user successful!");
	});
} catch (error) {
	logger.error(filename + ": " + error);
}

require('assert').notEqual(connectionForRetrieval, null);

const movieSchema = require('../../Models/MovieModel');
let MovieDBService = connectionForRetrieval.model('movie', movieSchema);


function returnAll(callback) {
	MovieDBService.find({}).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(filename + ": " + error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnInRange(begin, limit, callback) {
	MovieDBService.find({}).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (error, data) {
		if (error) {
			logger.error(filename + ": " + error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnAllByFilter(filter, callback) {
	MovieDBService.find({ $or: [{ "language": { "$in": filter } }, { "genres": { "$in": filter } }] }).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(filename + ": " + error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}
function returnInRangeByFilter(filter, begin, limit, callback) {
	MovieDBService.find({ $or: [{ "language": { "$in": filter } }, { "genres": { "$in": filter } }] }).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (error, data) {
		if (error) {
			logger.error(filename + ": " + error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnById(id, callback) {
	MovieDBService.findById(id, function (error, data) {
		if (error) {
			logger.error(filename + ": " + error);
			callback(500, "Internal server error", null);
		} else if (!data) {
			callback(404, "Data not found on server", null);
		} else {
			callback(200, "Success", data);
		}
	});
}

function returnAllForRechecking(callback) {
	MovieDBService.find({
		$and: [{ "recheck_needed": true }, { "is_approved": false }]
	}).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(filename + ": " + error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnAllUnchecked(callback) {
	MovieDBService.find({ 
		$or: [ {"recheck_needed": false}, {"is_approved": false}] 
	}).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(filename + ": " + error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}


function returnAllReferrers(callback) {
	MovieDBService.aggregate([
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
			logger.error(filename + ": " + error);
			callback(500, "Internal server error", null);
		} else {
			callback(200, "Success", data);
		}
	});
}

function returnAllLanguages(callback) {
	MovieDBService.distinct("language", function (error, data) {
		if (error) {
			logger.error(filename + ": " + error);
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