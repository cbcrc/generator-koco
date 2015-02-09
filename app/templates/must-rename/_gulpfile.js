'use strict';

var server = require('./server/server');
var configManager = require('./configuration/configManager');

// Node modules
var fs = require('fs');
var vm = require('vm');
var merge = require('deeply');
var chalk = require('chalk');
var es = require('event-stream');
var open = require('open');
var del = require('del');

// Gulp and plugins
var gulp = require('gulp');
var rjs = require('gulp-requirejs-bundler');
var concat = require('gulp-concat'); 
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var gutil = require('gulp-util');

gulp.task('less', function() {
    gulp.src('./src/less/styles.less')
        .pipe(less({
            sourceMap: configManager.get('sourceMap')
        }).on('error', gutil.log))
        .pipe(gulp.dest('./src/css'))
        .pipe(livereload());
});

gulp.task('js', function() {
    gulp.src(['./src/**/*.js'])
        // .pipe(plumber())
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))
        //     .pipe(plumber.stop())
        .pipe(livereload());
});

gulp.task('html', function() {
    gulp.src(['./src/**/*.html'])
        // .pipe(plumber())
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))
        //     .pipe(plumber.stop())
        .pipe(livereload());
});

gulp.task('watch', ['less', 'js'], function() {
    gulp.watch(['./src/**/*.less'], ['less']);
    gulp.watch(['./src/**/*.js'], ['js']);
    gulp.watch(['./src/**/*.html'], ['html']);
    // var server = livereload();

    // gulp.watch('./src/**/*.html').on('change', function(file) {
    //     server.changed(file.path);
    // });
});


gulp.task('dev', ['watch'], function(callback) {
    var log = gutil.log;
    var colors = gutil.colors;

    server.start(function(err, url) {
        //TODO: Handle err

        if (gutil.env.open) {
            log('Opening dev server URL in browser');
            open(url);
        } else {
            log(colors.gray('(Run with --open to automatically open URL on startup)'));
        }

        callback(); // we're done with this task for now
    });
});

gulp.task('default', ['dev']);


// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
var requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './src',
        name: 'app/startup',
        paths: {
            requireLib: 'bower_components/requirejs/require'/*,
            configs: 'app/configs/configs.release'*/
        },
        include: [
            'requireLib',
            //'configs',
            'text!components/about-page/about-page.html',
            'components/blocking-dialog/blocking-dialog-ui',
            'components/home-page/home-page-ui',
            'components/inception-one-dialog/inception-one-dialog-ui',
            'components/inception-two-dialog/inception-two-dialog-ui',
            'text!components/loading-modal/loading-modal.html',
            'components/nav-bar/nav-bar-ui',
            'text!components/not-found-page/not-found-page.html',
            'components/preload-data-page/preload-data-page-ui',
            'components/test-dialog/test-dialog-ui',
            'components/test-modal/test-modal-ui',
            'bower_components/ko-router/src/router-ui',
            'bower_components/rc.component.dialoger/src/dialoger-ui',
            'bower_components/rc.component.image-picker/src/image-picker-ui',
            'bower_components/rc.component.image-picker/src/images-dialog-ui',
            'bower_components/rc.component.modaler/src/modaler-ui',
            'bower_components/rc.dialog.test-dialog/src/test-dialog-ui',
            'bower_components/rc.page.test-page/src/test-page-ui',
            'components/preload-data-page/preload-data-page-ui-activator'
        ],
        insertRequire: ['app/startup'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
            // 'bundle-name': [ 'some/module', 'another/module' ],
            // 'another-bundle-name': [ 'yet-another-module' ]
        }
    });

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('release-js', function () {
    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./dist/'));
});


gulp.task('release-images', function () {
    var images = gulp.src('./src/bower_components/rc.component.image-picker/src/images/**/*');
    
    return images.pipe(gulp.dest('./dist/bower_components/rc.component.image-picker/src/images/'));
});


gulp.task('release-fonts', function () {
    var fonts = gulp.src('./src/bower_components/fontawesome/fonts/**/*');
    
    return fonts.pipe(gulp.dest('./dist/bower_components/fontawesome/fonts/'));
});



// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
// gulp.task('css', function () {
//     var bowerCss = gulp.src('src/bower_modules/components-bootstrap/css/bootstrap.min.css')
//             .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
//         appCss = gulp.src('src/css/*.css'),
//         combinedCss = es.concat(bowerCss, appCss).pipe(concat('css.css')),
//         fontFiles = gulp.src('./src/bower_modules/components-bootstrap/fonts/*', { base: './src/bower_modules/components-bootstrap/' });
//     return es.concat(combinedCss, fontFiles)
//         .pipe(gulp.dest('./dist/'));
// });

gulp.task('release-css', function() {
    return gulp.src('./src/less/styles.less')
        .pipe(less().on('error', gutil.log))
        .pipe(gulp.dest('./dist/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('release-html', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': 'styles.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

// Removes all files from ./dist/
// gulp.task('clean', function() {
//     return gulp.src('./dist/**/*', { read: false })
//         .pipe(clean());
// });

gulp.task('release', ['release-html', 'release-js', 'release-css', 'release-images', 'release-fonts'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});

