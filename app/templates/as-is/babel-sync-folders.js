'use strict';

var chokidar = require('chokidar');
var fs = require('fs-extra');
var path = require('path');
var del = require('del');
var babel = require('babel-core');
var babelConfig = require('./configuration/babel-config');
var recursiveReadDir = require('recursive-readdir');
var _ = require('lodash');
var async = require('async');
var shortid = require('shortid');
var retry = require('retry');

var fromDir = 'src';
var traceActive = false;
var logErrorActive = true;
//var fromDir = 'xyz';
var toDir = 'dev';
var tmpDir = 'tmp';
var watcher;

var trace = function(msg) {
    if (traceActive) {
        console.log(msg);
    }
};

var logError = function(msg) {
    if (logErrorActive) {
        console.log(msg);
    }
};

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

var babelify = function() {

    var srcFilePath = arguments[0];
    var destFilePath = srcFilePath;
    var done;

    if (arguments.length > 2) {
        destFilePath = arguments[1];
        done = arguments[2];
    } else {
        done = arguments[1];
    }

    trace('babelifying: ' + srcFilePath + ' > ' + destFilePath);

    babel.transformFile(srcFilePath, babelConfig.options, function(err, result) {
        //result; // => { code, map, ast }

        if (err) {
            done(err);
        } else {
            var tmpFileName = shortid.generate();
            var tmpFilePath = tmpDir + path.sep + tmpFileName;

            async.series([
                function(callback) {
                    trace('writing babelified file:' + srcFilePath + ' > ' + tmpFilePath);
                    var operation = retry.operation();

                    operation.attempt(function( /*currentAttempt*/ ) {
                        fs.outputFile(tmpFilePath, result.code, function(err) {
                            if (operation.retry(err)) {
                                return;
                            }

                            callback(err ? operation.mainError() : null);
                        });
                    });
                },
                function(callback) {
                    trace('copying file:' + tmpFilePath + ' > ' + destFilePath);
                    var operation = retry.operation();

                    operation.attempt(function( /*currentAttempt*/ ) {
                        fs.copy(tmpFilePath, destFilePath, {
                            clobber: true
                        }, function(err) {
                            if (operation.retry(err)) {
                                return;
                            }

                            callback(err ? operation.mainError() : null);
                        });
                    });
                },
                function(callback) {
                    trace('removing temporary file:' + tmpFilePath);
                    var operation = retry.operation();

                    operation.attempt(function( /*currentAttempt*/ ) {
                        fs.remove(tmpFilePath, function(err) {
                            if (operation.retry(err)) {
                                return;
                            }

                            callback(err ? operation.mainError() : null);
                        });
                    });
                }
            ], done);
        }
    });
};

var doIt = function(srcFilePath, destFilePath) {
    if (babelConfig.mustBeBabelified(srcFilePath.replace(fromDir + path.sep, ''))) {
        babelify(srcFilePath, destFilePath, function(err) {
            if (err) {
                logError('error while babelifying (file: ' + srcFilePath + '): ' + err);
            }
        });
    } else {
        var operation = retry.operation();

        operation.attempt(function( /*currentAttempt*/ ) {
            fs.copy(srcFilePath, destFilePath, {
                clobber: true
            }, function(err) {
                if (operation.retry(err)) {
                    return;
                }

                var finalErr = err ? operation.mainError() : null;

                if (finalErr) {
                    logError('error while copying ' + srcFilePath + ' > ' + destFilePath + ' : ' + err);
                }
            });
        });
    }
};

var startFolderSynchronization = function(done) {
    watcher = chokidar.watch('./' + fromDir, {
            ignored: /[\/\\]\./,
            ignoreInitial: true
        })
        /*
                .on('all', function(event, path) {
                    trace(event + ' ' + path);
                })*/
    ;

    watcher
        .on('add', function(srcFilePath) {
            //log('File', srcFilePath, 'has been added');

            var destFilePath = getDestFilePath(srcFilePath);

            if (!fs.existsSync(destFilePath)) {
                trace('add: ' + srcFilePath + ' > ' + destFilePath);
                doIt(srcFilePath, destFilePath);
            }
        })
        .on('change', function(srcFilePath) {
            //log('File', srcFilePath, 'has been changed');

            var destFilePath = getDestFilePath(srcFilePath);

            if (compareMtime(srcFilePath, destFilePath)) {
                trace('change: ' + srcFilePath + ' > ' + destFilePath);
                doIt(srcFilePath, destFilePath);
            }
        })
        .on('unlink', function(srcFilePath) {
            //log('File', srcFilePath, 'has been removed');

            var destFilePath = getDestFilePath(srcFilePath);

            if (fs.existsSync(destFilePath)) {
                trace('delete: ' + destFilePath);
                fs.removeSync(destFilePath);
            }
        })
        // More events.
        .on('addDir', function(srcFilePath) {
            //log('Directory', srcFilePath, 'has been added');

            var destFilePath = getDestFilePath(srcFilePath);

            if (!fs.existsSync(destFilePath)) {
                trace('mkdir: ' + destFilePath);
                fs.mkdirSync(destFilePath);
            }
        })
        .on('unlinkDir', function(srcFilePath) {
            //log('Directory', srcFilePath, 'has been removed');

            var destFilePath = getDestFilePath(srcFilePath);

            if (fs.existsSync(destFilePath)) {
                trace('rmdir: ' + destFilePath);
                return fs.removeSync(destFilePath, {
                    'force': true
                });
            }
        })
        .on('error', function(err) {
            logError('Error happened', err);
        })
        .on('ready', function() {
            trace('Initial scan complete. Ready for changes.');
            done();
        })
        /*.on('raw', function(event, srcFilePath, details) {
            log('Raw event info:', event, srcFilePath, details);
        })*/
    ;
};

