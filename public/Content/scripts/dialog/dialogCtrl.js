(function () {
    "use strict";

    angular
        .module("DemoApp")
        .controller("dialogCtrl",
            ["$scope", "$timeout", "navService",
            function ($scope, $timeout, navService) {
                var vm = this;
                vm.onDialogBeforeClose = onDialogBeforeClose;
                vm.onDialogButton = onDialogButton;
                vm.onDialogClose = onDialogClose;
                vm.onDialogOpen = onDialogOpen;

                vm.favoriteStooge;
                vm.isDialogOpen;
                vm.onBeforeCloseFired;
                vm.onCloseFired;
                vm.onOpenFired;
                vm.suppressClose;

                init();

                function init() {
                    navService.selectedTab = "dialog";
                    vm.isDialogOpen = true;
                    vm.suppressClose = false;
                };

                function onDialogBeforeClose() {
                    vm.onBeforeCloseFired = true;
                    $timeout(function () {
                        vm.onBeforeCloseFired = false;
                    }, 1000);
                    return !vm.suppressClose;
                }

                function onDialogButton(button) {
                    vm.favoriteStooge = button;
                }

                function onDialogClose() {
                    vm.favoriteStooge = undefined;
                    vm.onCloseFired = true;
                    $timeout(function () {
                        vm.onCloseFired = false;
                    }, 2000);
                }

                function onDialogOpen() {
                    vm.onOpenFired = true;
                    $timeout(function () {
                        vm.onOpenFired = false;
                    }, 1000);
                }
            }]
        );
})();