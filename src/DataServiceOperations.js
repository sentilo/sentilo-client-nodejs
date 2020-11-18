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

var dataServiceOptions = {
    path : '/data'
};

module.exports = {

    /**
     * Initializes the Data Service Operations Module
     * 
     * @param initOptions Options object with new service configuration
     */
    init : function(initOptions) {
        var serviceConfigOptions = servicesConfig.getServiceConfigOptions();
        dataServiceOptions = utils.mergeOptions(serviceConfigOptions, utils.mergeOptions(dataServiceOptions, initOptions));
        logger.debug('DataServiceOperations module initialized');
    },

    /**
     * Retrieve a list of the last observations published on a sensor
     * 
     * @param inputMessage A map opbject where you can specify params for silter the
     *            query (it must be in a field named 'qs')
     * @returns A JSON object with the observations list
     */
    getLastObservations : function(inputMessage) {
        var requestOptions = utils.mergeOptions(dataServiceOptions, inputMessage);
        requestOptions.path += '/' + requestOptions.provider + '/' + requestOptions.sensor;

        try {
            var response = rest.get(requestOptions);
            logger.debug("Observations has been retrieved");
            if (response.body && response.body.length > 0) {
                return JSON.parse(response.body.toString());
            }
        } catch (e) {
            logger.error('Error retrieving observations: ' + e.message, e.stack);
            return respMsg.error(e.code, e.message);
        }

        return null;
    },

    /**
     * Send a single or a list of observations to a sensor. It may be an
     * observation structure like the specified in the Sentilo API Doc. Please
     * see this url for more information:
     * http://www.sentilo.io/xwiki/bin/view/ApiDocs.Services.Data/PublishSensorData
     * 
     * @param inputMessage A map object with a list of observations
     * @returns A JSON object only if there is an error
     */
    sendObservations : function(inputMessage) {
        logger.debug("Sending observations");

        var requestOptions = utils.mergeOptions(dataServiceOptions, inputMessage);
        requestOptions.path += '/' + requestOptions.provider + '/' + requestOptions.sensor;

        // The input message must contains a correct observation struture
        // You can see an entire example in the Sentilo API Doc:
        // https://sentilo.readthedocs.io/en/latest/api_docs/general_model.html#json-format
        if (inputMessage.body && inputMessage.body.observations && inputMessage.body.observations.length > 0) {
            if (typeof inputMessage.body === 'object') {
                requestOptions.body = JSON.stringify(inputMessage.body);
            }
            try {
                return rest.put(requestOptions);
            } catch (e) {
                logger.error('Error sending observations: ' + e.message, e.stack);
                return respMsg.error(e.code, e.message);
            }
        } else {
            logger.debug('There isn\'t any observation to send');
        }

        return null;
    }

};
