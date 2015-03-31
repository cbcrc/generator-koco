//
// Usages of this gulp for a project
//
// Command lines:
// gulp // will build the project and start a node express server on localhost (see console for port number).
// gulp --open // will open a chrome tab on the correct URL.
// gulp release // will build the project in release mode (scripts, css and html will be merged and uglified). See console for destination path.
//
// Options:
// --open // will open a chrome tab on the correct URL. Won't work when building in release mode.
// --env=[environment_name] // will merge configuration files using [environment_name] (configs.[environement_name].js).
//

'use strict';

require('./gulpfile.dev');
require('./gulpfile.release');
require('./gulpfile.tests');
