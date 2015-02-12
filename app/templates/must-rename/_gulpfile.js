/*******************************************************
Usages of this gulp for a project

Command lines:
gulp // will build the project and start a node express server on localhost (see console for port number).
gulp --open // will open a chrome tab on the correct URL.
gulp release // will build the project in release mode (scripts, css and html will be merged and uglified). See console for destination path.

Options:
--open // will open a chrome tab on the correct URL. Won't work when building in release mode.
--env=[environment_name] // will merge configuration files using [environment_name] (configs.[environement_name].js).
********************************************************/
'use strict';

var server = require('./server/server');
var configManager = require('./configuration/configManager');

// Node modules
var fs = require('fs');
var vm = require('vm');
var merge = require('deeply');
var es = require('event-stream');
var open = require('open');
var del = require('del');

// Gulp and plugins
var gulp = require('gulp');
var rjs = require('gulp-requirejs-bundler');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var gutil = require('gulp-util');

function getEnvironment() {
    var environment = 'local';

    if (gutil.env.config) {
        environment = gutil.env.config;
    } else {
        environment = gutil.env._.length > 0 ? gutil.env._[0] : 'local';

        if (environment !== 'local' &&
            environment !== 'development' &&
            environment !== 'release') {
            gutil.log(gutil.colors.yellow('Warning: No valid configuration specified, assuming ') + 
                gutil.colors.green('local') + 
                gutil.colors.yellow(' configuration. Use --env=[environment] to specify environment'));
            environment = 'local';
        }
    }

    return environment;
}

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


gulp.task('local', ['watch'], function(callback) {
    var log = gutil.log;
    var colors = gutil.colors;

    server.start(function(err, url) {
        //TODO: Handle err

        if (gutil.env.open) {
            log('Opening ' + colors.green('local') + ' server URL in browser');
            open(url);
        } else {
            log(colors.gray('(Run with --open to automatically open URL on startup)'));
        }

        callback(); // we're done with this task for now
    });
});

gulp.task('default', ['local']);

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('release-js', function () {
    // Config
    var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
    var requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
            out: 'scripts.js',
            baseUrl: './src',
            name: 'app/startup',
            paths: {
                requireLib: 'bower_components/requirejs/require',
                'configs-transforms': 'app/configs/configs.' + getEnvironment()
            },
            include: [
                'requireLib',
                'bower_components/knockout-router/src/router-ui',
                'bower_components/knockout-dialoger/src/dialoger-ui',
                'bower_components/knockout-modaler/src/modaler-ui'<% if(includeDemo) { %>,
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
                'bower_components/rc.component.image-picker/src/image-picker-ui',
                'bower_components/rc.component.image-picker/src/images-dialog-ui',
                'bower_components/rc.page.test-page/src/test-page-ui',
                'components/preload-data-page/preload-data-page-ui-activator'<% } %>
            ],
            insertRequire: ['app/startup'],
            bundles: {
                // If you want parts of the site to load on demand, remove them from the 'include' list
                // above, and group them into bundles here.
                // 'bundle-name': [ 'some/module', 'another/module' ],
                // 'another-bundle-name': [ 'yet-another-module' ]
            }
        });

    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest('./dist/'));
});


gulp.task('release-images', function () {
<% if(includeDemo) { %>
    var images = gulp.src('./src/bower_components/rc.component.image-picker/src/images/**/*');
    
    return images.pipe(gulp.dest('./dist/bower_components/rc.component.image-picker/src/images/'));
<% } %>
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
    gutil.log('Placed optimized files in ' + gutil.colors.magenta('dist/\n'));
});

