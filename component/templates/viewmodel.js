define(['text!./<%= filename %>.html'],
    function(template) {
        'use strict';

        var <%= viewModelClassName %> = function(params, componentInfo) {

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
