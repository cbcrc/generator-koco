define(['text!./preload-data-page.html'],
    function(template) {
        'use strict';

        var ViewModel = function(params, componentInfo) {
        	var self = this;

		// Since we're using an activator for the route, it is possible to get any preloaded data from the activationData param.
		self.message = params.activationData.message;
        };

        return {
            viewModel: {
                createViewModel: function(params, componentInfo) {
                    return new ViewModel(params, componentInfo);
                }
            },
            template: template
        };
    });