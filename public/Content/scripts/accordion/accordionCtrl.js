(function () {
    "use strict";

    angular
        .module("DemoApp")
        .controller("accordionCtrl",
            ["navService",
            function (navService) {
                var vm = this;
                vm.onActivate = onActivate;
                vm.onBeforeActivate = onBeforeActivate;

                vm.activePanel;
                vm.disable;
                vm.prohibitActivations;
                vm.showOnActivateAlert;
                vm.showOnBeforeActivateAlert;

                init();

                function init() {
                    navService.selectedTab = "accordion";

                    vm.activePanel = 0;
                    vm.disable = false;
                    vm.prohibitActivations = false;
                    vm.showOnActivateAlert = false;
                    vm.showOnBeforeActivateAlert = false;
                };

                function onActivate(event) {
                    if (vm.showOnActivateAlert) {
                        alert("In onActivate: Previous Panel Index = " + event.oldIndex + " Current Panel Index = " + event.newIndex);
                    }
                };

                function onBeforeActivate(event) {
                    if (vm.showOnBeforeActivateAlert) {
                        alert("In onBeforeActivate: Current Panel Index = " + event.oldIndex + " Proposed Panel Index = " + event.newIndex);
                    }
                    return !vm.prohibitActivations;
                };
            }]
        );
})();