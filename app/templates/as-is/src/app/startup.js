define([
        'framework',
        './components'
    ],
    function(framework, components) {
    	'use strict';
        
    	components.registerComponents();
    	
        framework.init();
    });
