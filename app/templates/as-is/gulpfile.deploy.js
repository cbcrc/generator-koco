// gulp release tasks.
'use strict';

//
// ******** Release build
//

// this is necessary to expose the translation task to this gulpfile
require('gulpfile.localization');

var Server = require('koco-server').Server;

// node modules
var _ = require('lodash');
var del = require('del');
var open = require('open');

// gulp plugins
var gulp = require('gulp');
var filenames = require('gulp-filenames');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var less = require('gulp-less');
var minify = require('gulp-minify-css');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

// local libs
var rjs = require('builds/gulp-requirejs-bundler');
var rjsConfig = require('builds/rjs-config');

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

    var rjsOptions = rjsConfig(process.env.configEnv, global.includes, requiredJsFiles.concat(requiredBowerJsFiles), requiredHtmlFiles.concat(requireBowerHtmlFiles));

    return rjs(rjsOptions)
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

gulp.task('deploy-localization', ['clean', 'localization'], function() {
    return gulp.src('./src/localization/**/*.json')
        .pipe(gulp.dest(distFolder + '/localization'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('deploy-html', ['deploy-js', 'deploy-css', 'deploy-localization'], function() {
    var manifest = gulp.src(revManifest);

    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': 'styles.css',
            'js': 'scripts.js'
        }))
        .pipe(revReplace({
            manifest: manifest,
            prefix: '<%= baseUrl %>'
        }))
        .pipe(gulp.dest(distFolder));
});

gulp.task('deploy', ['deploy-html', 'deploy-folders'], function(callback) {
    gutil.log('Placed optimized files in ' + gutil.colors.magenta(distFolder + '/\n'));

    if (gutil.env.serve || gutil.env.open) {

        global.buildEnv = 'production';

        var configManager = new require('./configuration/configManager')();

        var server = new Server({
            dir: configManager.get('serverPath'),
            root: '<%= baseUrl %>'
        });

        server.listen(+configManager.get('port'), function(err) {
            if (err) {
                gutil.error(err);
            } else {
                if (gutil.env.open) {
                    gutil.log('Opening ' + gutil.colors.green('dist') + ' server URL in browser');
                    open(server.getUrl());
                } else {
                    gutil.log(gutil.colors.gray('(Run with --open to automatically open URL on startup)'));
                }
            }

            callback(); // we're done with this task for now
        });
    } else {
        callback();
    }
});
