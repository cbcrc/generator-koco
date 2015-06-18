// gulp tests tasks
'use strict';

// node modules
var open = require('open');

// gulp plugins
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
var gutil = require('gulp-util');

// local libs
var testsServer = require('server/tests-server');

gulp.task('tests_js', function() {
    gulp.src(['./tests/**/*.js'])
        .pipe(livereload());
});


gulp.task('watch_tests', ['less', 'js'], function() {
    gulp.watch(['./src/**/*.less'], ['less']);
    gulp.watch(['./src/**/*.js'], ['js']);
    gulp.watch(['./src/**/*.html'], ['html']);
    gulp.watch(['./tests/**/*.js'], ['tests_js']);
});

gulp.task('tests', ['watch_tests'], function(callback) {
    var log = gutil.log;
    var colors = gutil.colors;


    //TODO: Utiliser koco-server
    testsServer.start(function(err, url) {
        //TODO: Handle err

        if (gutil.env.open) {
            log('Opening ' + colors.green('local') + ' server URL in browser');
            open(url + 'tests/index.html');
        } else {
            log(colors.gray('(Run with --open to automatically open URL on startup)'));
        }

        callback(); // we're done with this task for now
    });
});
