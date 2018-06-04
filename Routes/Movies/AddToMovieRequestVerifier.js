module.exports = {
    verify: (req,res,next) => {
        if(req.body.name === undefined || req.body.day === undefined || req.body.month === undefined || req.body.year === undefined || req.body.artists === undefined || req.body.director === undefined || req.body.language === undefined || req.body.genres === undefined || req.body.description === undefined || req.body.imageProvider === undefined || req.body.imageUrl === undefined || req.body.referrerName === undefined || req.body.redirectUrl === undefined){
            return res.status(400).send("Bad Request");
        }
        else{
            next();
        }
    }
}