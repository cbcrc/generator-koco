define(['text!./preload-data-page.html', 'knockout'],
    function(template, ko) {
        'use strict';

        var ViewModel = function(params, componentInfo) {
        	var self = this;

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