const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const helpers = require('../../Misc/HelperFunctions');
var loginRouter = express.Router();

loginRouter.post('/api/login', function (req, res) {
    try{
        var userDetails = {
            uname: req.body.uname,
            password: req.body.password
        }
        if(userDetails.uname === undefined || userDetails.uname.length === 0 || userDetails.uname.split(" ").length > 1 || userDetails.password === undefined || userDetails.password.length === 0)
            return res.status(400).send("Invalid credentials");
        else{
            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "zKWWk7zKWWk7QNlFeISoU5QNlzKWWk7QNlFeISoU5FeISoU5",
                database: "fumorrow"
            });
                con.connect();
                con.query("select * from category_managers where uname =?",[userDetails.uname], function (err, userDataFromDB) {
                    if (err) {
                        con.end();
                        console.log("ERROR: ",err,"\n");
                        return res.status(500).send("Internal server error!");
                    }
                    if (userDataFromDB === undefined || userDataFromDB.length === 0) {
                        con.end();
                        return res.status(401).send("Invalid credentials");
                    }
                    else if(userDataFromDB[0].isApproved === 0){
                        con.end();
                        return res.status(401).send("Not approved by admin");
                    }
                    else {
                        if (bcrypt.compareSync(userDetails.password,userDataFromDB[0].password_digest)) {
                            var userObject = {
                                uname: userDataFromDB[0].uname,
                                privilages: helpers.resolvePrivilages(userDataFromDB[0].privilages)
                            }
                            con.end();
                            jwt.sign(userObject, process.env.key, {
                                expiresIn: 3600
                            }, function (err, token) {
                                if (err) {
                                    setTimeout(function () {
                                        console.log("ERROR: ",err);
                                        return res.status(500).send("Server error");
                                    }, 5000);
                                } else {
                                    return res.status(200).json({
                                        success: true,
                                        token: token
                                    });
                                }
                            });
                        }
                        else {
                            con.end();
                            return res.status(401).send("Invalid credentials");
                        }
                    }
                });
            }
            
        }
    catch (error) {
        console.log("ERROR: ", error,"\n");
        return res.status(500).send("Server error");
    }
});

module.exports = loginRouter;