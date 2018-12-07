const mysql = require("mysql2");
const helpers = require("./../../Utils/HelperFunctions");
const isEmpty = helpers.isEmpty;
const filename = require("path").basename(__filename);
const logger = require("../../Loggers/index").LoggerFactory.getLogger(filename);

const dbDetails = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB_NAME
};

function addCelebrity(celebrityDetails, callback) {
	try {
		var con = mysql.createConnection(dbDetails);
		con.connect(function (error) {
			if (error) {
				logger.error(error);
				return callback(500, "Could not connect to database", null);
			}
			var sql = "insert into celebrities (first_name, middle_name, last_name, profession, description, dob, gender, image_link, is_approved) values (?, ?, ?, ?, ?, ?, ?, ?, ?);";
			var celebrityVariables = [celebrityDetails.first_name, celebrityDetails.middle_name, celebrityDetails.last_name, celebrityDetails.profession, celebrityDetails.description, celebrityDetails.dob, celebrityDetails.gender, celebrityDetails.image_link, 0];
			con.query(sql, celebrityVariables, function (error, celebrityDataFromDb) {
				if (error) {
					if (error.code === "ER_DUP_ENTRY") {
						con.rollback();
						con.end();
						return callback(409, "Celebrity exists in database", celebrityDetails);
					}
					con.rollback();
					con.end();
					logger.error(error);
					return callback(500, "Internal server error", null);
				} else {
					con.commit();
					con.end();
					var fullName = composeFullName(celebrityDetails.first_name, celebrityDetails.middle_name, celebrityDetails.last_name);
					logger.info("Created a new celebrity: ", fullName);
					return callback(201, "Celebrity created", {
						"id": celebrityDataFromDb.insertId,
						"name": fullName,
					});
				}
			});
		});
	} catch (error) {
		logger.error(error);
		return callback(500, "Internal server error", null);
	}
}

function deleteCelebrity(pid, callback) {
	try {
		var con = mysql.createConnection(dbDetails);
		con.connect(function (error) {
			if (error) {
				logger.error(error);
				return callback(500, "Could not connect to database", null);
			}
			var sql = "delete from celebrities where pid=?;";
			con.query(sql, [pid], function (error, data) {
				if (error) {
					con.end();
					logger.error(error);
					return callback(500, "Internal server error", null);
				} else if (data["affectedRows"] == 0) {
					con.end();
					return callback(404, "Celebrity not found", null);
				} else {
					con.commit();
					con.end();
					return callback(200, "Celebrity deleted", {
						"pid": pid
					});
				}
			});
		});
	} catch (error) {
		logger.error(error);
		return callback(500, "Internal server error", null);
	}
}

function getCelebrityById(pid, callback) {
	try {
		var con = mysql.createConnection(dbDetails);
		con.connect(function (error) {
			if (error) {
				logger.error(error);
				return callback(500, "Could not connect to database", null);
			}
			var sql = "select pid, first_name, middle_name, last_name, profession, dob, description, gender, image_link from celebrities where pid=? and is_approved=1";
			con.query(sql, pid, function (error, celebrityDataFromDb) {
				con.end();
				if (error) {
					logger.error(error);
					return callback(500, "Internal server error", null);
				} if (isEmpty(celebrityDataFromDb)) {
					return callback(404, "Celebrity not found", null);
				} else {
					return callback(200, "Success", celebrityDataFromDb[0]);
				}
			});
		});
	} catch (error) {
		logger.error(error);
		return callback(500, "Internal server error", null);
	}
}

function getAllCelebrities(callback) {
	try {
		var con = mysql.createConnection(dbDetails);
		con.connect(function (error) {
			if (error) {
				logger.error(error);
				return callback(500, "Could not connect to database", null);
			}
			var sql = "select pid, first_name, middle_name, last_name, profession, dob, description, gender, image_link from celebrities where is_approved=1";
			con.query(sql, function (error, celebrities) {
				con.end();
				if (error) {
					logger.error(error);
					return callback(500, "Internal server error", null);
				} else {
					return callback(200, "Success", celebrities);
				}
			});
		});
	} catch (error) {
		logger.error(error);
		return callback(500, "Internal server error", null);
	}
}

function getAllUnapprovedCelebrities(callback) {
	try {
		var con = mysql.createConnection(dbDetails);
		con.connect(function (error) {
			if (error) {
				logger.error(error);
				return callback(500, "Could not connect to database", null);
			}
			var sql = "select pid, first_name, middle_name, last_name, profession, dob, description, gender, image_link from celebrities where is_approved=0";
			con.query(sql, function (error, celebrities) {
				con.end();
				if (error) {
					logger.error(error);
					return callback(500, "Internal server error", null);
				} else {
					return callback(200, "Success", celebrities);
				}
			});
		});
	} catch (error) {
		logger.error(error);
		return callback(500, "Internal server error", null);
	}
}

