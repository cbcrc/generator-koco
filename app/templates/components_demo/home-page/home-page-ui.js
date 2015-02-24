define(['text!./home-page.html', 'dialoger', 'knockout', 'modaler', 'jquery'],
    function(template, dialoger, ko, modaler, $) {
        'use strict';

        var ViewModel = function(settings, componentInfo) {
            var self = this;

            //For tests
            self.message = ko.observable('Welcome to Koco!');

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
            self.openDialogFocused = ko.observable(false);
            self.openDialog = function() {
                dialoger.showDialog('test').then(function() {
                    self.openDialogFocused(true);
                });
            };

            // Open a modal will yield an arbitrary result when clicking Save. This is the modal responsibility to return the value.
            self.openModalFocused = ko.observable(false);
            self.modalResult = ko.observable();
            self.openModal = function() {
                modaler.showModal('test', {
                    preventFocus: true
                }).then(function(result) {
                    if (result) {
                        self.modalResult('Clicked OK');
                    } else {
                        self.modalResult('Clicked Cancel');
                    }

                    self.openModalFocused(true);
                });
            };

            // Dialog inception.
            self.inceptionFocused = ko.observable(false);
            self.inception = function() {
                dialoger.showDialog('inception-one').then(function() {
                    self.inceptionFocused(true);
                });
            };

            // Dialog preventing navigation.
            self.blockingFocused = ko.observable(false);
            self.blocking = function() {
                dialoger.showDialog('blocking').then(function() {
                    self.blockingFocused(true);
                });
            };

            self.asyncTask = function() {
                return new $.Deferred(function(dfd) {
                    try {
                        setTimeout(function() {
                            dfd.resolve();
                        }, 3000);

                    } catch (err) {
                        dfd.reject(err);
                    }
                }).promise();
            };
        };

        //For tests
        ViewModel.prototype.doSomething = function(){
            this.message('You invoked doSomething() on the viewmodel.');
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
