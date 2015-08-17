'use strict';
// node modules
var fs = require('fs');
var vm = require('vm');
var _ = require('lodash');
var merge = require('deeply');
var babel = require('babel-core');
var babelHelper = require('./../configuration/babel-config');
var path = require('path');

// local libs

function rjsConfig(environment, includes, jsFiles, htmlFiles) {
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
            'configs-transforms': 'app/configs/configs.' + environment
        },
        include: [
            'requireLib'
        ].concat(includes, jsFiles, htmlFiles),
        insertRequire: ['app/startup'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
            // 'bundle-name': [ 'some/module', 'another/module' ],
            // 'another-bundle-name': [ 'yet-another-module' ]
        },
        onBuildRead: function(moduleName, filePath, contents) {
            //todo: seulement certains fichiers (o doit exlcure jquery, bootstrap, knockout, etc...
            //seulement avec path koco dans bower-components + fichiers dans app & components)

            var relativeFilePath =  filePath.replace(path.resolve('./src').replace(/\\/g,'/') + '/', '');

            if (contents && babelHelper.mustBeBabelified(relativeFilePath)) {
                return babel.transform(contents).code;
            }

            return contents;

        }
    });

    return requireJsOptimizerConfig;
}

module.exports = rjsConfig;
