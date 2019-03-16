var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const isEmpty = require("../../lib/HelperFunctions").isEmpty;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);

var connection = null;
try {
	connection = mongoose.createConnection(process.env.DATABASE_CONNECTION_STRING_FOR_WRITING, { useNewUrlParser: true });
	// Connection to DB

	connection.on("error", function (error) {
		logger.error(error);
	});

	connection.once("open", function () {
		logger.info("Connection to RW user successful!");
	});
} catch (error) {
	logger.error(error);
}

require("assert").notEqual(connection, null);

// Importing academic schema service

const academicSchema = require("../../Models/AcademicModel");
let academicDBSerivce = connection.model("academic", academicSchema);

// Service methods

function addAcademic(object, callback) {
	try {
		object._id = mongoose.Types.ObjectId(object._id);
		academicDBSerivce.findOne({ $or: [{ "_id": object._id }, { "uid": object.uid }] }, function (error, data) {
			if (data) {
				callback(409, "Entry already exists", null);
			} else if (error) {
				logger.error(error);
				callback(500, "Internal server error", null);
			} else {
				var academicToAdd = new academicDBSerivce(object);
				academicToAdd.save(object, function (error) {
					if (error) {
						if (error.name === "ValidationError") {
							callback(400, "Error while parsing values", null);
						} else {
							logger.error(error);
							callback(500, "Error while saving the academic", null);
						}
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
		academicDBSerivce.findOneAndDelete({
			_id: id
		}, function (error, data) {
			if (error) {
				logger.error(error);
				callback(500, "Internal server error", null);
			} else if (isEmpty(data)) {
				callback(404, "Entry does not exist", null);
			} else {
				callback(200, "Success", {
					"_id": id,
					"name": data.title
				});
			}
		});
	}
	catch (error) {
		logger.error(error);
		callback(500, "Internal server error", null);
	}
}

function modifyAcademic(object, callback) {
	try {
		object.recheck_needed = false;
		object.is_approved = false;
		academicDBSerivce.findOne({ "_id": object._id }, function (error, data) {
			if (error) {
				logger.error(error);
				return callback(500, "Internal server error", null);
			} else if (!isEmpty(data) && !(object.override_uid_check)) {
				return callback(409, "Entry already exists", null);
			} else {
				academicDBSerivce.findOneAndUpdate({ "_id": object._id },
					object,
					{ overwrite: true },
					function (error, data) {
						if (error) {
							if (error.name === "ValidationError") {
								callback(400, "Error while parsing values", null);
							} else {
								logger.error(error);
								callback(500, "Error while modifying the academic", null);
							}
						} else if (isEmpty(data)) {
							callback(404, "Content not found on the server", null);
						} else {
							callback(200, "Successfully modified", {
								"_id": object._id,
								"name": object.title
							});
						}
					});
			}
		});
	} catch (error) {
		logger.error(error);
		callback(500, "Internal server error", null);
	}
}

function incrementCounterById(id, callback) {
	academicDBSerivce.findOneAndUpdate({
		$and: [{ "_id": id }, { "is_approved": true }]
	}, {
			$inc: {
				"click_counter": 1
			}
		}
		, function (error, data) {
			if (error instanceof mongoose.CastError) {
				callback(412, "Invalid ID", null);
			} else if (error) {
				logger.error(error);
				callback(500, "Internal error", null);
			} else if (isEmpty(data)) {
				callback(404, "Content not found on the server", null);
			} else {
				callback(200, "Increment successful", null);
			}
		});
}

function approveById(id, callback) {
	academicDBSerivce.findOneAndUpdate({ _id: id }, {
		"is_approved": true,
		"recheck_needed": false
	}, function (error, data) {
		if (error instanceof mongoose.CastError) {
			callback(412, "Invalid ID", null);
		} else if (error) {
			logger.error(error);
			callback(500, "Internal error", null);
		} else if (isEmpty(data)) {
			callback(404, "Content not found on the server", null);
		} else {
			callback(200, "Approved", {
				"_id": id,
				"name": data.title
			});
		}
	});
}

function markForRecheckById(id, callback) {
	academicDBSerivce.findOneAndUpdate({ _id: id }, {
		"recheck_needed": true,
		"is_approved": false
	}, function (error, data) {
		if (error instanceof mongoose.CastError) {
			callback(412, "Invalid ID", null);
		} else if (error) {
			logger.error(error);
			callback(500, "Internal error", null);
		} else if (isEmpty(data)) {
			callback(404, "Content not found on the server", null);
		} else {
			callback(200, "Checked", {
				"_id": id,
				"name": data.title
			});
		}
	});
}

module.exports = {
	addAcademic,
	removeById,
	modifyAcademic,
	incrementCounterById,
	approveById,
	markForRecheckById,
};
