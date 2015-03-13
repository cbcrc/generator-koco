//
// Include all custom knockout binding handlers here to be loaded at application startup.
//

define([
		<% if(includeDemo) { %>'components/since-binding-handler/since-binding-handler',
        'components/date-binding-handler/date-binding-handler',<% } %>
        'bower_components/knockout-modaler/src/modal-binding-handler',
        'bower_components/knockout-dialoger/src/dialog-binding-handler'
    ],
    function() {
        'use strict';


    });
