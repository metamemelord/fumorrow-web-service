var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const isEmpty = require("../../lib/HelperFunctions").isEmpty;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);

var connection = null;
try {
	connection = mongoose.createConnection(
		process.env.DATABASE_CONNECTION_STRING_FOR_WRITING,
		{ useNewUrlParser: true }
	);
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

// Importing movie schema service

const bookSchema = require("../../Models/BookModel");
let bookDBService = connection.model("book", bookSchema);

// Service methods

function addBook(object, callback) {
	try {
		object._id = mongoose.Types.ObjectId(object._id);
		bookDBService.findOne(
			{ $or: [{ _id: object._id }, { uid: object.uid }] },
			function (error, data) {
				if (data) {
					callback(409, "Entry already exists", null);
				} else if (error) {
					logger.error(error);
					callback(500, "Internal server error", null);
				} else {
					var bookToAdd = new bookDBService(object);
					bookToAdd.save(object, function (error) {
						if (error) {
							logger.error(error);
							if (error.name === "ValidationError") {
								callback(400, "Error while parsing values", null);
							} else {
								callback(500, "Error while saving the book", null);
							}
						} else
							callback(201, "Success", {
								id: object._id,
								name: object.title
							});
					});
				}
			}
		);
	} catch (error) {
		logger.error(error);
		callback(500, "Internal server error", null);
	}
}

function removeById(id, callback) {
	try {
		bookDBService.findOneAndRemove(
			{
				_id: id
			},
			function (error, data) {
				if (error) {
					logger.error(error);
					callback(500, "Internal server error", null);
				} else if (isEmpty(data)) {
					callback(404, "Entry does not exist", null);
				} else {
					callback(200, "Success", {
						name: data.book_name
					});
				}
			}
		);
	} catch (error) {
		logger.error(error);
		callback(500, "Internal server error", null);
	}
}

function modifyBook(object, callback) {
	try {
		object.recheck_needed = false;
		object.is_approved = false;
		bookDBService.findOne({ uid: object.uid }, function (error, data) {
			if (error) {
				logger.error(error);
				return callback(500, "Internal server error", null);
			} else if (!isEmpty(data) && !object.override_uid_check) {
				return callback(409, "Entry already exists", null);
			} else {
				bookDBService.findOneAndUpdate(
					{ _id: object._id },
					object,
					{ overwrite: true },
					function (error, data) {
						if (error) {
							if (error.name === "ValidationError") {
								callback(400, "Error while parsing values", null);
							} else {
								logger.error(error);
								callback(500, "Error while modifying the book", null);
							}
						} else if (isEmpty(data)) {
							callback(404, "Content not found on the server", null);
						} else {
							callback(200, "Successfully modified", {
								_id: object._id,
								book_name: object.book_name
							});
						}
					}
				);
			}
		});
	} catch (error) {
		logger.error(error);
		callback(500, "Internal server error", null);
	}
}

function incrementCounterById(id, callback) {
	bookDBService.findOneAndUpdate(
		{ _id: id },
		{
			$inc: {
				click_counter: 1
			}
		},
		function (error, data) {
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
		}
	);
}

function approveById(id, callback) {
	bookDBService.findOneAndUpdate(
		{ _id: id },
		{
			is_approved: true,
			recheck_needed: false
		},
		function (error, data) {
			if (error instanceof mongoose.CastError) {
				callback(412, "Invalid ID", null);
			} else if (error) {
				logger.error(error);
				callback(500, "Internal error", null);
			} else if (isEmpty(data)) {
				callback(404, "Content not found on the server", null);
			} else {
				callback(200, "Approved", {
					_id: data._id,
					book_name: data.book_name
				});
			}
		}
	);
}

function markForRecheckById(id, callback) {
	bookDBService.findOneAndUpdate(
		{ _id: id },
		{
			recheck_needed: true
		},
		function (error, data) {
			if (error instanceof mongoose.CastError) {
				callback(412, "Invalid ID", null);
			} else if (error) {
				logger.error(error);
				callback(500, "Internal error", null);
			} else if (isEmpty(data)) {
				callback(404, "Content not found on the server", null);
			} else {
				callback(200, "Checked", {
					_id: data._id,
					book_name: data.book_name
				});
			}
		}
	);
}

module.exports = {
	addBook,
	removeById,
	modifyBook,
	incrementCounterById,
	approveById,
	markForRecheckById
};
