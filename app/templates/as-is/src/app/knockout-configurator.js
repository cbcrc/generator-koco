define([
        'knockout',
        'knockout-validation',
        'knockout-mapping',
        './knockout-binding-handlers',
        './knockout-validation-rules',
        './knockout-extenders'
    ],
    function(ko, knockoutValidation, koMapping) {
        'use strict';

        ko.mapping = koMapping;

        return {
            configure: function() {
                ko.validation.registerExtenders();

                ko.validation.init({
                    insertMessages: false
                });
            }
        };
    });
