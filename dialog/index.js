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

        var existingRegistrationRegex1 = new RegExp('\\bdialoger\\.registerDialog\\(\s*[\'"]' + this.filename + '[\'"]');

        if (existingRegistrationRegex1.exec(this.startupFileContent)) {
            this.log(chalk.magenta('The dialog ') + chalk.green(this.filename) + chalk.magenta(' is already registered in the ') + chalk.green('components') + chalk.magenta(' file.'));
            this.log(chalk.magenta('Scaffolding aborted.'));
            process.exit(1);
        }
    },

    prompting: function() {
        var done = this.async();
        this.prompt({
            name: 'title',
            message: 'What\'s the title of your new dialog?',
            default: 'No use for a title'
        }, function(answers) {
            this.title = answers.title;
            done();
        }.bind(this));
    },

    writing: function() {
        this.log(chalk.white('Creating the dialog ') + chalk.green(this.filename) + chalk.white(' ...'));

        var token = '// [Scaffolded component registrations will be inserted here. To retain this feature, don\'t remove this comment.]';
        var regex = new RegExp('^(\\s*)(' + token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + ')', 'm');
        var lineToAdd = 'dialoger.registerDialog(\'' + this.filename + '\');';
        var newContents = this.startupFileContent.replace(regex, '$1' + lineToAdd + '\n$&');

        //we write with fs (not this.fs) directly so there is no conflicter in play for this file
        fs.writeFile(this.destinationPath(this.startupFile), newContents);

        var dirname = 'src/components/' + this.filename + '-dialog/';
        this.template(this.templatePath('view.html'), this.destinationPath(dirname + this.filename + '-dialog.html'));
        this.template(this.templatePath('viewmodel' + this.codeFileExtension), this.destinationPath(dirname + this.filename + '-dialog-ui' + this.codeFileExtension));
    },

    end: function() {



        this.log(chalk.white('The dialog ') + chalk.green(this.filename) + chalk.white(' has been scaffolded & registered.'));

        //TODO: Ça fonctionne tu??
        // if (this.fs.exists('gulpfile.js')) {
        //     this.log(chalk.magenta('To include in build output, reference ') + chalk.white('\'' + modulePath + '\'') + chalk.magenta(' in ') + chalk.white('gulpfile.js'));
        // }
    }
});

module.exports = ComponentGenerator;
