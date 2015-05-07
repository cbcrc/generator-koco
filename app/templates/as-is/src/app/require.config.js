//
// Here you can modify the require.js configuration. This is the require.js configuration object as per http://requirejs.org/docs/api.html#config.
//

var require = {
    baseUrl: '<%= baseUrl %>',
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
        'knockout-utilities': 'bower_components/knockout-utilities/src/knockout-utilities',
        'router-event': 'bower_components/knockout-router/src/router-event',
        'router-state': <% if(useHash) { %>'bower_components/knockout-router-state-hash/src/router-state-hash'<% } else { %>'bower_components/koco-router/src/router-state-push'<% } %><% if(includeDemo) { %>,
        'moment': 'bower_components/moment/moment',
        'nav-bar': 'components/nav-bar/nav-bar',
        'knockout-i18next': 'bower_components/knockout-i18next/src/knockout-i18next',
        'i18next': 'bower_components/i18next/i18next.amd',
        'knockout-mutex': 'bower_components/knockout-mutex/src/knockout-mutex',
        'async-click-state': 'bower_components/knockout-async-click/src/async-click-state',
        'knockout-i18next-translator': 'bower_components/knockout-i18next/src/knockout-i18next-translator'<% } %>
    },
    packages: [
    { name: 'router',
      location: 'bower_components/knockout-router/src',  // default 'packagename'
      main: 'router'                // default 'main'
    }],
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
