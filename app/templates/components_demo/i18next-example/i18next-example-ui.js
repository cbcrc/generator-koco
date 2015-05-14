define(['text!./i18next-example.html', 'knockout', 'jquery', 'koco-i18next-translator'],
    function(template, ko, $, Translator) {
        'use strict';

        var ViewModel = function(settings, componentInfo) {
            var self = this;

            self.translator = new Translator();
            self.t = self.translator.t;

            self.count = ko.observable(0);

            self.switchLang = ko.pureComputed(function() {
                return self.translator.lng() === 'en' ? 'fr' : 'en';
            });

            self.switchLangTitle = ko.pureComputed(function() {
                return self.translator.lng() === 'en' ? 'français' : 'english';
            });

            self.incrementCount = function() {
                self.count(self.count() + 1);
            };

            self.decrementCount = function() {
                self.count(self.count() - 1);
            };
        };


        ViewModel.prototype.dispose = function() {
            var self = this;

            self.translator.dispose();
        };

        ViewModel.prototype.changeLng = function(lng) {
            var self = this;

            self.translator.lng(lng);
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
