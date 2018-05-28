var mongoose = require('mongoose');
var connectionForRetrieval = mongoose.createConnection("mongodb+srv://public-user:KWeGVa6Z4Eoo01Vm@cluster0-qwhao.mongodb.net/fumorrow-primary?retryWrites=true");

// Connection to DB

connectionForRetrieval.on('error', function (err) {
	console.error("ERROR: ", err);
});

connectionForRetrieval.once('open', function () {
	console.log("INFO: Connection to read-only user successful!");
});


const movieSchema = require('../../Models/MovieModel');
let MovieDBService = connectionForRetrieval.model('movie', movieSchema);


function returnAll(callback) {
	MovieDBService.find({}).sort({ "_id": 1 }).exec(function (err, data) {
		if (err) {
			console.log("Error while retrieving the document!")
			callback(null);
		}
		callback(data);
	});
}

function returnInRange(begin, limit, callback) {
	MovieDBService.find({}).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (err, data) {
		if (err) {
			console.log("Error while retrieving the document!")
			callback(null);
		} else {
			callback(data);
		}
	});
}

function returnAllByFilter(filter, callback) {
	MovieDBService.find({ $or: [{ "language": { "$in": filter } }, { "genres": { "$in": filter } }] }).sort({ "_id": 1 }).exec(function (err, data) {
		if (err) {
			console.log(err)
			callback(null);
		} else {
			callback(data);
		}
	});
}
function returnInRangeByFilter(filter, begin, limit, callback) {
	MovieDBService.find({ $or: [{ "language": { "$in": filter } }, { "genres": { "$in": filter } }] }).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (err, data) {
		if (err) {
			console.log(err)
			callback(null);
		} else {
			callback(data);
		}
	});
}

function returnById(id, callback) {
	MovieDBService.findById(id, function (err, data) {
		if (err) {
			console.log(err);
			callback(500,null);
		}else if(!data){
			callback(404,null);
		}else {
			callback(200,data);
		}
	});
}

function returnAllChecked(callback) {
	MovieDBService.find({
		$and: [{ "isChecked": true }, { "isApproved": false }]
	}).sort({ "_id": 1 }).exec(function (err, data) {
		if (err) {
			console.log("Error while retrieving the document!")
			callback(null);
		}
		callback(data);
	});
}

function returnAllUnchecked(callback) {
	MovieDBService.find({ "isChecked": false }).sort({ "_id": 1 }).exec(function (err, data) {
		if (err) {
			console.log("Error while retrieving the document!")
			callback(null);
		}
		callback(data);
	});
}


function returnAllReferrers(callback) {
	MovieDBService.aggregate([
		{
			$group: {
				"_id": "$referrerName",
				"count": { "$sum": 1 }
			}
		},
		{
			$sort: { "count": -1 }
		}
	], function (err, data) {
		if (err) {
			console.log(err);
			callback(null);
		} else {
			callback(data);
		}
	});
}

function returnAllLanguages(callback) {
	MovieDBService.distinct("language", function (err, data) {
		if (err) {
			console.log(err);
			callback(null);
		} else {
			callback(data);
		}
	});
}

module.exports = {
	getAll: returnAll,
	getById: returnById,
	getInRange: returnInRange,
	getAllByFilter: returnAllByFilter,
	getInRangeByFilter: returnInRangeByFilter,
	getAllChecked: returnAllChecked,
	getAllUnchecked: returnAllUnchecked,
	getAllReferrers: returnAllReferrers,
	getAllLanguages: returnAllLanguages
};