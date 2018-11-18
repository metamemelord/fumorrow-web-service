var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);

const privateFields = {
	is_approved: 0,
	recheck_needed: 0,
	click_counter: 0,
	external_ratings: 0,
	predicted_ratings: 0,
	user_visit_info: 0,
	uid: 0,
	__v: 0
}

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
let bikeDBService = connectionForRetrieval.model('bike', bikeSchema);


function getAll(callback) {
	bikeDBService.find({ "is_approved": true }, privateFields).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function getInRange(begin, limit, callback) {
	bikeDBService.find({ "is_approved": true }, privateFields).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function getAllByFilter(filter, callback) {
	bikeDBService.find({
		$and: [
			{ "colors": { "$in": filter } },
			{ "is_approved": true }
		]
	}, privateFields).sort({ "_id": 1 }).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}
function getInRangeByFilter(filter, begin, limit, callback) {
	bikeDBService.find({
		$and: [
			{ "colors": { "$in": filter } },
			{ "is_approved": true }
		]
	}, privateFields).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (error, data) {
		if (error) {
			logger.error(error);
			callback(500, "Internal server error", null);
		}
		callback(200, "Success", data);
	});
}

function getById(id, callback) {
	bikeDBService.findOne({
		$and: [{ "_id": id }, { "is_approved": true }]
	}, privateFields, function (error, data) {
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
	bikeDBService.find({
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
	bikeDBService.find({
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
	bikeDBService.aggregate([
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
