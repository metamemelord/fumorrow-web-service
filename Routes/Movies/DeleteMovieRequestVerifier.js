module.exports = {
    verify: (req,res,next) => {
        if(req.body.id === undefined || req.body.id.length === 0){
            return res.status(400).send("Bad Request");
        }
        else{
            next();
        }
    }
}