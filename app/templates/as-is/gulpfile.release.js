// gulp release tasks.
'use strict';

// # Custom inclusions
//
// Use this array to include any required module that:
//  1. has not been already defined in the `require.config.js` `paths` property.
//  2. is NOT in the `components/` folder.
//
var includes = [
<% if (includeDemo) { %>
    'bower_components/rc.component.image-picker/src/rc.component.image-picker-ui',
    'bower_components/rc.component.image-picker/src/images-dialog-ui',
    'bower_components/rc.page.test-page/src/rc.page.test-page-ui'
<% } %>
];

// Add any folder to be copied over the release target. Folder hierarchy will remain.
var folders = [
<% if (includeDemo) { %>
    './src/bower_components/rc.component.image-picker/src/images/**/*',
    './src/app/locales/**/*',
<% } %>
<% if (useVisualStudio) { %>
    './src/web.config',
<% } %>
    './src/bower_components/fontawesome/fonts/**/*'
];

//
// ******** Release build
//

// node modules
var fs = require('fs');
var vm = require('vm');
var _ = require('lodash');
var merge = require('deeply');

// gulp plugins
var gulp = require('gulp');
var filenames = require('gulp-filenames');
var gutil = require('gulp-util');
var rjs = require('gulp-requirejs-bundler');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var less = require('gulp-less');
var minify = require('gulp-minify-css');

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

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('release-js', ['js-list', 'html-list'], function() {
    // Config
    var jsFiles = _.map(filenames.get('js'), function(f) {
        return 'components/' + f.replace(/\\/g,"/").replace('.js', '');
    });
    var htmlFiles = _.map(filenames.get('html'), function(f) {
        return 'text!components/' + f.replace(/\\/g,"/");
    });

    var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');

    // removes modules already in the paths configuration.
    var values = _.map(Object.keys(requireJsRuntimeConfig.paths), function(k) {
        return requireJsRuntimeConfig.paths[k];
    });

    _.remove(jsFiles, function(f) {
        return _.includes(values, f);
    });

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
            'bower_components/knockout-modaler/src/modaler-ui',
        ].concat(includes, jsFiles, htmlFiles),
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

gulp.task('js-list', function() {
    return gulp.src('./src/components/**/*.js')
        .pipe(filenames('js'));
});

gulp.task('less-list', function() {
    return gulp.src('./src/components/**/*.less')
        .pipe(filenames('less'));
});

gulp.task('html-list', function() {
    return gulp.src('./src/components/**/*.html')
        .pipe(filenames('html'));
});

gulp.task('release-folders', function() {
    return gulp.src(folders, {
            base: './src'
        })
        .pipe(gulp.dest('./dist'));
});

gulp.task('release-css', function() {
    return gulp.src('./src/less/styles.less')
        .pipe(less().on('error', gutil.log))
        .pipe(minify())
        .pipe(gulp.dest('./dist/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('release-html', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': '<%= baseUrl %>styles.css',
            'js': '<%= baseUrl %>scripts.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('release', ['release-html', 'release-js', 'release-css', 'release-folders'], function(callback) {
    callback();
    gutil.log('Placed optimized files in ' + gutil.colors.magenta('dist/\n'));
});
