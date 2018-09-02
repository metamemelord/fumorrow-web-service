const bcrypt = require('bcrypt');
const express = require('express');
const mysql = require('mysql');
const logger = require('../../Loggers/index').Logger;
const filename = require('path').basename(__filename);

function performRegistration(userDetails, callback) {
    try {
        setTimeout(function () {
            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "zKWWk7zKWWk7QNlFeISoU5QNlzKWWk7QNlFeISoU5FeISoU5",
                database: "fumorrow"
            });
            con.connect(function (error) {
                if (error) {
                    logger.error(filename + ": " + error);
                    return callback(500, "Could not connect to DB. Please contact the admin", null);
                }
                else {
                    var password = bcrypt.hashSync(userDetails.password, 15);
                    var sql = 'INSERT INTO category_managers VALUES (?,?,?,?,"0","0")';
                    con.query(sql, [userDetails.name, userDetails.username, userDetails.email, password], function (error, result) {
                        if (error) {
                            con.rollback();
                            con.end();
                            if (error.code === "ER_DUP_ENTRY") {
                                logger.warn(filename + ": " + error);
                                return callback(409, "User with this username exists", {
                                    "username": userDetails.username
                                });
                            }
                            else {
                                logger.error(filename + ": " + error);
                                return callback(500, "Internal server error", null);
                            }
                        } else {
                            con.commit();
                            con.end();
                            var fullName = userDetails.name.split(' ')
                            .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                            .join(' ');
                            logger.info(filename + " - Created a new user: ", fullName);
                            return callback(201, "User added successfully. Contact ADMIN for approval.", {
                                "username": userDetails.username,
                                "name": fullName
                            });
                        }
                    });
                }
            });
        }, 2000);
    } catch (error) {
        logger.error(filename + ": " + error);
        return callback(500, "Internal server error", null);
    }

}

module.exports.performRegistration = performRegistration;