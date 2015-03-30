define(['text!./preload-data-page.html'],
    function(template) {
        'use strict';

        var ViewModel = function(context /*, componentInfo*/ ) {
            var self = this;

            // Since we're using an activator, a 'message' property has been added to the context and can be used here.
            self.message = context.message;

            return self;
        };

        return {
            viewModel: {
                createViewModel: function(context, componentInfo) {
                    return new ViewModel(context, componentInfo);
                }
            },
            template: template
        };
    });
