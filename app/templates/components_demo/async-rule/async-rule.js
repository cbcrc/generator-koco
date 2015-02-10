define(["knockout"], function(ko) {
	'use strict';
	
    ko.validation.rules['exampleAsync'] = {
        async: true, // the flag that says "Hey I'm Async!"
        validator: function(val, otherVal, callback) { // yes, you get a 'callback'

            setTimeout(function() {
                callback(true);
            }, 2000);
        },
        message: 'My default invalid message'
    };
});
