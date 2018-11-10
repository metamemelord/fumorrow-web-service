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

const videoGameSchema = require('../../Models/VideoGamesModel');
let videoGameDBService = connectionForRetrieval.model('videogame', videoGameSchema);


function getAll(callback) {
	videoGameDBService.find({ "is_approved": true }).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function getInRange(begin, limit, callback) {
	videoGameDBService.find({ "is_approved": true }).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function getAllByFilter(filter, callback) {
	videoGameDBService.find({
		$and: [
			{ "colors": { "$in": filter } },
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
function getInRangeByFilter(filter, begin, limit, callback) {
	videoGameDBService.find({
		$and: [
			{ "colors": { "$in": filter } },
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

function getById(id, callback) {
	videoGameDBService.findOne({
		$and: [{ "_id": id }, { "is_approved": true }]
	}, function (error, data) {
		if (error) {
			if (error.name === "CastError") {
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

function getAllForRechecking(callback) {
	videoGameDBService.find({
		$and: [{ "recheck_needed": true }, { "is_approved": false }]
	}).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function getAllUnchecked(callback) {
	videoGameDBService.find({
		$and: [{ "recheck_needed": false }, { "is_approved": false }]
	}).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function getAllReferrers(callback) {
	videoGameDBService.aggregate([
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

module.exports = {
	getAll,
	getById,
	getInRange,
	getAllByFilter,
	getInRangeByFilter,
	getAllForRechecking,
	getAllUnchecked,
	getAllReferrers
};
