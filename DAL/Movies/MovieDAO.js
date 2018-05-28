var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://user-for-rw:3f76ajyizkHKFfif@cluster0-qwhao.mongodb.net/fumorrow-primary?retryWrites=true");

// Connection to DB

let db = mongoose.connection;
db.on('error', function (err) {
	console.error("ERROR: ", err);
});

db.once('open', function () {
	console.log("INFO: Connection to RW user successful!");
});

// Importing movie schema service

const movieSchema = require('../../Models/MovieModel');
let MovieDBService = mongoose.model('movie', movieSchema);

// Service methods

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
				director: object.director,
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
	addMovie: addToDB,
	removeById: deleteById,
	addShowingAt:addTheater,
	incrementCounterById: incCount,
	approveById: updateApproval,
	markCheckedById: updateCheckingStatus,
	markedPassedById:markPassed
};