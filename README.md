[![NPM version](https://badge.fury.io/js/appconf.svg)](http://badge.fury.io/js/appconf)

[![NPM](https://nodei.co/npm/appconf.png)](https://nodei.co/npm/appconf/)

appConf
=======

Application Environment Configure

Why : 
To Read any environment specific configuration from the application.

Features :
If you have not set the environment, by default "development" specific configurations will be loaded into the memory.
Set the environment using NODE_ENV for specific environments like qa, production etc.
```
    These are the environments supported:
    development,
    test,
    staging,
    qa,
    production
```
How To Configure:
======

Add the directory path and file information in application <strong>package.json</strong>
```
"appConf": {
        "directories": "config", // directory name which has all the configuration files
        "files": [
            "app"  // array of files
        ]
    }
``` 

How To Use:
======
``` 
var appConf = require('appconf').loadConf();
```
How get value appConf
```
console.log(appConf.get('port'), "->port");
//3000 ->port
```
How set value appConf
```
appConf.set("host", "localhost");
console.log(appConf.get("host"), "->host");
//localhost ->host
```

    
