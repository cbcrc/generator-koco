define(['text!./blocking-dialog.html', 'router'],
    function(template, router) {
        'use strict';
        var ViewModel = function(params, componentInfo) {
            var self = this;

            // Subscribing to navigating event on the router.
            // The first parameter is the handler to call whenever navigating.
            // The second parameter is the context to give when calling back the handler. Usefull when you want to use 'this' keyword.
            router.navigating.subscribe(self.canNavigate, self);

            self.title = params.title;

            self.close = function() {
                router.navigating.unsubscribe(self.canNavigate);
                params.close();
            };
        };

        ViewModel.prototype.canNavigate = function() {
            var self = this;
            
            //alert('This dialog is preventing you from navigating to another url. Use the close button or refresh the page completly to navigate again');
            var result = window.confirm('This dialog is preventing you from leaving this dialog. Click OK to quit.');

            if (result) {
                self.close();
            }

            return result; // prevent navigation.
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
