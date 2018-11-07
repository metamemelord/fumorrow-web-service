const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const filename = require('path').basename(__filename);
const logger = require('../../Loggers/index').LoggerFactory.getLogger(filename);

const dbDetails = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME
}

function performRegistration(userDetails, callback) {
    try {
        setTimeout(function () {
            var con = mysql.createConnection(dbDetails);
            con.connect(function (error) {
                if (error) {
                    logger.error(error);
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
                                logger.warn(error);
                                return callback(409, "User with this username exists", {
                                    "username": userDetails.username
                                });
                            }
                            else {
                                logger.error(error);
                                return callback(500, "Internal server error", null);
                            }
                        } else {
                            con.commit();
                            con.end();
                            var fullName = userDetails.name.split(' ')
                                .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                                .join(' ');
                            logger.info("Created a new user: ", fullName);
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
        logger.error(error);
        return callback(500, "Internal server error", null);
    }

}

module.exports.performRegistration = performRegistration;
