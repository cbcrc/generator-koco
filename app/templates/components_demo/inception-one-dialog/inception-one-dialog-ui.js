define(["text!./inception-one-dialog.html", "dialoger"],
    function(template, dialoger) {
        'use strict';

        var ViewModel = function(params, componentInfo) {
            var self = this;
            self.openOne = function() {
                dialoger.show("inception-one");
            };

            self.openTwo = function() {
                dialoger.show("inception-two");
            };

            self.close = function() {
                params.close();
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
