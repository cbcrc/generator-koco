define(["text!./test-dialog.html", "knockout"], function(template, ko) {
    var ViewModel = function(params, componentInfo) {
        var self = this;

        self.title = params.title;

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
