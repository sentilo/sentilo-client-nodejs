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
module.exports = {

    mergeOptions : function(obj1, obj2) {
        var obj3 = {};
        if (obj1) {
            for ( var attrname in obj1) {
                obj3[attrname] = obj1[attrname];
            }
        }
        if (obj2) {
            for ( var attrname in obj2) {
                obj3[attrname] = obj2[attrname];
            }
        }
        return obj3;
    },

    zeroFill : function(number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + ""; // always return a string
    },

    blankFill : function(str, width) {
        width -= str.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(str) ? 2 : 1)).join(' ') + str;
        }
        return str + ""; // always return a string
    },
    isResponseOK: function (response) {
        return (response && response.code && response.code === 200);
    },

    isResponseNOK: function (response) {
        return (response && response.code && response.code !== 200);
    }
};
