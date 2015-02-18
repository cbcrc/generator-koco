'use strict';

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var gutil = require('gulp-util');

function Server() {
    this.expressApp = express();

    //https://www.npmjs.com/package/morgan
    this.expressApp.use(morgan('dev'));

    this.expressApp.use(express.static('./'));
}

Server.prototype.start = function(callback) {
    var server = this.expressApp.listen(1338, function() {
        var serverAddress = server.address();
        var serverHost = serverAddress.address === '0.0.0.0' || serverAddress.address === '::' ? 'localhost' : serverAddress.address;
        var url = 'http://' + serverHost + ':' + serverAddress.port + '/';

        gutil.log('Started ' + gutil.colors.green('dev') + ' server at ' + gutil.colors.cyan(url));

        callback(null, url);
    });
};

module.exports = exports = new Server();
