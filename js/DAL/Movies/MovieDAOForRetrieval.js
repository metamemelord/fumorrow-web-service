var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
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

const movieSchema = require('../../Models/MovieModel');
let MovieDBService = connectionForRetrieval.model('movie', movieSchema);


function returnAll(callback) {
	MovieDBService.find({ "is_approved": true }).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnInRange(begin, limit, callback) {
	MovieDBService.find({ "is_approved": true }).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnAllByFilter(filter, callback) {
	MovieDBService.find({
		$and: [
			{ $or: [{ "language": { "$in": filter } }, { "genres": { "$in": filter } }] },
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
	MovieDBService.find({
		$and: [
			{ $or: [{ "language": { "$in": filter } }, { "genres": { "$in": filter } }] },
			{ "is_approved": true }
		]
	}).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function returnById(id, callback) {
	MovieDBService.findOne({
		$and: [{ "_id": id }, { "is_approved": true }]
	},
		function (error, data) {
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

function returnAllForRechecking(callback) {
	MovieDBService.find({
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
	MovieDBService.find({
		$and: [{ "recheck_needed": false }, { "is_approved": false }]
	}).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}


function returnAllReferrers(callback) {
	MovieDBService.aggregate([
		{ "$match": { "is_approved": true } },
		{ "$unwind": "$partners" },
		{
			"$group": {
				"_id": { "partner_id": "$partners.partner_id", "is_sponsored": "$partners.is_sponsored" },
				"count": { "$sum": 1 }
			}
		},
		{ "$sort": { "count": -1 } },
		{
			"$group": {
				"_id": null,
				"partners": { "$push": { "id": "$_id.partner_id", "is_sponsored": "$_id.is_sponsored", "count": "$count" } }
			}
		},
		{ "$project": { "partners": 1, "_id": 0 } }
	], function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		} else {
			callback(200, "Success", data[0]);
		}
	});
}

function returnAllLanguages(callback) {
	MovieDBService.distinct("language", function (error, data) {
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