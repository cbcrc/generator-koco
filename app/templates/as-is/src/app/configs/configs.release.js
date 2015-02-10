define([],
    function() {
        'use strict';
        
        return {
<% if(includeDemo) { %>
        	api: {
        		baseUrl: 'scoop.radio-canada.ca/api' // this will superseed the api.baseUrl of config.js
        	},
        	imagePicker: {
        		basePath: 'images/' // this will add a new config set to the configs object.
        	}
<% } %>
        };
    });
