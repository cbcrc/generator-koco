// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');

var ComponentGenerator = generators.NamedBase.extend({

    // The name `constructor` is important here
    // constructor: function() {
    //     // Calling the super constructor is important so our generator is correctly set up
    //     generators.Base.apply(this, arguments);

    //     // Next, add your custom code
    //     //this.option('coffee'); // This method adds support for a `--coffee` flag

    //     //TODO: Add option so that we dont have to answer prompts

    //     this.option('name');
    // },

    initializing: function() {
        this.codeFileExtension = '.js';
        this.startupFile = 'src/app/components' + this.codeFileExtension;

        //TODO: Instead of dasherize, throw exception if name invalid?
        this.filename = this._.dasherize(this.name);
        this.viewModelClassName = this._.classify(this.name);

        if (!this.fs.exists(this.startupFile)) {
            this.log(chalk.magenta('The ') + chalk.green('components') + chalk.magenta(' file is missing in the ') + chalk.green('src/app/') + chalk.magenta(' directory.'));
            this.log(chalk.magenta('Scaffolding aborted.'));
            process.exit(1);
        }

        this.startupFileContent = this.fs.read(this.startupFile);

        var existingRegistrationRegex1 = new RegExp('\\bko\\.components\\.register\\(\s*[\'"]' + this.filename + '[\'"]');
        var existingRegistrationRegex2 = new RegExp('\\bkoUtilities\\.registerComponent\\(\s*[\'"]' + this.filename + '[\'"]');

        if (existingRegistrationRegex1.exec(this.startupFileContent) || existingRegistrationRegex2.exec(this.startupFileContent)) {
            this.log(chalk.magenta('The component ') + chalk.green(this.filename) + chalk.magenta(' is already registered in the ') + chalk.green('components') + chalk.magenta(' file.'));
            this.log(chalk.magenta('Scaffolding aborted.'));
            process.exit(1);
        }
    },

    prompting: function() {
        var done = this.async();
        this.prompt({
            type: 'confirm',
            name: 'htmlOnly',
            message: 'Is the component html only?',
            default: false // Default to current folder name
        }, function(answers) {
            this.htmlOnly = answers.htmlOnly;
            done();
        }.bind(this));
    },

    writing: function() {
        this.log(chalk.white('Creating the component ') + chalk.green(this.filename) + chalk.white(' ...'));

        var token = '// [Scaffolded component registrations will be inserted here. To retain this feature, don\'t remove this comment.]';
        var regex = new RegExp('^(\\s*)(' + token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + ')', 'm');
        var lineToAdd = 'koUtilities.registerComponent(\'' + this.filename + '\'' + (this.htmlOnly ? ', { htmlOnly: true }' : '') + ');';
        var newContents = this.startupFileContent.replace(regex, '$1' + lineToAdd + '\n$&');

        //we write with fs (not this.fs) directly so there is no conflicter in play for this file
        fs.writeFile(this.destinationPath(this.startupFile), newContents);

        var dirname = 'src/components/' + this.filename + '/';
        this.template(this.templatePath('view.html'), this.destinationPath(dirname + this.filename + '.html'));

        if(!this.htmlOnly){
            this.template(this.templatePath('viewmodel' + this.codeFileExtension), this.destinationPath(dirname + this.filename + '-ui' + this.codeFileExtension));
        }
    },

    end: function() {



        this.log(chalk.white('The component ') + chalk.green(this.filename) + chalk.white(' has been scaffolded & registered.'));

        //TODO: Ça fonctionne tu??
        // if (this.fs.exists('gulpfile.js')) {
        //     this.log(chalk.magenta('To include in build output, reference ') + chalk.white('\'' + modulePath + '\'') + chalk.magenta(' in ') + chalk.white('gulpfile.js'));
        // }
    }
});

module.exports = ComponentGenerator;
