/*
 * Sentilo
 * 
 *      
 * Original version 1.4 Copyright (C) 2013 Institut Municipal d’Informàtica, Ajuntament de Barcelona.
 * Modified by Opentrends adding support for multitenant deployments and SaaS. 
 * Modifications on version 1.5 Copyright (C) 2015 Opentrends Solucions i Sistemes, S.L.
 * 
 * This program is licensed and may be used, modified and redistributed under the terms of the
 * European Public License (EUPL), either version 1.1 or (at your option) any later version as soon
 * as they are approved by the European Commission.
 * 
 * Alternatively, you may redistribute and/or modify this program under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation; either version 3 of the
 * License, or (at your option) any later version.
 * 
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied.
 * 
 * See the licenses for the specific language governing permissions, limitations and more details.
 * 
 * You should have received a copy of the EUPL1.1 and the LGPLv3 licenses along with this program;
 * if not, you may find them at:
 * 
 * https://joinup.ec.europa.eu/software/page/eupl/licence-eupl http://www.gnu.org/licenses/ and
 * https://www.gnu.org/licenses/lgpl.txt
 */
var servicesConfig = require('./ServicesConfiguration');
var rest = require('./utils/SentiloRestClient');
var logger = require('./utils/SentiloLogs');
var utils = require('./utils/SentiloUtils');
var respMsg = require('./utils/SentiloResponse');

var catalogServiceOptions = {
    path : '/catalog'
};

module.exports = {

    init : function(initOptions) {
        // Merge Default Services Options with the possible new values passed
        // via the serviceOptions parameter
        var serviceConfigOptions = servicesConfig.getServiceConfigOptions();
        catalogServiceOptions = utils.mergeOptions(serviceConfigOptions, utils.mergeOptions(catalogServiceOptions, initOptions));
        logger.debug('CatalogServiceOperations initialized');
    },

    /**
     * Retrieve a sensors list for the provider, into a data estructure that
     * represents the entire provider information
     * 
     * @param inputMessage
     *            A properties object that describes the request options
     * @returns JSON Object If the request goes OK, then return a JSON object
     *          that contains a list of sensors for the provider. Returns an
     *          error object in other case
     */
    getSensors : function(inputMessage) {
        logger.debug("Retrieving authorized sensors from catalog ");
        var requestOptions = utils.mergeOptions(catalogServiceOptions, inputMessage);
        try {
            var response = rest.get(requestOptions);
            logger.debug("Sensors retrieved ");
            if (response.body && response.body.length > 0) {
                return JSON.parse(response.body.toString());
            }
        } catch (e) {
            logger.error('Error retrieving sensors: ' + e.message);
            return respMsg.error(e.code, e.message);
        }
        return null;
    },

    /**
     * Registers a list of sensors into the catalog. The inputMessage must
     * contains, at least, a body field with a correct sensors list structure
     * like the especified in the Sentilo API Doc. Please, see this url for more
     * information:
     * http://www.sentilo.io/xwiki/bin/view/APIDocs.Service.Catalog/CreateSensors
     * 
     * @param inputMessage
     *            A properties object that describes the request options, with
     *            the list of sensors
     */
    registerSensors : function(inputMessage) {
        logger.debug("Registering sensors");

        var requestOptions = utils.mergeOptions(catalogServiceOptions, inputMessage);

        // The input message must contains a correct sensors struture
        // You can see an entire example in the Sentilo API Doc:
        // http://www.sentilo.io/xwiki/bin/view/APIDocs.Service.Catalog/CreateSensors
        if (inputMessage.body && inputMessage.body.sensors && inputMessage.body.sensors.length > 0) {
            // The body must be a String or a Buffer
            if (typeof inputMessage.body === 'object') {
                requestOptions.body = JSON.stringify(inputMessage.body);
            }

            // We must add the provider to the path
            requestOptions.path += '/' + requestOptions.provider;

            try {
                var response = rest.post(requestOptions);
                logger.debug("Sensors registered");
                if (response.statusCode === 200) {
                    return response;
                }
            } catch (e) {
                logger.error('Error retrieving sensors: ' + e.message);
                return respMsg.error(e.code, e.message);
            }
        } else {
            logger.debug('There isn\'t any sensor to register');
        }

    },

    /**
     * Update a list of sensors that already exists into the catalog. The
     * inputMessage must contains, at least, a body field with a correct sensors
     * list structure like the especified in the Sentilo API Doc. Please, see
     * this url for more information:
     * http://www.sentilo.io/xwiki/bin/view/APIDocs.Service.Catalog/CreateSensors
     * 
     * @param inputMessage
     *            A properties object that describes the request options, with
     *            the list of sensors
     */
    updateSensors : function(inputMessage) {
        logger.debug("Updating sensors");

        var requestOptions = utils.mergeOptions(catalogServiceOptions, inputMessage);

        // The input message must contains a correct sensors struture
        // You can see an entire example in the Sentilo API Doc:
        // http://www.sentilo.io/xwiki/bin/view/APIDocs.Service.Catalog/CreateSensors
        if (inputMessage.body && inputMessage.body.sensors && inputMessage.body.sensors.length > 0) {
            // The body must be a String or a Buffer
            if (typeof inputMessage.body === 'object') {
                requestOptions.body = JSON.stringify(inputMessage.body);
            }
            requestOptions.path += '/' + requestOptions.provider;
            try {
                logger.debug(requestOptions);
                var response = rest.put(requestOptions);
                logger.debug("Sensors updated");
                if (response.body && response.body.length > 0) {
                    return JSON.parse(response.body.toString());
                }
            } catch (e) {
                logger.error('Error updating sensors: ' + e.message);
                return respMsg.error(e.code, e.message);
            }
        } else {
            logger.debug('There isn\'t any sensor to update');
        }

        return null;
    },

    /**
     * Registers a list of alerts into the catalog. The inputMessage must
     * contains, at least, a body field with a correct alerts list structure
     * like the especified in the Sentilo API Doc. Please, see this url for more
     * information:
     * http://www.sentilo.io/xwiki/bin/view/APIDocs.Services.Alert/CreateAlerts
     * 
     * @param inputMessage A properties object that describes the request options, with the list of alerts
     *
     */
    registerAlerts : function(inputMessage) {
        logger.debug('Registering alerts');

        let requestOptions = utils.mergeOptions(catalogServiceOptions, inputMessage);

        // The input message must contains a correct alerts struture
        // You can see an entire example in the Sentilo API Doc:
        // http://www.sentilo.io/xwiki/bin/view/APIDocs.Services.Alert/CreateAlerts
        if (inputMessage.body && inputMessage.body.alerts && inputMessage.body.alerts.length > 0) {
            // The body must be a String or a Buffer
            if (typeof inputMessage.body === 'object') {
                requestOptions.body = JSON.stringify(inputMessage.body);
            }

            // We must add the provider to the path
            requestOptions.path += '/alert/' + requestOptions.provider;

            try {
                const response = rest.post(requestOptions);
                logger.debug("Alerts registered");
                if (response.body && response.body.length > 0) {
                    return JSON.parse(response.body.toString());
                }
            } catch (e) {
                logger.error('Error registering alerts: ' + e.message);
                return respMsg.error(e.code, e.message);
            }
        } else {
            logger.debug('There isn\'t any alert to register');
        }

        return null;
    }

};
