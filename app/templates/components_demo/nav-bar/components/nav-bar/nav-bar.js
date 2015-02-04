define(['router', 'text!./nav-bar.html'],
    function(router, template) {
        'use strict';

        function NavBarViewModel() {
            var self = this;
            self.routes = router.routes;

            self.isPageActive = isPageActive;
        }

        function isPageActive(route) {
            return router.currentRoute() && router.currentRoute().name == route.name;
        }

        return {
            viewModel: NavBarViewModel,
            template: template
        };
    });