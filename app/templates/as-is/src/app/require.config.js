var require = {
    baseUrl: '..',
    paths: {
        'configs': './app/configs/configs',
        'configs-transforms': './app/configs/configs.local',
        'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
        'jquery': 'bower_components/jquery/dist/jquery',
        'byroads': 'bower_components/byroads.js/dist/byroads'<% if(useHash) { %>,
        'signals': 'bower_components/js-signals/dist/signals',
        'hasher': 'bower_components/hasher/dist/js/hasher'<% } %>,
        'knockout': 'bower_components/knockout/dist/knockout',
        'knockout-mapping': 'bower_components/knockout-mapping/knockout.mapping',
        'text': 'bower_components/requirejs-text/text',
        'lodash': 'bower_components/lodash/lodash',
        'knockout-validation': 'bower_components/knockout-validation/dist/knockout.validation',
        'dialoger': 'bower_components/knockout-dialoger/src/dialoger',
        'modaler': 'bower_components/knockout-modaler/src/modaler',
        'router': 'bower_components/knockout-router/src/router',
        'knockout-utilities': 'bower_components/knockout-utilities/src/knockout-utilities',
        'router-event': 'bower_components/knockout-router/src/router-event',
        'router-state': 'bower_components/knockout-router-state-<% if(useHash) { %>hash<% } else { %>push<% } %>/src/router-state-<% if(useHash) { %>hash<% } else { %>push<% } %>'<% if(includeDemo) { %>,
        'moment': 'bower_components/moment/moment',
        'nav-bar': 'components/nav-bar/nav-bar'<% } %>
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