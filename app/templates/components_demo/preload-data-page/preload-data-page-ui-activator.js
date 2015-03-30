define(['jquery', 'modaler'],
    function($, modaler) {
        'use strict';

        var Activator = function( /*context*/ ) {};

        // The activate method is required to return a promise for the router.
        Activator.prototype.activate = function(context) {
            return new $.Deferred(function(dfd) {
                // Displays a loading message since the page won't be displayed until the deferred is resolved.
                modaler.show('loading', {
                    disableKeyEvents: true
                });
                setTimeout(function() {

                    // Pass the loaded data to the component. The key point here is that the 'context' will be passed to the main UI ViewModel. This way, you can add as many variable and structure you want.
                    context.message = 'Loaded some data...';

                    // resolve the promise when we're done.
                    dfd.resolve();

                    // The activator is responsible to hide the loading modal.
                    modaler.hideCurrentModal();
                }, 2000);
            }).promise();
        };

        return new Activator();
    });
