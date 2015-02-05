define(['knockout-utilities', 'router', 'dialoger', 'modaler','nav-bar'],
    function(koUtilities, router, dialoger, modaler, navBar) {
        'use strict';

        var Components = function() {};

        Components.prototype.registerComponents = function() {
            //Register components, dialogs & pages here
            
            <% if(includeDemo) { %>koUtilities.registerComponent('nav-bar');

            dialoger.registerDialog('images', {
                title: 'Select an image',
                basePath: 'bower_components/rc.component.image-picker/dist/components/images-dialog'
            });

            koUtilities.registerComponent('image-picker', {
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

            router.registerPage('test', {
                isBower: true
            });
            router.addRoute('test', {
                title: 'Test',
                pageName: 'test'
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


            // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

        };

        return new Components();
    });
