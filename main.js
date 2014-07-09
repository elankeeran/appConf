'use strict';

var fs          = require('fs'),
    path        = require('path'),
    nconf       = require('nconf'),
    jsonminify  = require('jsonminify'),
    pjson       = require(__dirname +'/package.json');

function Configurator(appRoot) {
    this._nconf = nconf;
    this._init(appRoot);
}

Configurator.ENVIRONMENTS = {
    development: /^dev/i,
    test       : /^test/i,
    staging    : /^stag/i,
    qa         : /^qa/i,
    production : /^prod/i
};

Configurator.isSystemRoot = function (dir) {
    return path.dirname(dir) === dir;
};


Configurator.prototype = {

    /**
     * Read the provided files and put their contents into nconf, resolving possible
     *
     * @param root
     * @param files
     */
    load: function load(root, files) {
        var file, store, env, ext;

        env = nconf.get('env:env');
        ext = '.json';

        root = this._findConfigRoot(root);
        if (!root) {
            return this;
        }

        // Include env-specific files...
        files.forEach(function (fileName) {
            file = path.join(root, fileName + '-' + env + ext);
            store = this._createJsonStore(file);

            if (store) {
                nconf.use(file, store);
            }
        }, this);

        //  Then, include base files...
        files.forEach(function (fileName) {
            file = path.join(root, fileName + ext);
            store = this._createJsonStore(file);

            if (store) {
                nconf.use(file, store);
            }
        }, this);

        return this;
    },


    done: function () {

        return this._nconf;
    },


    /**
     * Adds convenience properties for determining the application's
     * current environment (dev, test, prod, etc), configures protocol, etc.
     */
    _init: function init(appRoot) {
        var nconf, env;

        // Configure environment convenience properties.
        nconf = this._nconf;

        nconf.argv().env().use('memory');
        env = nconf.get('NODE_ENV') || 'development';
        nconf.set('NODE_ENV', env);
        nconf.set('env:env', env);
        nconf.set('env:' + env, true);
        nconf.set('appRoot', appRoot);

        Object.keys(Configurator.ENVIRONMENTS).forEach(function (key) {

            nconf.set('env:' + key, !!env.match(Configurator.ENVIRONMENTS[key]));
        });

    },


    /**
     * Find the first config directory starting at the provided root.
     * @param dir the directory from which to start searching for the config dir.
     * @returns {undefined} the config directory or undefined if not found.
     */
    _findConfigRoot: function (dir) {
        var pkg, root, exists, directories;

         directories = pjson.appConf.directories;

        if(typeof directories === 'string' && directories !== "" ){

            do {

                pkg = path.join(dir,directories);
                dir = path.dirname(dir);
                root = Configurator.isSystemRoot(dir);

            } while (!(exists = fs.existsSync(pkg)) && !root);

            return exists ? pkg : undefined;
        }else{
            console.log("Config directory not configure in 'package.json' ");
            return undefined;
        }
    },


    /**
     * Create a JSON nconf store for the given file.
     * @param file the file for which to create the JSON literal store.
     * @returns {{type: string, store: *}}
     */
    _createJsonStore: function createJsonStore(file) {
        var contents;

        if (fs.existsSync(file)) {
            // Minify the code to remove the comments
            // NOTE: using fs.readFile instead of `require`
            // so JSON parsing doesn't happen automatically.
            contents = fs.readFileSync(file, 'utf8');
            contents = JSON.minify(contents);
            if (typeof contents === 'string' && contents.length > 0) {
                try {
                    contents = JSON.parse(contents);
                } catch (e) {
                    throw new Error(e + ' at ' + file);
                }
                return {
                    type: 'literal',
                    store: contents
                };
            }
        }

        return undefined;
    }

};


exports.loadConf = function () {
    var appRoot = path.resolve('.','');

    nconf = new Configurator(appRoot)
        .load(appRoot,  pjson.appConf.files)
        .done();

    return Object.create(nconf, {
        raw: {
            get: function () {
                return Object.getPrototypeOf(this);
            }
        }
    });
};
