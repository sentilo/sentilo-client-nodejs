# Sentilo client library for Node.js

The Sentilo Javascript/Node.js client library code that brings some Sentilo operations that you can include in your own code.

## Installation

To install this library via npm, use: 
<pre>
npm install git+https://github.com/sentilo/sentilo-client-nodejs.git#master
</pre>

Alternatively, use this dependency in your package.json:

<pre>
	"dependencies": {
		"sentilo-client-nodejs": "git+https://github.com/sentilo/sentilo-client-nodejs.git#master"
	}
</pre>


## Sentilo client configuration options

| Option               | Description                                               | Example value           |
|----------------------|-----------------------------------------------------------|-------------------------|
| apiUrl               | URL of your Sentilo/Thingtia instance                     | `http://localhost:8081` |
| headers.identity_key | token of your provider or application                     | `f7a702ad6....`         |
| provider             | Provider id                                               | `samples-provider`      |
| sensor               | Sensor Id                                                 | `sample-sensor-nodejs`  |
| component            | Component Id, Only used in catalog operations.            | `sample-component`      |
| componentType        | Type of the component. Only used in catalog operations.   | `generic`               |
| sensorDataType       | Data type of the sensor. Only used in catalog operations. | `TEXT`                  |
| sensorType           | Ty of the sensor. Only used in catalog operations.        | `status`                |
| sensorUnit           | Unit of sensor, only used in catalog operations.          | `kW`                    |
| sensorLocation       | Lat/lon values separated with blank space. Optional       | `41.387015 2.170047`    |

## Sentilo client services

| Method                  | Description                                       |
|-------------------------|---------------------------------------------------|
| `existsSensorInCatalog` | Searches a sensor in the catalog. Returns boolean |
| `createSensor`          | Creates a sensor in catalog.                      |
| `publishObservations`   | Publishes observations.                           |
| `createAlerts`          | Creates multiple alerts                           |
| `publishAlarm`          | Publishes Alarm                                   |
| `subscribeOrder`        | Subscribes to a order                             |
| `subscribeOrderToAll`   | Subscribes to all sensor orders from a provider   |


_Note: .*Operations.js files expose more API services. Also _

You might as well check Sentilo Node-RED library on [Github](https://github.com/sentilo/node-red-contrib-sentilo)
and on [Node-RED](https://flows.nodered.org/node/node-red-contrib-sentilo) 

Note that the API documentation is at https://sentilo.readthedocs.io/en/latest/api_docs.html. 

### Example Usage

```javascript
const sentilo = require('sentilo');

// Initialize sentilo
const options = {
    apiUrl : 'http://localhost:8081',
    headers : {
           identity_key : 'f7a702ad6b701...'
    },
    provider : 'testApp_provider',
    sensorLocation : '41.387015 2.170047'
};
sentilo.init();

 
// Checks if the sensor exists
const existingSensor = {
     provider: 'testApp_provider',
     sensor: 'TestSensor'
};
sentilo.existsSensorInCatalog(existingSensor);
 
 
// Creates a new sensor
const newSensor = {
     sensor: 'TestNewSensor',
     description: 'TestNewSensorDescription',
     sensorType: 'anemometer',
     sensorDataType: 'JSON',
     component: 'TestGenericSensor',
     componentType : 'generic',
     sensorUnit : 'T',
     sensorLocation : '41.387015 2.170047'
     
}
sentilo.createSensor(newSensor);
 
 
// Send observation to the sensor
const sensorObservation = 'TEST';
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
sentilo.createAlerts(newAlert);
 

// Publish new alarm associated to the alarm that is registered later
const message = {message: "This is a test alarm over the TEST_ALERT_001"};
let alarmId = newAlert.alerts[0].id;
sentilo.publishAlarm(alarmId, message);
 

// Example of how to subscribe to a sensor order
const endpoint = {endpoint:"http://my-test-server/sentilo/sensor/data/endpoint"};
sentilo.subscribeOrder(endpoint);
 

// Example of how to subscribe to all orders
sentilo.subscribeOrderToAll(endpoint);
```

You might as well check your example for Raspberry Pi and NodeJS: https://github.com/sentilo/sentilo-client-sample-nodejs