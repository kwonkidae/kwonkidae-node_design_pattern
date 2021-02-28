const logger = require('./logger');
const cLogger = require('./classLogger');
const dbLogger = new cLogger('DB');
dbLogger.info('This is an informational message');
const accessLogger = new cLogger('ACCESS');
accessLogger.verbose('This is a verbose message');

logger.info('This is an informational message');
logger.verbose('This is a verbose message');

const iLogger = require('./iLogger');
iLogger.log('This is an informational message');

const customLogger = new iLogger.constructor('CUSTOM');
customLogger.log(`This is an informational message`);
