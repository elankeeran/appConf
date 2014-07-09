<img src='https://travis-ci.org/elankeeran/appConf.svg?branch=master'/>

appConf
=======

Application Environment Configure


Setup
======

```
var appConf = require('appconf').loadConf();
```
```
console.log(appConf.get('port'), "port");
```
And do the following changes in <strong>package.json</strong>
```
"appConf": {
        "directories": "config", // directory name where your configure app json file are available
        "files": [
            "app"  // mention array of files to read
        ]
    }
``` 
    
