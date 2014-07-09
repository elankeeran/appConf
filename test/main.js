'use strict';

var conf = require('../main.js').loadConf();
var assert  =   require('chai').assert;


describe('Application Environment Configure: ', function () {

    //onlineAvailability method to test commerce api
    it('Should available port number from environment file', function (done) {
        assert.equal(conf.get('port') , '3000');
        done();
    });

    it('Should throws Undefined for app-name from environment file', function (done) {
        assert.isUndefined(conf.get('app-name'));
        done();
    });

    it('Should return default enviornment as development', function (done) {
        assert.equal(conf.get('env:env'), 'development');
        done();
    });

    it('Should return user define enviornment name', function (done) {

        conf.set('env:env', 'stage');

        assert.equal(conf.get('env:env'), 'stage');
        done();
    });

    it('Should return custom object', function (done) {

        conf.set('custom', {'company' : 'mycompany'});

        assert.isObject(conf.get('custom'), 'object');
        done();
    });
});