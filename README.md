# Sentilo client library for Node.js

The Sentilo Node.js client library code that brings some Sentilo operations that you can include in your own code.

## Install

You will need to have installed **Node.js** and **NPM** in your system in order to run your code.

- Deploy the library content into your work directory
- You'll see an structure like this:
<pre>
/work_directory
     |
     |----- /src
     |        |----- /utils
     |        |        |----- SentiloLogs.js
     |        |        |----- SentiloResponse.js
     |        |        |----- SentiloRestClient.js
     |        |        '----- SentiloUtils.js
     |        |
     |        |----- AlarmServiceOperations.js
     |        |----- CatalogServiceOperations.js
     |        |----- DataServiceOperations.js
     |        |----- ServicesConfiguration.js
     |        |----- SubscriptionServiceOperations.js
     |
     |----- /package.json
     |----- /README.ME
     '----- /sentilo.js
</pre>
- In a bash command line, run:
<pre>$ npm update</pre>
- You'll see a new directory into the working directory. It's the **node_modules** that contains the library external dependencies: 
<pre>
/work_directory
     |
     |----- /node_modules
              |----- /restify
              '----- /sync-request
</pre>

Afther that, we are ready to start.


## Usage

Before use the library you must configure some parameters that informs where's your Sentilo instance and the necessary credentials.

You must edit the file **/src/ServicesConfiguration.js** to inform them:
<pre>
var defaultServicesConfig = {
	host : 'YOUR-SENTILO-INSTANCE-HOST-IP',
	port : 'YOUR-SENTILO-INSTANCE-HOST-PORT',
	headers : {
		identity-key : 'YOUR-SENTILO-INSTANCE-DEFAULT-IDENTITY-KEY'
	}
};

var defaultServicesValues = {
	tokenId : 'YOUR-SENTILO-INSTANCE-IDENTITY-KEY',
	providerTokenId : 'YOUR-SENTILO-INSTANCE-PROVIDER-IDENTITY-KEY',
	provider : 'samples-provider',
	component : 'sample-component-nodejs',
	sensor : 'sample-sensor-nodejs'
};
</pre>

Provide necessary information about your Sentilo instance:

* 'YOUR-SENTILO-INSTANCE-HOST-IP' : your Sentilo's host ip
* 'YOUR-SENTILO-INSTANCE-HOST-PORT' : your Sentilo's host port
* 'YOUR-SENTILO-INSTANCE-DEFAULT-IDENTITY-KEY' : your Sentilo's identity key
* 'YOUR-SENTILO-INSTANCE-IDENTITY-KEY' : the same of above
* 'YOUR-SENTILO-INSTANCE-PROVIDER-IDENTITY-KEY' : your provider's identity key

Note that you can leave these parameters without changing and override them with the initialization options in your own code:
<pre>
//Overriden services options...
var samplesOptions = {
	host : 'YOUR-SENTILO-INSTANCE-HOST-IP',
	port : 'YOUR-SENTILO-INSTANCE-HOST-PORT',
	headers : {
		identity-key : 'YOUR-SENTILO-INSTANCE-DEFAULT-IDENTITY-KEY'
	}
	tokenId : 'YOUR-SENTILO-INSTANCE-IDENTITY-KEY',
	providerTokenId : 'YOUR-SENTILO-INSTANCE-PROVIDER-IDENTITY-KEY',
	
	...	
};

// Include some Sentilo operations from the Nodejs client library
var sentilo = require('./sentilo.js');

// Init Sentilo services...
sentilo.init(samplesOptions);
</pre>

Your library is ready to run now.
