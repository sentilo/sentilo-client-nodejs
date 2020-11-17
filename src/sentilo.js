// Include some Sentilo operations from the Nodejs client library
const configuration = require('./ServicesConfiguration');
const serviceOperations = require('./DataServiceOperations');

serviceOperations.init();

serviceOperations.sendObservations();
