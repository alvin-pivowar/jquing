(function () {
    "use strict";

    angular
        .module("DemoApp")
        .controller("mainCtrl",
            ["$scope", "navService",
            function ($scope, navService) {
                var vm = this;

                init();

                function init() {
                    navService.selectedTab = undefined;
                };
            }]
        );
})();