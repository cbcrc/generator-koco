define(['knockout-utilities', 'router', 'dialoger', 'modaler'],
    function(koUtilities, router, dialoger, modaler) {
        'use strict';

        var Components = function() {};

        Components.prototype.registerComponents = function() {
            //Register components, dialogs & pages here
            
            koUtilities.registerComponent('nav-bar');

            dialoger.registerDialog('images', {
                title: 'Select an image',
                basePath: 'bower_components/rc.component.image-picker/dist/components/'
            });

            koUtilities.registerComponent('image-picker', {
                isBower: true
            });

            dialoger.registerDialog('test', {
                title: 'Test dialog'
            });

            router.registerPage('home', {
                title: 'Demo',
                url: ''
            });

            router.registerPage('about', {
                title: 'About',
                url: 'about',
                htmlOnly: true
            });

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
                url: 'page-non-trouvee',
                htmlOnly: true,
                excludedFromNav: true
            });

            router.registerPage('test', {
                title: 'Test',
                url: 'test',
                isBower: true
            });

            koUtilities.registerComponent('test-component', {
                isBower: true
            });

            modaler.registerModal('test', {
                title: 'Test modal',
                //htmlOnly: true,
                backdrop: 'static',
                keyboard: false
            });









            // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

        };

        return new Components();
    });
