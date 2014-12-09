(function () {
    "use strict";

    angular
        .module("DemoApp")
        .controller("draggableCtrl",
            ["$scope", "$timeout", "navService",
            function ($scope, $timeout, navService) {
                var vm = this;
                vm.onDrag = onDrag;
                vm.onStart = onStart;
                vm.onStop = onStop;

                vm.isDisabled;
                vm.isDrag;
                vm.isStart;
                vm.isStop;
                vm.position = {};

                init();

                function onDrag() {
                    vm.isDrag = true;
                }

                function onStart() {
                    vm.isStart = true;
                    $timeout(function () {
                        vm.isStart = false;
                    }, 1000);
                }

                function onStop() {
                    vm.isDrag = false;
                    vm.isStop = true;
                    $timeout(function () {
                        vm.isStop = false;
                    }, 1000);
                }

                function init() {
                    navService.selectedTab = "draggable";
                    vm.isDisabled = false;
                };
            }]
        );
})();