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

var subscriptionServiceOptions = {
    path : '/subscribe/order'
};

module.exports = {

    init : function(initOptions) {
        // Merge Default Services Options with the possible new values passed
        // via the serviceOptions parameter
        var serviceConfigOptions = servicesConfig.getServiceConfigOptions();
        subscriptionServiceOptions = utils.mergeOptions(serviceConfigOptions, utils.mergeOptions(subscriptionServiceOptions, initOptions));
        logger.debug('SubscriptionServiceOperations initialized');
    },

    subscribe : function(inputMessage) {
        logger.debug('Adding subscription message');

        var requestOptions = utils.mergeOptions(subscriptionServiceOptions, inputMessage);
        requestOptions.path = requestOptions.path + '/' + requestOptions.provider + '/' + requestOptions.sensor;

        // The input message must contains a correct order struture
        // You can see an entire example in the Sentilo API Doc:
        // http://www.sentilo.io/xwiki/bin/view/ApiDocs.Services.Subscription/RetrieveSensorOrders
        if (inputMessage.body && inputMessage.body.endpoint) {
            // The body must be a String or a Buffer
            if (typeof inputMessage.body === 'object') {
                requestOptions.body = JSON.stringify(inputMessage.body);
            }
            try {
                logger.debug(requestOptions);
                var response = rest.put(requestOptions);
                logger.debug("Subscription added");
                if (response.body && response.body.length > 0) {
                    return JSON.parse(response.body.toString());
                }
            } catch (e) {
                logger.error('Error adding subscription: ' + e.message, e.stack);
                return respMsg.error(e.code, e.message);
            }
        } else {
            logger.debug('There isn\'t any subscription to add');
        }

        return null;
    },

    subscribeToAll : function(inputMessage) {
        logger.debug('Adding subscription message to all provider sensors');

        const requestOptions = utils.mergeOptions(subscriptionServiceOptions, inputMessage);
        requestOptions.path = requestOptions.path + '/' + requestOptions.provider;

        // The input message must contains a correct order struture
        // You can see an entire example in the Sentilo API Doc:
        // http://www.sentilo.io/xwiki/bin/view/ApiDocs.Services.Subscription/RetrieveSensorOrders
        if (inputMessage && inputMessage.body && inputMessage.body.endpoint) {
            if (typeof inputMessage.body === 'object') {
                requestOptions.body = JSON.stringify(inputMessage.body);
            }
            try {
                const response = rest.put(requestOptions);
                logger.debug("Subscription added to all provider sensors");
                if (response.body && response.body.length > 0) {
                    return JSON.parse(response.body.toString());
                }
            } catch (e) {
                logger.error('Error adding subscription: ' + e.message, e.stack);
                return respMsg.error(e.code, e.message);
            }
        } else {
            logger.debug('There isn\'t any subscription to add');
        }

        return null;
    }

};
