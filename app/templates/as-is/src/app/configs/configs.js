define(['jquery', 'configs-transforms'],
    function($, transforms) {
        'use strict';
        
        var baseConfigs =  {
        <% if(includeDemo) { %>
        	api: {
        		baseUrl: 'lcl-scoop.radio-canada.ca/api'
        	}
        <% } %>
        };

    	return $.extend(baseConfigs, transforms);
    });
