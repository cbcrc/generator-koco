define(['text!./test-modal.html', 'knockout'],
    function(template, ko) {
        'use strict';

        var ViewModel = function(settings, componentInfo) {
            var self = this;

            self.okFocused = ko.observable(false);

            settings.shown.subscribe(function() {
                self.okFocused(true);
            });

            self.ok = function() {
                settings.close('Clicked OK');
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
