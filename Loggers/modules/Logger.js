const log4js = require('log4js');
log4js.configure({
    appenders: { sysout: { type: 'stdout' }, fout: { type: 'file', filename: process.env.LOG_FILE, maxLogSize: 2097152, backups: 10 } },
    categories: { default: { appenders: ['sysout', 'fout'], level: 'ALL' } }
});
const Logger = log4js.getLogger('WEB-SERVICE');
module.exports = Logger;