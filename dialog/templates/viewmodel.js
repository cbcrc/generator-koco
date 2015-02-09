define(['text!./<%= filename %>-dialog.html'],
    function(template) {
        'use strict';

        var <%= viewModelClassName %> = function(params, componentInfo) {
            var self = this;
            
            self.params = params;
        };

        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
        <%= viewModelClassName %> .prototype.dispose = function() {};


        <%= viewModelClassName %> .prototype.close = function() {
            var self = this;

            self.params.close();
        };

        return {
            viewModel: {
                createViewModel: function(params, componentInfo) {
                    return new <%= viewModelClassName %> (params, componentInfo);
                }
            },
            template: template
        };
    });
