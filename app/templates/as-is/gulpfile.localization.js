/*
    Gulpfile for building localization
*/

'use strict';

// node modules
var _ = require('lodash');

// gulp plugins
var gulp = require('gulp');
var data = require('gulp-data');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

// this variable will hold all localization extracted from ./src/components/**/localization/*.json & ./src/bower_components/koco-*/localization/*.json files
var localization = {};

//helper function to create a stream
function createFileStream(filename, string) {
    var src = require('stream').Readable({
        objectMode: true
    });

    src._read = function() {
        this.push(new gutil.File({
            cwd: '',
            base: './',
            path: filename,
            contents: new Buffer(string)
        }));

        this.push(null);
    };

    return src;
}

function getComponentNameFromPath(path, lng) {
    var myRegexp = new RegExp('\\\\([^\\\\]*)\\\\localization\\\\' + lng + '\\.json$', 'i');
    var match = myRegexp.exec(path);
    var result = null;

    if (match && match.length > 1) {
        result = match[1];
    }

    return result;
}

// this task set the localization variable with the content of all components' localization
gulp.task('loadLocalization', function() {
    return gulp.src([
            './src/components/**/localization/*.json',
            './src/bower_components/koco-*/localization/*.json'
        ])
        .pipe(data(function(file) {
            return require(file.path);
        }))
        .pipe(through.obj(function(file, enc, cb) {
            var fileExtension = path.extname(file.path);
            var lng = path.basename(file.path, fileExtension); //filename is lng
            var componentName = getComponentNameFromPath(file.path, lng);

            if (!Object.prototype.hasOwnProperty.call(localization, lng)) {
                localization[lng] = {};
            }

            localization[lng][componentName] = file.data;

            cb(null, file);
        }));
});

// this task depends loadLocalization. It will start only after loadLocalization has finished running
gulp.task('localization', ['loadLocalization'], function(cb) {
    _.each(localization, function(content, lng) {
        createFileStream(lng + '.json', JSON.stringify(localization[lng]))
            .pipe(gulp.dest('./src/localization/components/'));
    });

    cb();
});
