function generateNewId(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function checkDate(date) {
    var currentDate = new Date();
    var checkDate = new Date(date);
    return checkDate < currentDate;
}

function resolvePrivilages(privilageBitMask) {
    const availablePrivilages = ['movies', 'cars', 'books'];
    var grantedPrivilages = new Array();
    var i = 0;
    while (privilageBitMask > 0) {
        if (privilageBitMask % 2) {
            grantedPrivilages.push(availablePrivilages[i]);
        }
        i++;
        privilageBitMask = Math.floor(privilageBitMask / 2);
    }
    return grantedPrivilages;
}

function isEmpty(variable) {
    if (typeof (variable) == 'number' || typeof (variable) == 'boolean') {
        return false;
    }
    if (typeof (variable) == 'undefined' || variable === null) {
        return true;
    }
    if (typeof (variable.length) != 'undefined') {
        return variable.length == 0;
    }
    var count = 0;
    for (var i in variable) {
        if (variable.hasOwnProperty(i)) {
            count++;
        }
    }
    return count == 0;
}

function isNotEmpty(variable){
    return !isEmpty(variable);
}

module.exports = {
    generateNewId: generateNewId,
    checkDate: checkDate,
    resolvePrivilages: resolvePrivilages,
    isEmpty: isEmpty,
    isNotEmpty: isNotEmpty
}