'use strict';

var configManager = require('./../configuration/configManager');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var gutil = require('gulp-util');

function Server() {
    this.expressApp = express();

    //https://www.npmjs.com/package/morgan
    this.expressApp.use(morgan('dev'));


    //TODO: Valeurs à partir des configs
    //TODO: return static 404 html page (with middleware - voir apiServerSetup)
    //TODO: return static 500 html page (with middleware - voir apiServerSetup)

    // this.expressApp.get('/index.html', function (req, res) {
    //     //Trap by middleware to return static 404 html page
    //     res.status(404);
    // });

    this.expressApp.use(function(req, res, next) {
        if (path.extname(req.path).length > 0) {
            // normal static file request
            next();
        } else {
            // should force return `index.html` for angular.js
            req.url = '/index.html';
            next();
        }
    });

    //TODO: https://github.com/jonathandelgado/SublimeTodoReview (1)
    //TODO: Ici on sert le contenu du site!? (meme serveur pour l'api et le site?.. pourquoi pas?) (2) @patate
    this.expressApp.use(express.static('./src'));
}

Server.prototype.start = function(callback) {
    var server = this.expressApp.listen(configManager.get('port'), function() {
        var serverAddress = server.address();
        var serverHost = serverAddress.address === '0.0.0.0' ? 'localhost' : serverAddress.address;
        var url = 'http://' + serverHost + ':' + serverAddress.port + '/';

        gutil.log('Started ' + gutil.colors.green('dev') + ' server at ' + gutil.colors.cyan(url));

        callback(null, url);
    });
};

module.exports = exports = new Server();
