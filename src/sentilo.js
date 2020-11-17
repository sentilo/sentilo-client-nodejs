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
const logger = require('./utils/SentiloLogs');
const utils = require('./utils/SentiloUtils');

const catalog = require('./CatalogServiceOperations');
const data = require('./DataServiceOperations');
const alarm = require('./AlarmServiceOperations');
const subscribe = require('./SubscriptionServiceOperations.js');

module.exports = {

    /**
     * Initialize the services with default and custom options
     */
    init : function(initOptions) {
        // Initialize the services
        catalog.init(initOptions);
        data.init(initOptions);
        alarm.init(initOptions);
        subscribe.init(initOptions);

        logger.debug("Samples module initialization successful");
    },

    /**
     * Search a sensor in the catalog
     *
     * @return boolean
     */
    existsSensorInCatalog : function(options) {
        // Get all sensors from provider
        const response = catalog.getSensors(options);

        // The params of the example
        const providerSearch = options.provider;
        const sensorSearch = options.sensor;

        // Look the desired sensor in the catalog...
        if (response && response.providers) {
            const provider = response.providers.find((provider) => provider.provider === providerSearch);
            if (!provider) {
                logger.error('Provider with name ' + providerSearch + ' not found, exiting');
                return false;
            }
            return !!provider.sensors.find(sensor => sensor.sensor === sensorSearch);
        }
    },

    /**
     * Create a sensor
     */
    createSensor : function(options) {
        logger.debug('Adding the sensor \'' + options.sensor + '\' to the catalog...');

        // Create an input message to inform the new sensor data
        // We are using the sample data, defined in ServicesConfiguration module
        const inputMessage = {
            body : {
                sensors : [ {
                    sensor : options.sensor,
                    description : options.sensorDesc,
                    type : options.sensorType,
                    dataType : options.sensorDataType,
                    unit : options.sensorUnit,
                    component : options.component,
                    componentType : options.componentType,
                    location : options.sensorLocation
                } ]
            }
        };

        logger.debug(inputMessage);

        const response = catalog.registerSensors(inputMessage);
        if (!response || !response.statusCode || response.statusCode !== 200) {
            logger.error('Error registering the sensors');
            logger.error(response);
            return false;
        }
        return true;
    },

    /**
     * Publish observations
     */
    publishObservations : function(value, options) {
        let observationsInputMessage = {
            body : {
                observations : [ {
                    value : value
                } ]
            }
        };

        observationsInputMessage = utils.mergeOptions(observationsInputMessage, options);

        const response = data.sendObservations(observationsInputMessage);
        if (utils.isResponseOK(response)) {
            logger.error('Error publishing observations');
            logger.error(response);
            return false;
        }
        return true;
    },

    /**
     * Create an alert list
     */
    createAlerts : function(alertsList) {
        var alertsImputMessage = {
            body : {
                alerts : alertsList.alerts
            }
        };

        var response = catalog.registerAlerts(alertsImputMessage);
        if (response && response.code && response.code === 400) {
            logger.error('Error registering alerts');
            logger.error(response);
            return false;
        } else {
            return true;
        }
    },

    /**
     * Publish an alarm
     */
    publishAlarm : function(alert, inputMessage) {
        var alarmInputMessage = {
            body : {
                message : inputMessage.message
            }
        };

        var response = alarm.publish(alert, alarmInputMessage);
        if (response && response.code && response.code === 400) {
            logger.error('Error publishing alarm');
            logger.error(response);
            return false;
        } else {
            return true;
        }
    },

    /**
     * Subscribe to a sensor order
     */
    subscribeOrder : function(inputMessage) {
        var subscriptionInputMessage = {
            body : {
                endpoint : inputMessage.endpoint
            }
        };

        var response = subscribe.subscribe(subscriptionInputMessage);
        if (response && response.code && response.code === 400) {
            logger.error('Error subscribing order');
            logger.error(response);
            return false;
        } else {
            return true;
        }
    },

    /**
     * Subscribe to all sensors orders from a provider
     */
    subscribeOrderToAll : function(inputMessage) {
        var subscriptionInputMessage = {
            body : {
                endpoint : inputMessage.endpoint
            }
        };

        var response = subscribe.subscribeToAll(subscriptionInputMessage);
        if (response && response.code && response.code === 400) {
            logger.error('Error subscribing order');
            logger.error(response);
            return false;
        } else {
            return true;
        }
    }
};
