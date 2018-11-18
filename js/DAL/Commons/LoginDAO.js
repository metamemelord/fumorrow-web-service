const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const helpers = require('./../../Utils/HelperFunctions');
const isEmpty = helpers.isEmpty;
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);

const dbDetails = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME
}

function performLogin(userDetails, callback) {
    try {
        var con = mysql.createConnection(dbDetails);
        con.connect();
        con.query("select * from category_managers where username=?", [userDetails.username], function (error, userDataFromDB) {
            con.end();
            if (error) {
                logger.error(error);
                return callback(500, "Internal server error", null);
            } else if (userDataFromDB === undefined || userDataFromDB.length === 0) {
                return callback(401, "User does not exist", null);
            } else if (userDataFromDB[0].is_approved === 0) {
                return callback(401, "Not approved by admin", null);
            } else if (userDataFromDB[0].privilages === 0) {
                return callback(503, "No privilages", null);
            } else {
                if (bcrypt.compareSync(userDetails.password, userDataFromDB[0].password_digest)) {
                    var userObject = {
                        username: userDataFromDB[0].username,
                        privilages: helpers.resolvePrivilages(userDataFromDB[0].privilages)
                    }
                    var lease_time = parseInt(process.env.TOKEN_LEASE_TIME);
                    jwt.sign(userObject, process.env.key, {
                        expiresIn: lease_time
                    }, function (error, token) {
                        if (error) {
                            logger.error(error);
                            return callback(500, "Internal server error", null);
                        } else {
                            return callback(200, "Success", {
                                "token": token,
                                "lease_time": lease_time
                            });
                        }
                    });
                }
                else {
                    return callback(401, "Invalid credentials", null);
                }
            }
        });
    } catch (error) {
        logger.error(error);
        return callback(500, "Internal server error", null)
    }
}

module.exports.performLogin = performLogin;
