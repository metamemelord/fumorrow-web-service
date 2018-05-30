const express = require('express');
const DAL = require('../../DAL/index');
const movieDAO = DAL.MovieDAO;
const deleteMovieRouter = express.Router();
const jwt = require('jsonwebtoken');
const helpers = require("../../Misc/HelperFunctions");


deleteMovieRouter.post('/api/movie/delete', helpers.tokenVerifier, function (req, res) {
    try{
        jwt.verify(req.token, process.env.key, function (err, authData) {
            if (err) {
                console.log("ERROR: ",err);
                return res.status(401).send("Invalid token");
            } else {
                if (!authData['privilages'].includes('movies')) {
                    return res.status(403).send("Insufficient privilages");
                } else {
                    try {
                        var id = req.body._id;
                        if(id === undefined || id.length === 0){
                            return res.status(304).send("Invalid ID");
                        }
                        movieDAO.removeById(id, function (status) {
                            if (status === 200) {
                                res.status(200).send(id + " deleted successfully!");
                            } else if (status === 404) {
                                res.status(404).send("Invalid ID");
                            } else {
                                res.status(500).send("Internal server error");
                            }
                        })
                    } catch (error) {
                        console.log("ERROR: ",error);
                        res.status(304).send("Not modified");
                    }
                }
            }
        })
    }
    catch(error){
        console.log("ERROR: ",error);
        res.status(500).send("Internal server error")
    }
});

module.exports = deleteMovieRouter;
