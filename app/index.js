//TO DEBUG: node-debug C:\Users\forgetsm\AppData\Roaming\npm\node_modules\yo\cli.js koco

'use strict';
//var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');
var _ = require('lodash');
//var yosay = require('yosay');

var KoGenerator = yeoman.generators.Base.extend({
    init: function() {
        this.pkg = require('../package.json');

        this.on('end', function() {
            if (!this.options['skip-install']) {
                // Figure out whether we have an internet connection. If not, need to
                // pass --offline to bower otherwise it won't fall back on cache.
                require('dns').resolve('example.com', function(isOffline) {
                    console.log('Installing dependencies in ' + (isOffline ? 'offline' : 'online') + ' mode...');
                    if (isOffline) {
                        // Patch bowerInstall to pass --offline
                        this.bowerInstall = (function(originalFunction) {
                            return function(paths, options, cb) {
                                options = options || {};
                                options.offline = true;
                                return originalFunction.call(this, paths, options, cb);
                            };
                        })(this.bowerInstall);
                    }

                    this.installDependencies();

                    /*if (this.includeTests) {
                      // Install test dependencies too
                      var bowerArgs = ['install'];
                      if (isOffline) {
                        bowerArgs.push('--offline');
                      }
                      this.spawnCommand('bower', bowerArgs, { cwd: 'test' });
                    }*/
                }.bind(this));
            }
        });
    },

    askFor: function() {
        var done = this.async();
        this.log(this.yeoman);
        this.log(chalk.magenta('You\'re using the fantastic koco app generator.'));

        var prompts = [{
            name: 'name',
            message: 'What\'s the name of your new app?',
            default: path.basename(process.cwd())
        }, {
            type: 'confirm',
            name: 'includeDemo',
            message: 'Do you want to include demo content?',
            default: false
        }, {
            type: 'confirm',
            name: 'useHash',
            message: 'Do you want to use hashbang (#!) for routing? Default is pushState.',
            default: false
        }, {
            type: 'checkbox',
            name: 'projects',
            message: 'Which project file do you want to include? You may select none.',
            choices: [{
                name: 'Visual Studio 2013 csproj',
                value: '2013-csproj',
                checked: false
            }, {
                name: 'Sublime project file',
                value: 'sublime',
                checked: false
            }]
        }];

        this.prompt(prompts, function(props) {
            this.longName = props.name;
            this.slugName = this._.slugify(this.longName);
            this.includeDemo = props.includeDemo;
            this.useHash = props.useHash;
            this.demoSuffix = '_demo';
            this.fileDemoSuffix = '';
            this.projects = props.projects;

            if (this.includeDemo) {
                this.fileDemoSuffix = this.demoSuffix;
            }

            done();
        }.bind(this));
    },

    templating: function() {


        this._processDirectory('as-is', this.destinationRoot());

        if (this.includeDemo) {
            this._processDirectory('components_demo', this.destinationPath('src/components'));
            this._processDirectory('i18next_demo', this.destinationPath('src/app'));
        }

        if (_.some(this.projects, function(value) {
                return value === '2013-csproj';
            })) {
            this.template(this.templatePath('must-rename/_frameworkjs.csproj'), this.destinationPath(this.slugName + '.csproj'));
            this._processDirectory('visual-studio-2013-csproj', this.destinationPath(''));
        }

        if (_.some(this.projects, function(value) {
                return value === 'sublime';
            })) {
            this.copy(this.templatePath('must-rename/_frameworkjs.sublime-project'), this.destinationPath(this.slugName + '.sublime-project'));
        }

        this.template(this.templatePath('must-rename/_package.json'), this.destinationPath('package.json'));
        this.template(this.templatePath('must-rename/_bower.json'), this.destinationPath('bower.json'));
        this.copy(this.templatePath('must-rename/_gulpfile.js'), this.destinationPath('gulpfile.js'));
        this.copy(this.templatePath('must-rename/gitignore'), this.destinationPath('.gitignore'));
        this.copy(this.templatePath('must-rename/bowerrc'), this.destinationPath('.bowerrc'));
        this.copy(this.templatePath('must-rename/jshintrc'), this.destinationPath('.jshintrc'));
        this.copy(this.templatePath('must-rename/editorconfig'), this.destinationPath('.editorconfig'));

        //this.directory(this.templatePath('as-is/build-dev'), this.destinationPath('build-dev'));

        /*if (this.includeTests) {
          // Set up tests
          this._processDirectory('test', 'test');
          this.copy('bowerrc_test', 'test/.bowerrc');
          this.copy('karma.conf.js');
        }*/
    },

    end: function() {
        //create empty directories 
        if (!this.includeDemo) {
            fs.mkdirSync(this.destinationPath('src/components'));
        }

        this.installDependencies({
            bower: true,
            npm: true
        });
    },

    _processDirectory: function(source, destination, excludeExtension) {
        var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);

        var self = this;

        var files = this.expandFiles('**', {
            dot: true,
            cwd: root
        });

        var filesToBeReplacedByDemoFiles = [];

        for (var i = 0; i < files.length; i++) {
            var filename = files[i];
            var ext = path.extname(filename);
            var demoEndOfFileName = self.demoSuffix + ext;
            var finalFileName = filename.replace(demoEndOfFileName, ext);
            var isDemoFile = (filename.indexOf(demoEndOfFileName, filename.length - demoEndOfFileName.length) !== -1);

            if (isDemoFile) {
                filesToBeReplacedByDemoFiles.push(finalFileName);
            }
        }

        var filteredFiles = files.filter(function(filename) {
            var ext = path.extname(filename);
            var demoEndOfFileName = self.demoSuffix + ext;
            var finalFileName = filename.replace(demoEndOfFileName, ext);
            var isDemoFile = (filename.indexOf(demoEndOfFileName, filename.length - demoEndOfFileName.length) !== -1);
            var isParOfDemoFiles = (filesToBeReplacedByDemoFiles.indexOf(finalFileName) > -1);

            var demoPredicateResult = true;

            if (isParOfDemoFiles) {
                if (self.includeDemo) {
                    demoPredicateResult = isDemoFile;
                } else {
                    demoPredicateResult = !isDemoFile;
                }
            }

            return demoPredicateResult && (!excludeExtension || ext !== excludeExtension);
        });

        for (var i = 0; i < filteredFiles.length; i++) {
            var f = filteredFiles[i];
            var ext = path.extname(f);
            var demoEndOfFileName = self.demoSuffix + ext;
            var finalFileName = f.replace(demoEndOfFileName, ext);

            var src = path.join(root, f);
            var dest;

            if (path.basename(finalFileName).indexOf('_') == 0) {
                dest = path.join(destination, path.dirname(finalFileName), path.basename(finalFileName).replace(/^_/, ''));
                this.template(src, dest);
            } else {
                dest = path.join(destination, finalFileName);
                this.copy(src, dest);
            }
        }
    }
});

module.exports = KoGenerator;
