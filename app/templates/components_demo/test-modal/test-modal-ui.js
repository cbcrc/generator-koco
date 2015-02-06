define(['text!./test-modal.html'],
    function(template) {
        'use strict';

        var ViewModel = function(settings, componentInfo) {
            var self = this;

            self.save = function() {
                settings.close('Clicked save');
            };
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
