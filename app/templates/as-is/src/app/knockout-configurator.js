define([
        'knockout',
        'knockout-validation',
        'knockout-mapping',
        './knockout-binding-handlers',
        './knockout-validation-rules',
        './knockout-extenders',
        'bower_components/rc.component.knockout-bootstrap-validation/src/binding-handlers/form-group-validation-css-class',
        'bower_components/rc.component.knockout-bootstrap-validation/src/binding-handlers/help-block-validation-message',
        'bower_components/rc.component.knockout-bootstrap-validation/src/extenders/bootstrap-validation',
        'bower_components/rc.component.knockout-bootstrap-validation/src/extenders/success-validating-message'
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