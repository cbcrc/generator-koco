define(['jquery'],
    function($) {
        'use strict';

        var Activator = function() {};

        // The activate method is required to return a promise for the router. 
        Activator.prototype.activate = function() {
            var deferred = new $.Deferred();

            // Displays a loading message since the page won't be displayed until the deferred is resolved.

            setTimeout(function() {

                // Pass the loaded data to the component.
                deferred.resolve({
                    message: 'Loaded some data...'
                });

                // The activator is responsible to hide the loading modal.


            }, 2000);

            return deferred.promise();
        };

        return new Activator();
    });
