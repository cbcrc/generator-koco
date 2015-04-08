// gulp release tasks.
'use strict';

//
// ******** Release build
//

// node modules
var _ = require('lodash');

// gulp plugins
var gulp = require('gulp');
var filenames = require('gulp-filenames');
var gutil = require('gulp-util');
var rjs = require('gulp-requirejs-bundler');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var less = require('gulp-less');
var minify = require('gulp-minify-css');

// local libs
var optimizer = require('builds/rjs-config');

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('deploy-js', ['environment', 'js-list', 'html-list'], function() {
    // Config
    var requiredJsFiles = _.map(filenames.get('js'), function(f) {
        return 'components/' + f.replace(/\\/g,'/').replace('.js', '');
    });
    var requiredHtmlFiles = _.map(filenames.get('html'), function(f) {
        return 'text!components/' + f.replace(/\\/g,'/');
    });

    return rjs(optimizer(process.env.configEnv, global.includes, requiredJsFiles, requiredHtmlFiles))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('deploy-folders', function() {
    return gulp.src(global.folders, {
            base: './src'
        })
        .pipe(gulp.dest('./dist'));
});

gulp.task('deploy-css', function() {
    return gulp.src('./src/less/styles.less')
        .pipe(less().on('error', gutil.log))
        .pipe(minify())
        .pipe(gulp.dest('./dist/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('deploy-html', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': '<%= baseUrl %>styles.css',
            'js': '<%= baseUrl %>scripts.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('deploy', ['deploy-html', 'deploy-js', 'deploy-css', 'deploy-folders'], function(callback) {
    callback();
    gutil.log('Placed optimized files in ' + gutil.colors.magenta('dist/\n'));
});
