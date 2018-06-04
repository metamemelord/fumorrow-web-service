
const express = require('express');
const DAL = require('../../DAL/index');
const movieDAO = DAL.MovieDAO;
const addShowingAtRouter = express.Router();
const jwt = require('jsonwebtoken');
const helpers = require("../../Misc/HelperFunctions");

addShowingAtRouter.post('/api/movie/showingat', helpers.tokenVerifier, function (req, res) {
    try{
        jwt.verify(req.token, process.env.key, function (err, authData) {
            if (err) {
                console.log(err);
                return res.status(401).send("Invalid token");
            } else {
                if (!authData['privilages'].includes('movies')) {
                    return res.status(403).send("Insufficient privilages");
                } else {
                    var id = req.body.id;
                    var theaters = req.body.theaters;
                    if (req.body.id === undefined || id.length === 0) {
                        return (400).send("Please provide a valid ID");
                    }
                    if (theaters.length === 0 || theaters === undefined){
                        return res.status(400).send("Invalid request");
                    }
                    movieDAO.addShowingAt(id, theaters,function(responseCode){
                        if(responseCode === 200){
                            return res.status(200).send("Success");
                        }
                        else if(responseCode === 404){
                            return res.status(404).send("Entry doesn't exist in database");
                        }
                        else{
                            return res.status(500).send("Internal server error");
                        }
                    });
                }
            }
        });
    }
    catch(error){
        console.log("ERROR: ", error);
        return res.status(500).send("Internal server error");
    }
});

module.exports = addShowingAtRouter;