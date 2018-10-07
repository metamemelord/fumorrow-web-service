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

const bookSchema = require('../../Models/BooksModel');
let BookDBService = connectionForRetrieval.model('book', bookSchema);


function returnAll(callback) {
	BookDBService.find({}).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnInRange(begin, limit, callback) {
	BookDBService.find({}).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (error, data) {
		if (error) {
			logger.error(filename + ": " + error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnAllByFilter(filter, callback) {
	BookDBService.find({ $or: [{ "language": { "$in": filter } }, { "genres": { "$in": filter } }] }).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(filename + ": " + error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}
function returnInRangeByFilter(filter, begin, limit, callback) {
	BookDBService.find({ $or: [{ "language": { "$in": filter } }, { "genres": { "$in": filter } }] }).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnById(id, callback) {
	BookDBService.findById(id, function (error, data) {
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
	BookDBService.find({
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
	BookDBService.find({ 
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
	BookDBService.aggregate([
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
	BookDBService.distinct("language", function (error, data) {
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