var cleanBabelSyncedFiles = function(done) {
    trace('cleaning babel synced files from folders: ' + toDir + ', ' + tmpDir);

    del([toDir, tmpDir], function(err) {
        if (err) {
            logError('error while cleaning: ' + err);
        } else {
            trace('all clean!');
        }

        done(err);
    });
};

var copyBabelSyncedFiles = function(done) {
    trace('copying files from ' + fromDir + ' folder to ' + toDir + ' folder');

    fs.copy(fromDir, toDir, {
        clobber: true
    }, function(err) {
        if (err) {
            logError('error while copying files from ' + fromDir + ' folder to ' + toDir + ' folder: ' + err);
        } else {
            trace('all files copied from ' + fromDir + ' folder to ' + toDir + ' folder');
        }

        done(err);
    });
};


var babelifyBabelSyncedFiles = function(done) {
    trace('babelifying files from dev folder');

    recursiveReadDir(toDir, function(err, files) {
        if (err) {
            // if (err.errno === 34) {
            // console.log('Path does not exist');
            logError('error while recursiveReadDir files from ' + toDir + ' folder: ' + err);
            done(err);
        } else {
            trace(toDir + ' folder readed');

            //loop over resulting files

            var filesToBabelify = _.filter(files, function(f) {
                return babelConfig.mustBeBabelified(f.replace(toDir + path.sep, ''));
                //return true;
            });

            if (filesToBabelify && filesToBabelify.length > 0) {
                async.each(filesToBabelify, babelify, function(err) {
                    // if any of the file processing produced an error, err would equal that error
                    if (err) {
                        // One of the iterations produced an error.
                        // All processing will now stop.
                        logError('error while babelifying files from ' + toDir + ' folder: ' + err);
                    } else {
                        trace('All files have been babelified successfully');
                    }
                    done(err);
                });
            } else {
                trace('No files to babelify');
                done();
            }
        }
    });
};


var babelSync = function(done) {
    trace('starting ' + toDir + ' folder synchronization');

    startFolderSynchronization(function(err) {
        if (err) {
            logError(toDir + ' folder synchronization failed:' + err);
        } else {
            trace(toDir + ' folder synchronization started...');
        }

        done(err);
    });
};

process.on('message', function(m) {
    if (m === 'start') {
        async.series([
            cleanBabelSyncedFiles,
            copyBabelSyncedFiles,
            babelifyBabelSyncedFiles
        ], function(err) {
            if (err) {
                logError('babel-sync-folder error:' + err);
            } else {
                process.send('ready');

                babelSync(function(err) {
                    if (err) {
                        logError('babel-sync-folder error:' + err);
                    }
                });
            }
        });
    }
});


// process.stdin.resume();//so the program will not close instantly

// function exitHandler() {
//     trace( 'clean up!'));

//     if(watcher){
//         watcher.close();
//     }

//     process.exit();
// }

// //do something when app is closing
// process.on('exit', exitHandler);
// //catches ctrl+c event
// process.on('SIGINT');
// //catches uncaught exceptions
// process.on('uncaughtException');








/************** babel (start) ************************************************************************************/

// gulp.task('cleanBabelSyncedFiles', function(done) {
//     del([toDir, tmpDir], function(err) {
//         if (err) {
//             logError('error while cleaning: ' + err));
//         }

//         done(err);
//     });
// });

// gulp.task('copyBabelSyncedFiles', ['cleanBabelSyncedFiles'], function(cb) {
//     trace( 'copying files from ' + fromDir + ' folder to ' + toDir + ' folder');

//     fs.copy(fromDir, toDir, {
//         clobber: true
//     }, function(err) {
//         if (err) {
//             logError('error while copying files from ' + fromDir + ' folder to ' + toDir + ' folder: ' + err));
//         } else {
//             trace( 'all files copied from ' + fromDir + ' folder to ' + toDir + ' folder');
//         }
//         cb(err);
//     });
// });

// gulp.task('babelifyBabelSyncedFiles', ['copyBabelSyncedFiles'], function(done) {
//     //trace( 'babelifying files from dev folder'));

//     recursiveReadDir(toDir, function(err, files) {
//         if (err) {
//             // if (err.errno === 34) {
//             // console.log('Path does not exist');
//             logError('error while recursiveReadDir files from ' + toDir + ' folder: ' + err));
//             done(err);
//         } else {
//             trace( toDir + ' folder readed');

//             //loop over resulting files

//             var filesToBabelify = _.filter(files, function(f) {
//                 return babelConfig.mustBeBabelified(f.replace(toDir + path.sep, ''));
//                 //return true;
//             });

//             if (filesToBabelify && filesToBabelify.length > 0) {
//                 async.each(filesToBabelify, babelify, function(err) {
//                     // if any of the file processing produced an error, err would equal that error
//                     if (err) {
//                         // One of the iterations produced an error.
//                         // All processing will now stop.
//                         logError('error while babelifying files from ' + toDir + ' folder: ' + err));
//                     } else {
//                         trace( 'All files have been babelified successfully');
//                     }
//                     done(err);
//                 });
//             } else {
//                 trace( 'No files to babelify');
//                 done();
//             }
//         }
//     });
// });

// gulp.task('babelSync', ['babelifyBabelSyncedFiles'], function(done) {

//     // trace( 'babelifying files from dev folder'));
//     // babelifyCopiedFiles();
//     trace( 'starting ' + toDir + ' folder synchronization');

//     startFolderSynchronization(function(err) {
//         if(err){
//             logError(toDir + ' folder synchronization failed:' + err));
//         }else{
//             trace( toDir + ' folder synchronization started...');
//         }

//         done(err);
//     });
// });


/*************** babel (end) ************************************************************************************/
