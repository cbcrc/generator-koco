# Knockout Component - Koco - Generator 

A knockout component based project structure and conventions. It should be used when wanting to quickly scaffold a project structure and start right away with basic modules to create a single page application. 

## Table of contents

- [Manifesto](#manifesto)
- [Compatibilty and recommended modules](#compatibilty-and-recommended-modules)
- [Pre-requisites](#pre-requisites)
- [Installation](#installation)
- [Project structure](#project-structure)
- [Building the project](#building-the-project)
- [Deploying your project](#deploying-your-project)
- [Files purpose](#files-purpose)
- [Conventions](#conventions)

## Manifesto

The generator aims to help easing the development and deployment of JavaScript web applications. Code should be small, concise and encapsulated in a component so it can be reused and passed to another project easily.

A component is not necessarily a knockout component, but can be anything that can be sliced and reused properly inside or outside the project.

## Compatibilty and recommended modules

### Core librairies
- [Require.js](http://requirejs.org)
- [jQuery](http://jquery.com/)
- [Bootstrap](http://getbootstrap.com/)
- [KnockoutJS](http://knockoutjs.com/)
- [Knockout router](https://github.com/W3Max/knockout-router): Used to handle routing in your application.
    - [Knockout router state push](https://github.com/W3Max/knockout-router-state-push): Used when you want push-state routing.
    - [Knockout router state hash](https://github.com/W3Max/knockout-router-state-hash): Used when you want hash routing.

### Optional libraries
- [Knockout dialoger](https://github.com/Allov/knockout-dialoger): Used to display fullscreen dialogs.
- [Knockout modaler](https://github.com/Allov/knockout-modaler): Used to display popup 
- [Knockout Bootstrap Validation](https://github.com/Allov/knockout-bootstrap-validation)
- [Knockout Utilities](https://github.com/Allov/knockout-utilities) 

### Other librairies
- [lodash](https://lodash.com/)
- [knockout-validation](https://github.com/Knockout-Contrib/Knockout-Validation) 

## Pre-requisites

Before using this generator, you need a number of tool

1. Install [nodejs](http://nodejs.org/)
2. Install [npmjs](https://www.npmjs.com/): `npm install -g npm` to upgrade `npm` to _at least_ 2.x.x (type `npm -v` to get your current version)
    - If you have problem upgrading your `npm` version, it may have to do with how Windows handle PATH environment variable order.
3. Install [bower](http://bower.io/): `npm install -g bower`
4. Install [gulpjs](http://gulpjs.com/): `npm install -g gulp`
5. Install [yeoman](http://yeoman.io): `npm install -g yo`

## Installation

To install generator-koco from npm, run:

```bash
npm install -g generator-koco
```

Finally, initiate the generator:

```bash
mkdir test
cd test
yo koco
```

*Note*: You can choose to install the demo project during `koco`'s installation to get a better sens of how the project is build. Also, you will have to choose between `Push state` or `hash` routing. `hash` routing will generate url using the `#` character, as the `push state` option will use modern browser's state technology. 

## Project structure

Here's the proposed directory structure for a `koco` project.

    |-- configuration
    |-- server
    |-- src
        |-- app
            |-- configs
                |-- configs.js
                |-- configs.local.js
                |-- <other config files...>
            |-- components.js
            |-- knockout-binding-handlers.js
            |-- knockout-configurator.js
            |-- knockout-extenders.js
            |-- knockout-validation-rules.js
            |-- require.config.js
            |-- startup.js
        |-- components
            |-- <components for your project only...>
        |-- images
            |-- <images for your project only...>
        |-- less
            |-- <less for your project only...>
        |-- index.html
    |-- gulpfile.js
    |-- gulpfile.dev.js
    |-- gulpfile.release.js
    |-- gulpfile.tests.js

## Building the project

`koco` uses `gulp` by default to build. You can build the project for local development or to put in release environment.

The project comes with three files. One for developing, one for releasing and the last one for testing.

To build the project locally, simply run `gulp --open`. Running `gulp` will do a number of things:

### What it does

- `*.less` files will be compiled into css in the `/src/app/css` directory 
- `gulp watch` will be applied on `*.js`, `*.less` and `*.html` files in various locations of your project and build them as you modify them so you can use [Chrome's livereload feature](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en).
- a `nodejs express` server locally on port `1337`
- when `--open` is specified, it will open your default browser tab on `http://localhost:1337`.

## Deploying your project

To build the project for release or any other environment, simply run `gulp deploy`. Running `gulp deploy` will do a number of things:

- `JavaScript`, `less` and `html` will be merged into three separated files and copied into the `/dist` directory.
- `release-folders` task will run and copy specified files to the `/dist` folder keeping the same pattern.

*Note*: When developing, `require.js` is used to load dependencies dynamically. When in release mode, all `JavaScript` and `html` files are merged to be [handled by the `require.js` optimizer `r.js`](http://requirejs.org/docs/optimization.html). You can use the `javascript arrays` declared at the top of the `gulpfile.js` to specify which file to include or exclude from the final bundle.

### Specifying a configuration

A project uses two configuration files to build. The first one, the parent, is named [`configs.js`](#configsjs). Then, a child file is used to superseed the parent file values. These files are named after their environment.

To specify an environment, run the following `gulp` command:

```bash
gulp deploy --env=[environment]
```

### Example

*configs.js*
```javascript
return {
        api: {
            baseUrl: 'http://example.com/api'
        },
        imagePicker: {
            defaultWidth: '635px',
            defaultHeight: '357px'
        }
    };
```

*configs.dev.js*
```javascript
return {
        api: {
            baseUrl: 'http://dev.example.com/api'
        }
    };
```

*gulp command*
```bash
gulp deploy --env=dev
```

In this case, `api.baseUrl` would be overrided in the child file.

### Creating an environment

Simply name your file `configs.[environment].js` in the `/src/app/configs` folder. If the environment doesn't exist, `local` will be assumed.

## Files purpose

The project comes with default files that should be used for a specific purpose. Here are some general guidelines that could be used or not, depends on your needs. 

### `startup.js`

The main entry point. Use this file with caution and avoid adding code directly to it. It should be used mainly as a hub for other initialization functions.

### `index.html`

The main html file. Router, dialoger and modaler components will be rendered there.

### `components.js`

Main component registry file. It is called once at application start. Any scaffolded component will be added here.

### `configs.js`

Main configuration file returns an object. First property level should be treated as a module configuration, while any subsequent level should be configurations options.

Example:

```javascript
    {
        api: {
            baseUrl: 'http://example.com/api'
        },
        imagePicker: {
            defaultWidth: '635px',
            defaultHeight: '357px'
        }
    }
```

The configs-tranforms module will extend the main configuration and override any configuration with the same name. It is useful when you want to set environment linked configurations such as development, release or local environment.

### `knockout-binding-handlers.js`

Include all custom knockout binding handlers here to be loaded at application startup.

### `knockout-extenders.js`

Include all custom knockout extenders here to be loaded at application startup.

### `knockout-validation-rules.js`

Include all custom knockout validation rules here to be loaded at application startup.

### `require.config.js`

Here you can modify the require.js configuration. This is the require.js configuration object as per http://requirejs.org/docs/api.html#config.

### `gulpfile.js`, `gulpfile.local.js`, `gulpfile.deploy.js`, `gulpfile.tests.js`

The `gulp` build files. See [Building the project](#building-the-project) for more information.

## Conventions

`koco` sits on arbitrary conventions that should be followed closely.

### Naming components

- [Dialoger](https://github.com/Allov/knockout-dialoger) will look for component named using the `-dialog` suffix.
- [Modaler](https://github.com/Allov/knockout-modaler) will look for component named using the `-modal` suffix.
- [Router](https://github.com/W3Max/knockout-router) will look for component named using the `-page` suffix.
- Any component failing to follow this pattern for any reason should be registered using the [Knockout utilities](https://github.com/Allov/knockout-utilities) librairy or [knockout's](http://knockoutjs.com/documentation/component-binding.html).

### Usage of Bower and the `bower_components/` folder

[Dialoger](https://github.com/Allov/knockout-dialoger), [Modaler](https://github.com/Allov/knockout-modaler) and [Router](https://github.com/W3Max/knockout-router) rely heavily on [Bower](http://bower.io) to work. In this structure, the `.bowerrc` file overrides the default bower components installation folder and put it inside the `/src` folder. This has to prevail as the majority of the modules will look for files from there.  

### The `components/` folder

By default, all libraries will assume registered components are in the `components/` folder unless `isBower` or `basePath` is specified.
