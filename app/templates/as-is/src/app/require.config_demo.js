var require = {
    baseUrl: '.',
    paths: {
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
        'jquery': '../bower_components/jquery/dist/jquery',
        'crossroads': '../bower_components/crossroads.js/dist/crossroads',
        'hasher': '../bower_components/hasher/dist/js/hasher',
        'knockout': '../bower_components/knockout/dist/knockout',
        'knockout-mapping': '../bower_components/knockout-mapping/knockout.mapping',
        'signals': '../bower_components/js-signals/dist/signals',
        'text': '../bower_components/requirejs-text/text',
        'lodash': '../bower_components/lodash/lodash',
        'knockout-validation': '../bower_components/knockout-validation/dist/knockout.validation',
        'dialoger': '../bower_components/rc.component.dialoger/dist/dialoger',
        'modaler': '../bower_components/rc.component.modaler/dist/modaler',
        'router': '../bower_components/rc.component.router/dist/router',
        'knockout-utilities': '../bower_components/rc.knockout.utilities/dist/knockout-utilities',
        'moment': '../bower_components/moment/moment'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'knockout.validation': {
            deps: ['knockout']
        },
        'knockout-mapping': {
            deps: ['knockout']
        }
    }
};