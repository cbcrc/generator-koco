'use strict';

var gutil = require('gulp-util');
var fs = require('fs');

function currentEnvironment(cb) {
    var environment = gutil.env.env || 'local';

    fs.exists('./src/app/configs/configs.' + environment + '.js', function(exists) {
        if (!exists) {
            gutil.log(gutil.colors.yellow('Warning: No valid configuration specified, assuming ') +
                gutil.colors.green('local') +
                gutil.colors.yellow(' configuration. Use --env=[environment] to specify environment'));

            environment = 'local';
        }

        gutil.log('Using ' + gutil.colors.green(environment) + ' configuration.');

        cb(environment);
    });
}

module.exports = currentEnvironment;
