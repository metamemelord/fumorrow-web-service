module.exports = (req, res, next) => {
    const token = req.header('authorization');
    if (token === undefined) {
        res.status(403).json({
            "status":{
                "code":403,
                "message":"Unauthorized access"
            },
            "data":null
        });
    } else {
        req.token = token;
        next();
    }
}