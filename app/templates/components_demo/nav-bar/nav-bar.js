define(['knockout'],
    function(ko) {
        'use strict';

        function NavBar() {
            var self = this;
            self.menus = ko.observableArray();
        }

        return new NavBar();
    });