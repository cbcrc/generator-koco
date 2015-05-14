//
// Include all custom knockout binding handlers here to be loaded at application startup.
//

define([
        <% if(includeDemo) { %>'components/since-binding-handler/since-binding-handler',
        'components/date-binding-handler/date-binding-handler',
        'bower_components/koco-async-click/src/async-click-binding-handler',<% } %>
        'bower_components/koco-modaler/src/modal-binding-handler',
        'bower_components/koco-dialoger/src/dialog-binding-handler',
        'bower_components/koco-validation/src/binding-handlers/form-group-validation-css-class-binding-handler',
        'bower_components/koco-validation/src/binding-handlers/help-block-validation-message-binding-handler'
    ],
    function() {
        'use strict';


    });
