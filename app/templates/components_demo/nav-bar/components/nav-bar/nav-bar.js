define(['text!./nav-bar.html','nav-bar', 'router'],
    function(template, navBar, router) {
        'use strict';

        function NavBarViewModel() {
            var self = this;
            self.menus = navBar.menus;
        }

        NavBarViewModel.prototype.isPageActive = function(menu) {
            var currentRouteUrl = router.currentRoute().url.toLowerCase();

            return menu.url.toLowerCase() === currentRouteUrl;
        };

        return {
            viewModel: NavBarViewModel,
            template: template
        };
    });