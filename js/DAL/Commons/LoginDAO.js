const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const helpers = require('./../../Misc/HelperFunctions');
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
        con.query("select * from category_managers where username =?", [userDetails.username], function (error, userDataFromDB) {
            if (error) {
                con.end();
                logger.error(error);
                return callback(500, "Internal server error", null);
            }
            if (userDataFromDB === undefined || userDataFromDB.length === 0) {
                con.end();
                return callback(401, "Invalid credentials", null);
            }
            else if (userDataFromDB[0].isApproved === 0) {
                con.end();
                return callback(401, "Not approved by admin", null);
            }
            else {
                if (bcrypt.compareSync(userDetails.password, userDataFromDB[0].password_digest)) {
                    var userObject = {
                        username: userDataFromDB[0].username,
                        privilages: helpers.resolvePrivilages(userDataFromDB[0].privilages)
                    }
                    con.end();
                    jwt.sign(userObject, process.env.key, {
                        expiresIn: 3600
                    }, function (error, token) {
                        if (error) {
                            setTimeout(function () {
                                logger.error(error);
                                return callback(500, "Internal server error", null);
                            }, 5000);
                        } else {
                            return callback(200, "Success", {
                                "token": token
                            });
                        }
                    });
                }
                else {
                    con.end();
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