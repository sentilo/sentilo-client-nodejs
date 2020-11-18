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
const sentilo = require('./sentilo');
// Initialize sentilo
sentilo.init();

// Checks if the sensor exists
const existingSensor = {
    provider: 'testApp_provider',
    sensor: 'TestSensor'
};

console.log(sentilo.existsSensorInCatalog(existingSensor));

// Creates a new sensor
const newSensor = {
    sensor: 'TestNewSensor',
    description: 'TestNewSensorDescription',
    sensorType: 'anemometer',
    sensorDataType: 'JSON',
    component: 'TestGenericSensor',
}

console.log('Creating sensor', newSensor);
console.log(sentilo.createSensor(newSensor));

// Send observation to the sensor
const sensorObservation = 'TEST';

console.log('Publishing sensor observation to sensor ', newSensor.sensor);
sentilo.publishObservations(sensorObservation, newSensor);

// Creates a new alert
const newAlert = {
    alerts: [
        {
            id: 'TEST_ALERT_001',
            name: 'TEST_ALERT_001',
            description: 'External test alert 001',
            type: 'EXTERNAL'
        }
    ]
}
console.log('Register new alert', newAlert);
sentilo.createAlerts(newAlert);

// Publish new alarm associated to the alarm that is registered later
const message = {message: "This is a test alarm over the TEST_ALERT_001"};

sentilo.publishAlarm(newAlert.alerts[0].id, message);




