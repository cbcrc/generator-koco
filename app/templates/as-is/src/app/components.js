define(['knockout-utilities', 'router', 'dialoger', 'modaler'<% if(includeDemo) { %>,'nav-bar'<% } %>],
    function(koUtilities, router, dialoger, modaler<% if(includeDemo) { %>, navBar<% } %>) {
        'use strict';

        var Components = function() {};

        Components.prototype.registerComponents = function() {
            // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
            
            //Register components, dialogs & pages here
            
            <% if(includeDemo) { %>koUtilities.registerComponent('nav-bar');

            koUtilities.registerComponent('rc.component.image-picker', {
                isBower: true
            });

            dialoger.registerDialog('test', {
                title: 'Test dialog'
            });

            router.registerPage('home');
            router.addRoute('', {
                title: 'Home',
                pageName: 'home'
            });
            navBar.menus.push({title: 'Home', url: ''});

            router.registerPage('about', {
                htmlOnly: true
            });
            router.addRoute('about', {
                title: 'About'
            });
            navBar.menus.push({title: 'About', url: 'about'});

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
            router.addRoute('page-non-trouvee', {
                title: 'Page non trouvée',
                pageName: 'not-found'
            });

            router.registerPage('rc.page.test', {
                isBower: true
            });
            router.addRoute('test', {
                title: 'Test',
                pageName: 'rc.page.test'
            });
            navBar.menus.push({title: 'Test', url: 'test'});

            router.registerPage('preload-data', {
                
            });
            router.addRoute('preload', {
                title: 'Preloading data',
                pageName: 'preload-data',
                withActivator: true
            });
            navBar.menus.push({title: 'Preloading data', url: 'preload'});

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
