//
// Include all custom knockout binding handlers here to be loaded at application startup.
//

define([
		<% if(includeDemo) { %>'components/since-binding-handler/since-binding-handler',
        'components/date-binding-handler/date-binding-handler'<% } %>
    ],
    function() {
        'use strict';


    });
