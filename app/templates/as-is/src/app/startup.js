//
// Koco's main entry point.
//

define([
        'knockout',
        './components',
        './knockout-configurator',
        'router',
        'dialoger',
        'modaler'
    ],
    function(ko, components, knockoutConfigurator, router, dialoger, modaler) {
        'use strict';

        components.registerComponents();

        knockoutConfigurator.configure();

        ko.applyBindings({
            router: router,
            dialoger: dialoger,
            modaler: modaler
        });

        dialoger.init();
        modaler.init();
        router.init();
    });
