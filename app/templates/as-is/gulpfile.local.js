// gulp dev tasks
'use strict';

// this is necessary to expose the translation task to this gulpfile
require('gulpfile.localization');

// node modules
var open = require('open');

// gulp plugins
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');
var Server = require('koco-server').Server;
var chokidar = require('chokidar');
var fs = require('fs-extra');
var path = require('path');
var del = require('del');
var babel = require('babel-core');
var babelHelper = require('./configuration/babel-config');

var fromDir = 'src';
var toDir = 'dev';
var destFilePath;

gulp.task('clean', function(cb) {
    del([toDir], cb);
});


gulp.task('less', function() {
    gulp.src('./src/less/styles.less')
        .pipe(sourcemaps.init())
        .pipe(less().on('error', gutil.log))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/css'))
        .pipe(livereload());
});

gulp.task('js', function() {
    return gulp.src(['./src/**/*.js'])
        .pipe(livereload());
});

gulp.task('html', function() {
    gulp.src(['./src/**/*.html'])
        .pipe(livereload());
});

gulp.task('watch', ['less', 'js', 'html', 'localization'], function() {
    gulp.watch(['./src/**/*.less'], ['less']);
    gulp.watch(['./src/**/*.js'], ['js']);
    gulp.watch(['./src/**/*.html'], ['html']);
    gulp.watch([
        './src/components/**/localization/**/*.json',
        './src/bower_components/koco-*/localization/**/*.json'
    ], ['localization']);
});

var compareMtime = function(src, target) {
    var isNewer;
    isNewer = true;
    if (fs.existsSync(target)) {
        isNewer = fs.statSync(src).mtime > fs.statSync(target).mtime;
    }
    return isNewer;
};

var getDestFilePath = function(srcFile) {
    return path.join(toDir, path.relative(fromDir, srcFile));
};

var doIt = function(srcFilePath, destFilePath) {
    //todo: meilleur filtre!
    if (babelHelper.mustBeBabelified(srcFilePath)) {
        gutil.log(gutil.colors.red('doingIt: BABEL!'));
        var srcFileContent = fs.readFileSync(srcFilePath).toString();
        var babelifiedContent = babel.transform(srcFileContent).code;
        fs.writeFileSync(destFilePath, babelifiedContent);
    } else {
        fs.copySync(srcFilePath, destFilePath);
    }
};

function startFolderSynchronization() {
    var watcher = chokidar.watch('./src', {
            ignored: /[\/\\]\./
        })
        /*.on('all', function(event, path) {
                console.log(event, path);
            })*/
    ;

    var log = console.log.bind(console);



    watcher
        .on('add', function(srcFilePath) {
            //log('File', srcFilePath, 'has been added');

            destFilePath = getDestFilePath(srcFilePath);

            if (!fs.existsSync(destFilePath)) {
                gutil.log(gutil.colors.green('add: ' + srcFilePath + ' > ' + destFilePath));
                doIt(srcFilePath, destFilePath);
            }
        })
        .on('change', function(srcFilePath) {
            //log('File', srcFilePath, 'has been changed');

            destFilePath = getDestFilePath(srcFilePath);

            if (compareMtime(srcFilePath, destFilePath)) {
                gutil.log(gutil.colors.green('change: ' + srcFilePath + ' > ' + destFilePath));
                doIt(srcFilePath, destFilePath);
            }
        })
        .on('unlink', function(srcFilePath) {
            //log('File', srcFilePath, 'has been removed');

            destFilePath = getDestFilePath(srcFilePath);

            if (fs.existsSync(destFilePath)) {
                gutil.log(gutil.colors.green('delete: ' + destFilePath));
                fs.removeSync(destFilePath);
            }
        })
        // More events.
        .on('addDir', function(srcFilePath) {
            //log('Directory', srcFilePath, 'has been added');

            destFilePath = getDestFilePath(srcFilePath);

            if (!fs.existsSync(destFilePath)) {
                gutil.log(gutil.colors.green('mkdir: ' + destFilePath));
                fs.mkdirSync(destFilePath);
            }
        })
        .on('unlinkDir', function(srcFilePath) {
            //log('Directory', srcFilePath, 'has been removed');

            destFilePath = getDestFilePath(srcFilePath);

            if (fs.existsSync(destFilePath)) {
                gutil.log(gutil.colors.green('rmdir: ' + destFilePath));
                return fs.removeSync(destFilePath, {
                    'force': true
                });
            }
        })
        .on('error', function(error) {
            log('Error happened', error);
        })
        /*.on('ready', function() {
            log('Initial scan complete. Ready for changes.');
        })
        .on('raw', function(event, srcFilePath, details) {
            log('Raw event info:', event, srcFilePath, details);
        })*/
    ;
}

gulp.task('local', ['watch', 'clean'], function(callback) {
    fs.copySync(fromDir, toDir);
    startFolderSynchronization();
    var log = gutil.log;
    var colors = gutil.colors;

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
                log('Opening ' + colors.green('local') + ' server URL in browser');
                open(server.getUrl());
            } else {
                log(colors.gray('(Run with --open to automatically open URL on startup)'));
            }
        }

        callback(); // we're done with this task for now
    });
});

gulp.task('default', ['local']);
