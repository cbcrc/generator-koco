// gulp release tasks.
'use strict';

//
// ******** Release build
//

// node modules
var _ = require('lodash');
var del = require('del');

// gulp plugins
var gulp = require('gulp');
var filenames = require('gulp-filenames');
var gutil = require('gulp-util');
var rjs = require('gulp-requirejs-bundler');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var less = require('gulp-less');
var minify = require('gulp-minify-css');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var debug = require('gulp-debug');

// local libs
var optimizer = require('builds/rjs-config');

var distFolder = 'dist';
var revManifest = 'rev-manifest.json';

gulp.task('clean', function(cb) {
    del([revManifest, distFolder], cb);
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('deploy-js', ['clean', 'environment', 'js-list', 'bower-js-list', 'html-list', 'bower-html-list'], function() {
    // Config
    var requiredJsFiles = _.map(filenames.get('js'), function(f) {
        return 'components/' + f.replace(/\\/g, '/').replace('.js', '');
    });

    var requiredBowerJsFiles = _.map(filenames.get('bowerJs'), function(f) {
        return 'bower_components/' + f.replace(/\\/g, '/').replace('.js', '');
    });

    var requiredHtmlFiles = _.map(filenames.get('html'), function(f) {
        return 'text!components/' + f.replace(/\\/g, '/');
    });

    var requireBowerHtmlFiles = _.map(filenames.get('bowerHtml'), function(f) {
        return 'text!bower_components/' + f.replace(/\\/g, '/');
    });

    return rjs(optimizer(process.env.configEnv, global.includes, requiredJsFiles.concat(requiredBowerJsFiles), requiredHtmlFiles.concat(requireBowerHtmlFiles)))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(rev())
        .pipe(gulp.dest(distFolder))
        .pipe(rev.manifest(revManifest, {
            merge: true
        }))
        .pipe(gulp.dest(''));
});

gulp.task('deploy-folders', ['clean'], function() {
    return gulp.src(global.folders, {
            base: './src'
        })
        .pipe(gulp.dest(distFolder));
});

gulp.task('deploy-css', ['clean'], function() {
    return gulp.src('./src/less/styles.less')
        .pipe(less().on('error', gutil.log))
        .pipe(minify({
            advanced: false
        }))
        .pipe(rev())
        .pipe(gulp.dest(distFolder))
        .pipe(rev.manifest(revManifest, {
            merge: true
        }))
        .pipe(gulp.dest(''));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('deploy-html', ['deploy-js', 'deploy-css'], function() {
    var manifest = gulp.src(revManifest);

    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': '<%= baseUrl %>styles.css',
            'js': '<%= baseUrl %>scripts.js'
        }))
        .pipe(revReplace({
            manifest: manifest,
            prefix: '<%= baseUrl %>'
        }))
        .pipe(gulp.dest(distFolder));
});

gulp.task('deploy', ['deploy-html', 'deploy-folders'], function(callback) {
    callback();
    gutil.log('Placed optimized files in ' + gutil.colors.magenta(distFolder + '/\n'));
});
