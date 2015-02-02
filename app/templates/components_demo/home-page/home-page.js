define(['text!./home-page.html', 'dialoger', 'knockout', 'modaler'],
    function(template, dialoger, ko, modaler) {
        'use strict';

        var ViewModel = function(settings, componentInfo) {
            var self = this;
            
            // Knockout binding handlers
            self.since = ko.observable(Date.now() - 1000 * 60 * 60 * 24 * 5);
            
            // Update time every 100ms to show how knockout observables work.
            self.now = ko.observable(Date.now());
            setInterval(function() {
                self.now(Date.now());
            }, 100);

            // Dialog returning data: Image picker. This value will be set when selecting an image.
            self.image = ko.observable();
            
            // Opening a simple dialog.
            self.openDialog = function() {
                dialoger.showDialog('test');
            };

            // Open a modal will yield an arbitrary result when clicking Save. This is the modal responsibility to return the value.
            self.modalResult = ko.observable();
            self.openModal = function() {
                modaler.showModal('test').then(function(result) {
                    if (result) {
                        self.modalResult("Clicked save");
                    } else {
                        self.modalResult("Clicked close");
                    }
                });
            };

            // Dialog inception.
            self.inception = function() {
                dialoger.showDialog('inception-one');
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
