// gulp dev tasks
'use strict';

// this is necessary to expose the translation task to this gulpfile
require('gulpfile.localization');

// node modules
var open = require('open');
var Server = require('koco-server').Server;
var cp = require('child_process');
var configManager = new require('./configuration/configManager')();


// gulp plugins
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');
var gulpSequence = require('gulp-sequence');


var serverPath = configManager.get('serverPath');

gulp.task('less', function() {
    gulp.src(serverPath + '/less/styles.less')
        .pipe(sourcemaps.init())
        .pipe(less().on('error', gutil.log))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(serverPath + '/css'))
        .pipe(livereload());
});

gulp.task('js', function() {
    return gulp.src([serverPath + '/**/*.js'])
        .pipe(livereload());
});

gulp.task('html', function() {
    gulp.src([serverPath + '/**/*.html'])
        .pipe(livereload());
});

gulp.task('watching', ['less', 'js', 'html', 'localization'], function() {
    livereload.listen();
    gulp.watch([serverPath + '/**/*.less'], ['less']);
    gulp.watch([serverPath + '/**/*.js'], ['js']);
    gulp.watch([serverPath + '/**/*.html'], ['html']);
    gulp.watch([
        serverPath + '/components/**/localization/**/*.json',
        serverPath + '/bower_components/koco-*/localization/**/*.json'
    ], ['localization']);
});

gulp.task('babel', function(done) {
  var babelSyncFolder = cp.fork('./babel-sync-folders');
    babelSyncFolder.on('message', function(m) {
        if(m === 'ready'){
            done();
        }
    });

    babelSyncFolder.send('start');
});

gulp.task('watch', gulpSequence('babel', 'watching'));

gulp.task('local', ['watch'], function(done) {

    var server = new Server({
        dir: serverPath,
        root: '/'
    });

    server.listen(+configManager.get('port'), function(err) {
        if (err) {
            gutil.error(err);
        } else {
            if (gutil.env.open) {
                gutil.log('Opening ' + gutil.colors.green('local') + ' server URL in browser');
                open(server.getUrl());
            } else {
                gutil.log(gutil.colors.gray('(Run with --open to automatically open URL on startup)'));
            }
        }

        done(); // we're done with this task for now
    });
});

gulp.task('default', ['local']);
