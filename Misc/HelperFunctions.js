function genId(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function checkSmallDate(date){
    var currentDate = new Date();
    var checkDate = new Date(date);
    return checkDate < currentDate;
}

function privilagesResolver(privilageBitMask){
    const availablePrivilages = ['movies','cars','books'];
    var grantedPrivilages = new Array();
    var i = 0;
    while(privilageBitMask > 0)
    {
        if(privilageBitMask%2){
            grantedPrivilages.push(availablePrivilages[i]);
        }
        i++;
        privilageBitMask = Math.floor(privilageBitMask/2);
    }
    return grantedPrivilages;
}

function checkToken (req, res, next){
    const token = req.header('authorization');
    if (token === undefined) {
        res.status(403).send("Unauthorized access")
    } else {
        req.token = token;
        next();
    }
}

module.exports = {
    generateNewId:genId,
    checkDate:checkSmallDate,
    resolvePrivilages: privilagesResolver,
    tokenVerifier: checkToken
}