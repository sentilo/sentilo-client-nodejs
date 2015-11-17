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
var utils = require('./SentiloUtils');

var options = {
    className : 'Sentilo',
    enableLogs : true,
    enableDebug : false,
    enableInfo : true,
    enableWarn : true,
    enableError : true,
    enableFatal : true
};

function logMessage(type, message) {

    var myDate = new Date();
    var dateStr = utils.zeroFill(myDate.getDate(), 2) + "/" + utils.zeroFill((myDate.getMonth() + 1), 2) + "/" + myDate.getFullYear() + ' ' + utils.zeroFill(myDate.getHours(), 2) + ":" + utils.zeroFill(myDate.getMinutes(), 2) + ":" + utils.zeroFill(myDate.getSeconds(), 2) + ":" + utils.zeroFill(myDate.getMilliseconds(), 3);

    if (options.enableLogs) {
        if (typeof message === 'object') {
            if ('ERROR' === type) {
                console.error(dateStr + ' [' + options.className + '] [' + utils.blankFill(type, 5) + '] ');
                console.error(message);
            } else {
                console.log(dateStr + ' [' + options.className + '] [' + utils.blankFill(type, 5) + '] ');
                console.log(message);
            }

        } else {
            if ('ERROR' === type) {
                console.error(dateStr + ' [' + options.className + '] [' + utils.blankFill(type, 5) + '] :: ' + message);
            } else {
                console.log(dateStr + ' [' + options.className + '] [' + utils.blankFill(type, 5) + '] :: ' + message);
            }
        }
    }
}

module.exports = {

    init : function(logsOptions) {
        if (logsOptions) {
            options = utils.mergeOptions(options, logsOptions);
        }
    },

    debug : function(message) {
        if (options.enableDebug) {
            logMessage('DEBUG', message);
        }
    },

    info : function(message) {
        if (options.enableInfo) {
            logMessage('INFO', message);
        }
    },

    warn : function(message) {
        if (options.enableWarn) {
            logMessage('WARN', message);
        }
    },

    error : function(message, stack) {
        if (options.enableError) {
            if (stack) {
                logMessage('ERROR', message + '\n' + stack);
            } else {
                logMessage('ERROR', message);
            }
        }
    },

    fatal : function(message) {
        if (options.enableFatal) {
            logMessage('FATAL', message);
        }
    }

};
