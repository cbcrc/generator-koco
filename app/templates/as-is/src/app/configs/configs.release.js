define([],
    function() {
        'use strict';
        
        return {
<% if(includeDemo) { %>
        	api: {
        		baseUrl: 'scoop.radio-canada.ca/api'
        	},
        	imagePicker: {
        		basePath: 'images/'
        	}
<% } %>
        };
    });
