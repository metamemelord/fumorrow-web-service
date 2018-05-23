module.exports = (req, res, next) => {
    const token = req.header('authorization');
    if (token === undefined) {
        res.status(403).send("Unauthorized access")
    } else {
        req.token = token;
        next();
    }
}