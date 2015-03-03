//
// Main component registry file. It is called once at application start. Any scaffolded component will be added here.
//

define(['knockout-utilities', 'router', 'dialoger', 'modaler', 'configs'<% if(includeDemo) { %>,'nav-bar'<% } %>],
    function(koUtilities, router, dialoger, modaler, configs<% if(includeDemo) { %>, navBar<% } %>) {
        'use strict';

        var Components = function() {};

        Components.prototype.registerComponents = function() {
            // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

            //Register components, dialogs & pages here

            <% if(includeDemo) { %>koUtilities.registerComponent('nav-bar');

            koUtilities.registerComponent('i18next-example');

            koUtilities.registerComponent('rc.component.image-picker', {
                isBower: true
            });

            dialoger.registerDialog('test', {
                title: 'Test dialog'
            });

            router.registerPage('home');
            router.addRoute(configs.baseUrl + '', {
                title: 'Home',
                pageName: 'home'
            });
            navBar.menus.push({title: 'Home', url: configs.baseUrl + ''});

            router.registerPage('about', {
                htmlOnly: true
            });
            router.addRoute(configs.baseUrl + 'about', {
                title: 'About',
                pageName: 'about'
            });
            navBar.menus.push({title: 'About', url: configs.baseUrl + 'about'});

            dialoger.registerDialog('inception-one', {
                title: 'Inception one'
            });

            dialoger.registerDialog('inception-two', {
                title: 'Inception two'
            });

            dialoger.registerDialog('blocking', {
                title: 'Blocking dialog'
            });

            router.registerPage('not-found', {
                htmlOnly: true
            });
            router.addRoute(configs.baseUrl + 'page-non-trouvee', {
                title: 'Page non trouvée',
                pageName: 'not-found'
            });

            router.registerPage('rc.page.test', {
                isBower: true
            });
            router.addRoute(configs.baseUrl + 'test', {
                title: 'Test',
                pageName: 'rc.page.test'
            });
            navBar.menus.push({title: 'Test', url: configs.baseUrl + 'test'});

            router.registerPage('preload-data', {
                withActivator: true
            });
            router.addRoute(configs.baseUrl + 'preload', {
                title: 'Preloading data',
                pageName: 'preload-data'
            });
            navBar.menus.push({title: 'Preloading data', url: configs.baseUrl + 'preload'});

            koUtilities.registerComponent('test-component', {
                isBower: true
            });

            modaler.registerModal('test', {
                title: 'Test modal',
                //htmlOnly: true,
                backdrop: 'static',
                keyboard: false
            });

            modaler.registerModal('loading', {
                title: 'Loading...',
                htmlOnly: true,
                backdrop: 'static',
                keyboard: false
            });<% } %>
        };

        return new Components();
    });
