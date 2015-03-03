//
// Main configuration file returns an object. First property level should be treated as a module configuration, while any subsequent level should be configurations options.
// Example:
// {
//     api: {
//         baseUrl: 'http://example.com/api'
//     },
//     imagePicker: {
//         defaultWidth: '635px',
//         defaultHeight: '357px'
//     }
// }
//
// The configs-tranforms module will extend the main configuration and override any configuration with the same name. It is useful when you want to set environment linked configurations such as development, release or local environment.
//
define(['jquery', 'configs-transforms'],
    function($, transforms) {
        'use strict';

        var baseConfigs =  {
        <% if(includeDemo) { %>
        	api: {
        		baseUrl: 'lcl-scoop.radio-canada.ca/api'
        	},
		baseUrl: '<%= baseUrl %>'
        <% } %>
        };

    	return $.extend(baseConfigs, transforms);
    });
