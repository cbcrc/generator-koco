define(['text!./nav-bar.html','nav-bar', 'router'],
    function(template, navBar, router) {
        'use strict';

        function NavBarViewModel() {
            var self = this;
            self.menus = navBar.menus;
        }

        NavBarViewModel.prototype.isPageActive = function(menu) {
            var context = router.context();

            if (context) {
                return menu.url.toLowerCase() === context.route.url.toLowerCase();
            }

            return false;
        };

        return {
            viewModel: NavBarViewModel,
            template: template
        };
    });