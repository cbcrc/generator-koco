define(['text!./<%= filename %>-page.html'],
    function(template) {
        'use strict';

        var <%= viewModelClassName %> = function(params, componentInfo) {
            var self = this;
            
            self.params = params;<% if(withActivator) { %>
            self.message = params.activationData.message;
            <% } %>
        };

        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
        <%= viewModelClassName %> .prototype.dispose = function() {};

        return {
            viewModel: {
                createViewModel: function(params, componentInfo) {
                    return new <%= viewModelClassName %> (params, componentInfo);
                }
            },
            template: template
        };
    });
