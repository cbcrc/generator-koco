define(['text!./nav-bar.html','nav-bar'],
    function(template, navBar) {
        'use strict';

        function NavBarViewModel() {
            var self = this;
            self.menus = navBar.menus;

            self.isPageActive = isPageActive;
        }

        function isPageActive(menu) {
            return menu.hash.toLowerCase() === window.location.hash.toLowerCase();
        }

        return {
            viewModel: NavBarViewModel,
            template: template
        };
    });