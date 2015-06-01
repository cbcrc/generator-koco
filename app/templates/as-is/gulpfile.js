//
// Usages of this gulp for a project
//
// Command lines:
// gulp // will build the project and start a node express server on localhost (see console for port number).
// gulp --open // will open a chrome tab on the correct URL.
// gulp release // will build the project in release mode (scripts, css and html will be merged and uglified). See console for destination path.
//
// Options:
// --open // will open a chrome tab on the correct URL. Won't work when building in release mode.
// --env=[environment_name] // will merge configuration files using [environment_name] (configs.[environement_name].js).
//

'use strict';

// Source files for components
var lessFiles = [
    './src/components/**/*.less'
];
var htmlFiles = [
    './src/components/**/*.html'
];
var bowerHtmlFiles = [
    './src/bower_components/koco-*/src/**/*.html'
];
var jsFiles = [
    './src/components/**/*.js'
];
var bowerJsFiles = [
    './src/bower_components/koco-*/src/**/*-ui.js'
];

// # Custom inclusions
//
// Use this array to include any required module that:
//  1. has not been already defined in the `require.config.js` `paths` property.
//  2. is NOT in the `components/` folder.
//
global.includes = [
<% if (includeDemo) { %>
    'bower_components/rc.component.image-picker/src/rc.component.image-picker-ui',
    'bower_components/rc.component.image-picker/src/images-dialog-ui',
    'bower_components/rc.page.test-page/src/rc.page.test-page-ui'
<% } %>
];

// Add any folder to be copied over the release target. Folder hierarchy will remain.
global.folders = [
<% if (includeDemo) { %>
    './src/bower_components/rc.component.image-picker/src/images/**/*',
    './src/app/locales/**/*',
<% } %>
<% if (useVisualStudio) { %>
    './src/web.config',
<% } %>
    './src/bower_components/fontawesome/fonts/**/*'
];

// The hack (https://gist.github.com/branneman/8048520#6-the-hack)
process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

var gulp = require('gulp');
var filenames = require('gulp-filenames');

require('gulpfile.local');
require('gulpfile.deploy');
require('gulpfile.tests');
var environment = require('builds/environment-utilities');

gulp.task('environment', function(cb) {
    environment(function(env) {
        process.env.configEnv = env;
        cb();
    });
});

gulp.task('js-list', function() {
    return gulp.src(jsFiles)
        .pipe(filenames('js'));
});
gulp.task('bower-js-list', function() {
    return gulp.src(bowerJsFiles)
        .pipe(filenames('bowerJs'));
});
gulp.task('less-list', function() {
    return gulp.src(lessFiles)
        .pipe(filenames('less'));
});

gulp.task('html-list', function() {
    return gulp.src(htmlFiles)
        .pipe(filenames('html'));
});
gulp.task('bower-html-list', function() {
    return gulp.src(bowerHtmlFiles)
        .pipe(filenames('bowerHtml'));
});
