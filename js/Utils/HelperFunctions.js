const filename = require('path').basename(__filename);
const logger = require('../Loggers/index').LoggerFactory.getLogger(filename);

function generateSalt(length) {
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
    var availablePrivilages = [];
    var grantedPrivilages = [];
    try {
        availablePrivilages = process.env.AVAILABLE_PRIVILAGES.split(',');
    } catch (error) {
        logger.error("Could not find available privilages in environment");
        return grantedPrivilages;
    }
    var i = 0;
    while (privilageBitMask > 0 && i < availablePrivilages.length) {
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

function isNotEmpty(variable) {
    return !isEmpty(variable);
}

function toTitleCase(string) {
    return string.split(' ')
        .map(s => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
        .join(' ');
}

function isNumber(variable) {
    var _result = isNotEmpty(variable);
    try {
        _result &= !isNaN(parseInt(variable))
    } catch (error) {
        _result &= false;
    }
    return _result
}

function isInteger(variable) {
    var _result = isNumber(variable);
    if (_result) {
        _result &= variable == Math.floor(variable);
    }
    return _result;
}

function isString(variable) {
    var _result = isNotEmpty(variable);
    if (_result) {
        _result &= variable.constructor === String;
    }
    return _result;
}

module.exports = {
    generateSalt,
    checkDate,
    resolvePrivilages,
    isEmpty,
    isNotEmpty,
    toTitleCase,
    isNumber,
    isInteger,
    isString
}