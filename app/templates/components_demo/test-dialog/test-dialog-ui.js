define(["text!./test-dialog.html", "knockout", 'dialoger', 'configs'], function(template, ko, dialoger, configs) {
    var ViewModel = function(params, componentInfo) {
        var self = this;

        self.title = params.title;

        self.close = function() {
            params.close();
        };

        // Opening a page dialog.
            self.openPageDialogFocused = ko.observable(false);
            self.openPageDialog = function() {
                dialoger.showPage(configs.baseUrl + 'about').then(function() {
                    self.openPageDialogFocused(true);
                });
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
