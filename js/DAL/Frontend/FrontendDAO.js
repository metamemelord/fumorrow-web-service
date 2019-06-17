var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const isEmpty = require("../../lib/HelperFunctions").isEmpty;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);

var connection = null;
try {
    connection = mongoose.createConnection(process.env.DATABASE_CONNECTION_STRING_FOR_WRITING, { useNewUrlParser: true });
    //Connection to DB

    connection.on("error", function(error){
        logger.error(error);
    });

    connection.once("open", function(){
        logger.info("Connection to RW user successfull");
    });
} catch(error){
    logger.error(logger);
}

require("assert").notEqual(connection, null);

//Importing Frontend Schema

const frontendSchema = require("../../Models/FrontendModel");
let frontendDBService = connection.model("frontend", frontendSchema);

//Service Methods

function addFrontend(object, callback) {
    try{
		object._id = mongoose.Types.ObjectId(object._id);
        var frontendToAdd = new frontendDBService(object);
        frontendToAdd.save(object, function(error){
            if(error){
                if(error.name === "ValidationError") {
                    callback(400, "Error while parsing the values", null);
                } else{
                    logger.error(logger);
                    callback(500, "Error while saving the values", null);
                }
            } else callback(201, "Success", {
                "id": object._id,
                "name": object.title
            });
        });

    } catch(error){
        logger.error(logger);
        callback(500, "Internal server Error", null);
    }
}

function removeById(id, callback) {
	try {
		frontendDBService.findOneAndDelete({
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

function modifyFrontend(object, callback) {
	try {
		movieDBService.findOne({ "uid": object.uid }, function (error, data) {
			if (error) {
				logger.error(error);
				return callback(500, "Internal server error", null);
			} else if (!isEmpty(data) && !(object.override_uid_check)) {
				return callback(409, "Entry already exists", null);
			} else {
				movieDBService.findOneAndUpdate({ "_id": object._id },
					object,
					{ overwrite: true },
					function (error, data) {
						if (error) {
							if (error.name === "ValidationError") {
								callback(400, "Error while parsing values", null);
							} else {
								logger.error(error);
								callback(500, "Error while modifying the movie", null);
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

module.exports = {
    addFrontend,
    removeById,
    modifyFrontend
};