function approveCelebrityById(pid, callback) {
	try {
		var con = mysql.createConnection(dbDetails);
		con.connect(function (error) {
			if (error) {
				logger.error(error);
				return callback(500, "Could not connect to database", null);
			}
			var sql = "update celebrities set is_approved=1 where pid=?";
			con.query(sql, pid, function (error, queryResult) {
				con.end();
				if (error) {
					logger.error(error);
					return callback(500, "Internal server error", null);
				} else {
					if (queryResult.affectedRows == 0) {
						return callback(404, "Celebrity does not exist", null);
					}
					else {
						return callback(200, "Success", {
							"pid": pid
						});
					}
				}
			});
		});
	} catch (error) {
		logger.error(error);
		return callback(500, "Internal server error", null);
	}
}

function updateCelebrity(celebrityDetails, callback) {
	try {
		var con = mysql.createConnection(dbDetails);
		con.connect(function (error) {
			if (error) {
				logger.error(error);
				return callback(500, "Could not connect to database", null);
			}
			var sql = "update celebrities set first_name=?, middle_name=?, last_name=?, profession=?," +
                "description=?, dob=?, gender=?, image_link=?, is_approved=? where pid=?;";
			var celebrityVariables = [celebrityDetails.first_name, celebrityDetails.middle_name,
				celebrityDetails.last_name, celebrityDetails.profession,
				celebrityDetails.description, celebrityDetails.dob, celebrityDetails.gender,
				celebrityDetails.image_link, 0, celebrityDetails.pid];
			con.query(sql, celebrityVariables, function (error, queryResult) {
				con.end();
				if (error) {
					logger.error(error);
					return callback(500, "Internal server error", null);
				} else {
					if (queryResult.affectedRows == 0) {
						return callback(404, "Celebrity does not exist", null);
					}
					else {
						return callback(200, "Success", {
							"pid": celebrityDetails.pid
						});
					}
				}
			});
		});
	} catch (error) {
		logger.error(error);
		return callback(500, "Internal server error", null);
	}
}

function searchCelebrityByNameTokens(nameTokens, callback) {
	try {
		var con = mysql.createConnection(dbDetails);
		con.connect(function (error) {
			if (error) {
				logger.error(error);
				return callback(500, "Could not connect to database", null);
			}
			var sql = "select pid, first_name, middle_name, last_name, profession, dob, image_link from celebrities where (";
			var preparedNameTokens = [];
			for (var i = 0; i < nameTokens.length; i++) {
				preparedNameTokens.push("%" + nameTokens[i] + "%");
				preparedNameTokens.push("%" + nameTokens[i] + "%");
				preparedNameTokens.push("%" + nameTokens[i] + "%");
				if (i) {
					sql += " or ";
				}
				sql += "first_name like ?";
				sql += " or middle_name like ?";
				sql += " or last_name like ?";
			}
			sql += ") and is_approved=1;";
			con.query(sql, preparedNameTokens, function (error, data) {
				con.end();
				if (error) {
					logger.error(error);
					return callback(500, "Internal server error", null);
				} else {
					var searchResults = [];
					data.forEach(function (person) {
						searchResults.push({
							"pid": person.pid,
							"name": composeFullName(person.first_name, person.middle_name, person.last_name),
							"dob": person.dob,
							"image_link": person.image_link,
						});
					});
					return callback(200, "OK", searchResults);
				}
			});
		});
	} catch (error) {
		logger.error(error);
		return callback(500, "Internal server error", null);
	}
}

function searchCelebrityByPid(pid, callback) {
	try {
		var con = mysql.createConnection(dbDetails);
		con.connect(function (error) {
			if (error) {
				logger.error(error);
				return callback(500, "Could not connect to database", null);
			}
			var sql = "select pid, first_name, middle_name, last_name, profession, dob, image_link from celebrities" +
                " where pid like ? and is_approved=1;";
			con.query(sql, pid + "%", function (error, data) {
				con.end();
				if (error) {
					logger.error(error);
					return callback(500, "Internal server error", null);
				} else {
					var searchResults = [];
					data.forEach(function (person) {
						searchResults.push({
							"pid": person.pid,
							"name": composeFullName(person.first_name, person.middle_name, person.last_name),
							"dob": person.dob,
							"image_link": person.image_link,
						});
					});
					return callback(200, "OK", searchResults);
				}
			});
		});
	} catch (error) {
		logger.error(error);
		return callback(500, "Internal server error", null);
	}
}

function composeFullName(first_name, middle_name, last_name) {
	return helpers.toTitleCase(first_name) + " "
        + (isEmpty(middle_name) ? "" : helpers.toTitleCase(middle_name) + " ")
        + (isEmpty(last_name) ? "" : helpers.toTitleCase(last_name));
}

module.exports = {
	addCelebrity,
	deleteCelebrity,
	updateCelebrity,
	getCelebrityById,
	getAllCelebrities,
	getAllUnapprovedCelebrities,
	approveCelebrityById,
	searchCelebrityByNameTokens,
	searchCelebrityByPid
};
