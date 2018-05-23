const bcrypt = require('bcrypt');
const express = require('express');
const mysql = require('mysql');

const registrationRouter = express.Router();

registrationRouter.post('/api/registration', function (req, res) {
    try {
        setTimeout(function () {
            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "fumorrow"
            });
            con.connect(function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send("Server error");
                }
                if(req.body.fname === undefined || req.body.lname === undefined || req.body.uname === undefined || req.body.password === undefined)
                    return res.status(400).send("Please check the details entered");
                else{
                    var password = bcrypt.hashSync(req.body.password, 15);
                    var sql = `INSERT INTO catmans VALUES ("${req.body.fname}","${req.body.lname}","${req.body.uname}","${password}","0","0")`;
                    con.query(sql, function (err, result) {
                        if (err) {
                            console.log("ERROR: ", err, "\n");
                            con.rollback();
                            con.end();
                            if (err.code === "ER_DUP_ENTRY") {
                                res.status(409).send("User with this username exists");
                            }
                            else {
                                res.status(500).send("Server error");
                            }
                        } else {
                            con.commit();
                            con.end();
                            console.log("INFO: CREATED A NEW USER: ", req.body.uname, "\n");
                            res.status(201).send("User added successfully. Contact ADMIN for approval");
                        }
                    });
                }
            });
        }, 2000);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
})

module.exports = registrationRouter;