const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const helpers = require('./../../Misc/HelperFunctions');
const logger = require('../../Loggers/index').Logger;
const filename = require('path').basename(__filename);

function performLogin(userDetails, callback) {
    try {
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "zKWWk7zKWWk7QNlFeISoU5QNlzKWWk7QNlFeISoU5FeISoU5",
            database: "fumorrow"
        });
        con.connect();
        con.query("select * from category_managers where username =?", [userDetails.username], function (error, userDataFromDB) {
            if (error) {
                con.end();
                logger.error(filename + ": " + error);
                return callback(500,"Internal server error" , null);
            }
            if (userDataFromDB === undefined || userDataFromDB.length === 0) {
                con.end();
                return callback(401,"Invalid credentials" , null);
            }
            else if (userDataFromDB[0].isApproved === 0) {
                con.end();
                return callback(401,"Not approved by admin" , null);
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
                                logger.error(filename + ": " + error);
                                return callback(500,"Internal server error" , null);
                            }, 5000);
                        } else {
                            return callback(200,"Success",{
                                "token": token
                            });
                        }
                    });
                }
                else {
                    con.end();
                    return callback(401,"Invalid credentials", null);
                }
            }
        });
    } catch (error) {
        logger.error(filename + ": " + error);
        return callback(500,"Internal server error", null)
    }
}

module.exports.performLogin = performLogin;