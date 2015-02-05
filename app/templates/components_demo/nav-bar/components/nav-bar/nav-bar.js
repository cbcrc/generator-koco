define(['text!./nav-bar.html','nav-bar', 'router'],
    function(template, navBar, router) {
        'use strict';

        function NavBarViewModel() {
            var self = this;
            self.menus = navBar.menus;
        }

        NavBarViewModel.prototype.isPageActive = function(menu) {
            var currentRoute= router.currentRoute();

            if(currentRoute){
                return menu.url.toLowerCase() === currentRoute.url.toLowerCase();
            }

            return false;
        };

        return {
            viewModel: NavBarViewModel,
            template: template
        };
    });