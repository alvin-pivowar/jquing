(function () {
    "use strict";

    angular
        .module("DemoApp")
        .controller("navCtrl",
            ["$rootScope", "navService",
            function ($rootScope, navService) {
                var vm = this;
                vm.selectedTab = undefined;

                init();

                function init() {
                    $rootScope.$watch(function () { return navService.selectedTab; }, function (newValue) {
                        vm.selectedTab = newValue;
                    });
                };
            }]
        );
})();