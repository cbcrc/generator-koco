'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');

var ComponentGenerator = generators.Base.extend({

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

        if (!this.fs.exists(this.startupFile)) {
            this.log(chalk.magenta('The ') + chalk.green('components') + chalk.magenta(' file is missing in the ') + chalk.green('src/app/') + chalk.magenta(' directory.'));
            this.log(chalk.magenta('Scaffolding aborted.'));
            process.exit(1);
        }

        this.startupFileContent = this.fs.read(this.startupFile);


    },

    prompting: function() {
        var done = this.async();
        this.prompt([{
            name: 'pattern',
            message: 'What is the pattern of the route?',
            default: ''
        }, {
            name: 'pageName',
            message: 'To which page is this route attached?',
            required: true,
            default: function(answers) {
                return answers.pattern;
            }
        }, {
            name: 'title',
            message: 'What\'s the default page title for this route?',
            default: 'No use for a title'
        }], function(answers) {
            this.pageName = answers.pageName;
            this.title = answers.title;
            this.pattern = answers.pattern;
            done();
        }.bind(this));
    },

    validating: function() {
        var existingRegistrationRegex = new RegExp('\\brouter\\.addRoute\\(\s*[\'"]' + this.pattern + '[\'"]');

        if (existingRegistrationRegex.exec(this.startupFileContent)) {
            this.log(chalk.magenta('The route ') + chalk.green(this.filename) + chalk.magenta(' is already added in the ') + chalk.green('components') + chalk.magenta(' file.'));
            this.log(chalk.magenta('Scaffolding aborted.'));
            process.exit(1);
        }


        var filename = this._.dasherize(this.pageName);

        var existingRegistrationRegex1 = new RegExp('\\brouter\\.registerPage\\(\s*[\'"]' + filename + '[\'"]');

        if (!existingRegistrationRegex1.exec(this.startupFileContent)) {
            this.log(chalk.magenta('The page ') + chalk.green(filename) + chalk.magenta(' is not registered in the ') + chalk.green('components') + chalk.magenta(' file.'));
            this.log(chalk.magenta('Scaffolding aborted.'));
            process.exit(1);
        }
    },

    writing: function() {
        this.log(chalk.white('Adding the route ') + chalk.green(this.pattern) + chalk.white(' ...'));

        var token = '// [Scaffolded component registrations will be inserted here. To retain this feature, don\'t remove this comment.]';
        var regex = new RegExp('^(\\s*)(' + token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + ')', 'm');
        var lineToAdd = 'router.addRoute(\'' + this.pattern + '\', { pageName: \'' + this.pageName + '\', title: \'' + this.title + '\' });';
        var newContents = this.startupFileContent.replace(regex, '$1' + lineToAdd + '\n$&');

        //we write with fs (not this.fs) directly so there is no conflicter in play for this file
        fs.writeFile(this.destinationPath(this.startupFile), newContents);
    },

    end: function() {



        this.log(chalk.white('The route ') + chalk.green(this.filename) + chalk.white(' has been added.'));

        //TODO: Ça fonctionne tu??
        // if (this.fs.exists('gulpfile.js')) {
        //     this.log(chalk.magenta('To include in build output, reference ') + chalk.white('\'' + modulePath + '\'') + chalk.magenta(' in ') + chalk.white('gulpfile.js'));
        // }
    }
});

module.exports = ComponentGenerator;
