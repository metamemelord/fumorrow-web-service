var mongoose = require('mongoose');
var callCounter = 0;
mongoose.connect("mongodb+srv://category-managers:zKWWk7QNlFeISoU5@practice-cluster-egmvj.mongodb.net/test?retryWrites=true");

// Connection to DB

let db = mongoose.connection;
db.on('error', function (err) {
	console.error("connection error;", err);
});

db.once('open', function () {
	console.log("Connection successful!");
});

// Importing movie schema service

const movieSchema = require('../../Models/MovieModel');
let MovieDBService = mongoose.model('movie', movieSchema);

// Service methods

function returnAll(callback) {
	MovieDBService.find({}).sort({ "_id": 1 }).exec(function (err, data) {
		if (err) {
			console.log("Error while retrieving the document!")
			callback(null);
		}
		callCounter++;
		callback(data);
	});
}

function returnInRange(begin, limit, callback) {
	MovieDBService.find({}).sort({ "_id": 1 }).skip(begin).limit(limit).exec(function (err, data) {
		if (err) {
			console.log("Error while retrieving the document!")
			callback(null);
		} else {
			callCounter++;
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
			callCounter++;
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
			callCounter++;
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
			callCounter++;
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

function addToDB(object, callback) {
	object._id = mongoose.Types.ObjectId(object._id);
	MovieDBService.findOne({ $or: [{ "_id": object._id }, { "uid": object.uid }] }, function (err, data) {
		if (data) {
			callback(409)
		} else {
			var movieToAdd = new MovieDBService({
				_id: object._id,
				uid: object.uid,
				title: object.title,
				date: object.date,
				artists: object.artists,
				language: object.language,
				genres: object.genres,
				runtime: object.runtime,
				description: object.description,
				imageProvider: object.imageProvider,
				imageUrl: object.imageUrl,
				referrerName: object.referrerName,
				redirectUrl: object.redirectUrl,
				hasPassed: object.hasPassed,
				isSponsored: object.isSponsored,
				clickCounter: 0
			})
			movieToAdd.save(object, function (err) {
				if (err) {
					callback(500);
					console.log(err);
				} else callback(201);
			});
		}
	});
}

function deleteById(id, callback) {
	MovieDBService.findById(id, function (err, data) {
		if (err) {
			console.log(err);
			callback(503);
		} else if (data) {
			MovieDBService.remove({
				_id: id
			}, function (err) {
				if (err) {
					console.log(err);
					callback(500);
				}
				else callback(200);
			});
		} else callback(404);
	})
}

function incCount(id, callback) {
	console.log(id);
	MovieDBService.findByIdAndUpdate(id, {
		$inc: {
			'clickCounter': 1
		}
	}, function (err, data) {
		if (err instanceof mongoose.CastError) {
			callback(412);
		} else if (err) {
			console.log(err);
			callback(500);
		} else if (data === null) {
			callback(404);
		} else {
			callback(200);
		}
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

function updateApproval(id, callback) {
	MovieDBService.findByIdAndUpdate(id, {
		'isApproved': true,
		'isChecked': true
	}, function (err, data) {
		if (err instanceof mongoose.CastError) {
			callback(412);
		} else if (err) {
			console.log(err);
			callback(500);
		} else if (data === null) {
			callback(404);
		} else {
			callback(200);
		}
	});
}

function updateCheckingStatus(id, callback) {
	MovieDBService.findByIdAndUpdate(id, {
		'isChecked': true
	}, function (err, data) {
		if (err instanceof mongoose.CastError) {
			callback(412);
		} else if (err) {
			console.log(err);
			callback(500);
		} else if (data === null) {
			callback(404);
		} else {
			callback(200);
		}
	});
}

function addTheater(id,theaters,callback){
	MovieDBService.findByIdAndUpdate(id,{
		$push:{
			'showingAt':theaters
		}
	},
		function(err, data){
			if(err){
				console.log("ERROR :",err);
				callback(500);
			}
			else if(data === null){
				callback(404);
			}
			else{
				callback(200);
			}
		}
	);
}

function markPassed(id, callback) {
	MovieDBService.findByIdAndUpdate(id, {
		'hasPassed':true
	}, function (err, data) {
		if (err instanceof mongoose.CastError) {
			callback(412);
		} else if (err) {
			console.log(err);
			callback(500);
		} else if (data === null) {
			callback(404);
		} else {
			callback(200);
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
	addMovie: addToDB,
	removeById: deleteById,
	addShowingAt:addTheater,
	getAllReferrers: returnAllReferrers,
	incrementCounterById: incCount,
	approveById: updateApproval,
	markCheckedById: updateCheckingStatus,
	markedPassedById:markPassed,
	getAllLanguages: returnAllLanguages
};