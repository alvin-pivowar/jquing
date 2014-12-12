///#source 1 1 /public/Content/scripts/jQueryUILib.js
(function () {
    "use strict";

    angular.module("jQueryUILib", []);
})();
///#source 1 1 /public/Content/scripts/accordion/jqui-accordion.js
(function () {
    "use strict";

    angular
        .module("jQueryUILib")
        .directive("jquiAccordion",
            ["$parse", "$timeout", "$window",
            function ($parse, $timeout, $window) {
                var $ = $window.jQuery;
                if (!$) throw new Error("jQuery not loaded.");
                if (!$.ui) throw new Error("jQuery UI not loaded.");

                return {
                    restrict: "AE",
                    require: "?ngModel",
                    link: function (scope, element, attrs, ngModel) {
                        $(function () {
                            var currentActive;
                            var disabled;
                            var options = {};

                            // initialization
                            if (attrs.options) {
                                options = scope.$eval(attrs.options);
                            }
                            $(element).accordion(options);

                            if (ngModel) {
                                currentActive = modelToActive(ngModel.$modelValue);
                                $(element).accordion("option", "active", currentActive);

                                // watch ngModel
                                ngModel.$render = function () {
                                    $(element).accordion("option", "active", modelToActive(ngModel.$modelValue));
                                };
                            }

                            // destroy method
                            if (attrs.destroy) {
                                // watch destroy="{{prop}}"
                                attrs.$observe("destroy", function (value) {
                                    if (scope.$eval(value)) {
                                        $(element).accordion("destroy");
                                    }
                                });

                                // watch destroy="prop"
                                scope.$watch($parse(attrs.destroy), function (newValue) {
                                    if (newValue) {
                                        $(element).accordion("destroy");
                                    }
                                });
                            }

                            // disable and enable methods
                            if (attrs.disable) {
                                // watch disable="{{prop}}"
                                attrs.$observe("disable", function (value) {
                                    $(element).accordion("option", "disabled", scope.$eval(value));
                                });

                                // watch disable="prop"
                                scope.$watch($parse(attrs.disable), function (newValue) {
                                    $(element).accordion("option", "disabled", newValue);
                                });
                            }

                            // activate event
                            $(element).on("accordionactivate", function (event, ui) {
                                var activateInfo;
                                var expression;
                                var handler;
                                var newActive;
                                var newModelValue;

                                newActive = $(element).accordion("option", "active");
                                newModelValue = activeToModel(newActive);
                                if (newActive !== currentActive) {
                                    if (attrs.onActivate) {
                                        // call onActivate="fn(ActivateInfo)"
                                        handler = $parse(attrs.onActivate);
                                        activateInfo = new ActivateInfo(activeToModel(currentActive), newModelValue);
                                        handler(scope, { event: activateInfo });
                                        $timeout(function () { scope.$apply(); });
                                    }
                                    currentActive = newActive;

                                    // update ngModel
                                    if (ngModel) {
                                        ngModel.$setViewValue(newModelValue);
                                    }
                                }
                            });

                            // before activate event
                            $(element).on("accordionbeforeactivate", function (event, ui) {
                                var activateInfo;
                                var handler;
                                var headers;
                                var i;
                                var newActive;
                                var result;
                                var tagName;

                                if (!attrs.onBeforeActivate) {
                                    return true;
                                }

                                // Determine index of activating header.
                                newActive = false;
                                if (ui.newHeader) {
                                    tagName = ui.newHeader.prop("tagName");
                                    headers = $(element).find(tagName);
                                    for (i = 0; i < headers.length; ++i) {
                                        if (headers[i] == ui.newHeader[0]) {
                                            newActive = i;
                                            break;
                                        }
                                    }
                                };

                                // call on-before-active="fn(ActivateInfo)"
                                handler = $parse(attrs.onBeforeActivate);
                                activateInfo = new ActivateInfo(activeToModel(currentActive), activeToModel(newActive));
                                result = handler(scope, { event: activateInfo });
                                $timeout(function () { scope.$apply(); });
                                return result;
                            });
                        });
                    }
                };

                function ActivateInfo (oldIndex, newIndex) {
                    this.oldIndex = oldIndex;
                    this.newIndex = newIndex;
                }

                // convert jQuery active value to model index (or "").
                function activeToModel(activeValue) {
                    var index = parseInt(activeValue);
                    return isNaN(index) ? "" : index;
                }

                // convert model index to jQuery active value.
                function modelToActive(modelValue) {
                    var index = parseInt(modelValue);
                    return isNaN(index) ? false : index;
                }
            }]
        );
})();
///#source 1 1 /public/Content/scripts/dialog/jqui-dialog.js
(function () {
    "use strict";

    angular
        .module("jQueryUILib")
        .directive("jquiDialog",
            ["$parse", "$timeout", "$window",
            function ($parse, $timeout, $window) {
                var $ = $window.jQuery;
                if (!$) throw new Error("jQuery not loaded.");
                if (!$.ui) throw new Error("jQuery UI not loaded.");

                return {
                    restrict: "AE",
                    link: function (scope, element, attrs) {
                        $(function () {
                            var options;

                            // initialization
                            if (attrs.options) {
                                options = scope.$eval(attrs.options);
                                addButtonHandler(options, scope, attrs);
                            }
                            $(element).dialog(options);

                            // destroy method
                            if (attrs.destroy) {
                                // watch destroy="{{prop}}"
                                attrs.$observe("destroy", function (value) {
                                    if (scope.$eval(value)) {
                                        $(element).dialog("destroy");
                                    }
                                });

                                // watch destroy="prop"
                                scope.$watch($parse(attrs.destroy), function (newValue) {
                                    if (newValue) {
                                        $(element).dialog("destroy");
                                    }
                                });
                            }

                            // open, close method
                            if (attrs.open) {
                                // watch open="{{prop}}
                                attrs.$observe("open", function (value) {
                                    $(element).dialog(scope.$eval(value) ? "open" : "close");
                                });

                                // watch open="prop"
                                scope.$watch($parse(attrs.open), function (newValue) {
                                    $(element).dialog(newValue ? "open" : "close");
                                });
                            }

                            // before close event
                            $(element).on("dialogbeforeclose", function () {
                                var handler;
                                var result;

                                if (!attrs.onBeforeClose) {
                                    return true;
                                }

                                // call on-before-close="fn()"
                                handler = $parse(attrs.onBeforeClose);
                                result = handler(scope);
                                $timeout(function () {
                                    scope.$apply();
                                });
                                return result;
                            });

                            // close event
                            $(element).on("dialogclose", function () {
                                var handler;

                                // Update model in open="prop"
                                if (attrs.open) {
                                    handler = $parse(attrs.open);
                                    if (handler.assign) {
                                        handler.assign(scope, false);
                                    }
                                }

                                // Call on-open="fn()"
                                if (attrs.onClose) {
                                    handler = $parse(attrs.onClose);
                                    handler(scope);
                                }

                                if (attrs.open || attrs.onClose) {
                                    $timeout(function () {
                                        scope.$apply();
                                    });
                                }
                            });

                            // open event
                            $(element).on("dialogopen", function () {
                                var handler;

                                // Update model in open="prop"
                                if (attrs.open) {
                                    handler = $parse(attrs.open);
                                    if (handler.assign) {
                                        handler.assign(scope, true);
                                    }
                                }

                                // call on-open="fn()"
                                if (attrs.onOpen) {
                                    handler = $parse(attrs.onOpen);
                                    handler(scope);
                                    $timeout(function () {
                                        scope.$apply();
                                    });
                                }
                            });

                            // destroy dialog when parent's view is destroyed.
                            scope.$on("$destroy", function () {
                                $(element).dialog("destroy");
                            });
                        });
                    }
                };

                function addButtonHandler(options, scope, attrs) {
                    var i;
                    var proxy;

                    if (!options.buttons) {
                        return;
                    }

                    for (i = 0; i < options.buttons.length; ++i) {
                        // IIFE to capture button for callback.
                        (function (button) {
                            button.click = function () {
                                var handler;

                                if (attrs.onButton) {
                                    // call on-button="fn(button)"
                                    handler = $parse(attrs.onButton);
                                    handler(scope, { button: button.text });
                                    $timeout(function () {
                                        scope.$apply();
                                    });
                                }
                            };
                        })(options.buttons[i]);
                    }
                }
            }]
        );
})();
///#source 1 1 /public/Content/scripts/draggable/jqui-draggable.js
(function () {
    "use strict";

    angular
        .module("jQueryUILib")
        .directive("jquiDraggable",
            ["$parse", "$timeout", "$window",
            function ($parse, $timeout, $window) {
                var $ = $window.jQuery;
                if (!$) throw new Error("jQuery not loaded.");
                if (!$.ui) throw new Error("jQuery UI not loaded.");

                return {
                    restrict: "AE",
                    require: "?ngModel",
                    link: function (scope, element, attrs, ngModel) {
                        $(function () {
                            var anchor = {};
                            var options;
                            var position;

                            // initialization
                            if (attrs.options) {
                                options = scope.$eval(attrs.options);
                            }
                            $(element).draggable(options);

                            // ngModel
                            if (ngModel) {
                                position = ngModel.$modelValue;
                                if (position && position.left && position.top) {
                                    element.css({ left: position.left, top: position.top });
                                }

                                // watch ngModel
                                scope.$watch($parse(attrs.ngModel), function (newValue) {
                                    position = newValue;
                                    if (position) {
                                        if (position.left) {
                                            element.css("left", position.left + "px");
                                        }
                                        if (position.top) {
                                            element.css("top", position.top + "px");
                                        }
                                    }

                                }, true);
                            }

                            // disable and enable methods
                            if (attrs.disable) {
                                // watch disable="{{prop}}"
                                attrs.$observe("disable", function (value) {
                                    $(element).draggable("option", "disabled", scope.$eval(value));
                                });

                                // watch disable="prop"
                                scope.$watch($parse(attrs.disable), function (newValue) {
                                    $(element).draggable("option", "disabled", newValue);
                                });
                            }

                            // drag event
                            $(element).on("drag", function (event) {
                                updateModelAndPerformCallback(scope, element, ngModel, event, anchor, attrs.onDrag);
                            });

                            // dragstart event
                            $(element).on("dragstart", function (event) {
                                anchor.x = event.clientX;
                                anchor.y = event.clientY;

                                updateModelAndPerformCallback(scope, element, ngModel, event, anchor, attrs.onStart);
                            });

                            // dragstop event
                            $(element).on("dragstop", function () {
                                updateModelAndPerformCallback(scope, element, ngModel, event, anchor, attrs.onStop);
                            });
                        });
                    }
                };

                function updateModelAndPerformCallback(scope, element, ngModel, event, anchor, callbackExp) {
                    var handler;
                    var left;
                    var positionInfo = null;
                    var top;

                    if (ngModel || doesCallbackNeedPositionInfo) {
                        // attempt to get the position from the element.
                        left = parseInt(element.css("left"));
                        top = parseInt(element.css("top"));

                        // if the left and top are not known,
                        // calculate the left and top from the anchor and event.
                        if (isNaN(left) || isNaN(top)) {
                            left = event.clientX - anchor.x;
                            top = event.clientY - anchor.y;
                        }

                        positionInfo = { left: left, top: top };
                    }

                    if (ngModel) {
                        ngModel.$setViewValue(positionInfo);
                    }

                    if (callbackExp) {
                        handler = $parse(callbackExp);
                        handler(scope, { position: positionInfo });
                        $timeout(function () {
                            scope.$apply();
                        });
                    }
                }

                function doesCallbackNeedPositionInfo(callbackExp) {
                    var lParenIndex;
                    var rParenIndex;

                    if (callbackExp) {
                        lParenIndex = callbackExp.indexOf('(');
                        rParenIndex = callbackExp.indexOf(')');
                        if (lParenIndex > 0 && rParenIndex > 0 && rParenIndex > lParenIndex + 1) {
                            return true;
                        }
                    }

                    return false;
                }
            }]
        );
})();
///#source 1 1 /public/Content/scripts/DemoApp.js
(function () {
    "use strict";

    angular.module("DemoApp", ["ngRoute", "jQueryUILib"]);
})();
///#source 1 1 /public/Content/scripts/demo-routing.js
(function () {
    "use strict";

    angular
        .module("DemoApp")
        .config(
            ["$locationProvider", "$routeProvider",
                function ($locationProvider, $routeProvider) {
                    $routeProvider
                        .when('/', {
                            templateUrl: 'templates/_main.html'
                        })
			            .when('/accordion', {
			                templateUrl: 'templates/_accordion.html'
			            })
                        .when('/dialog', {
                            templateUrl: 'templates/_dialog.html'
                        })
                        .when('/draggable', {
                            templateUrl: 'templates/_draggable.html'
                        })
                        .otherwise({
                            redirectTo: '/'
                        });

                $locationProvider.html5Mode(false);
            }]
        );
})();
///#source 1 1 /public/Content/scripts/accordion/accordionCtrl.js
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
///#source 1 1 /public/Content/scripts/dialog/dialogCtrl.js
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
///#source 1 1 /public/Content/scripts/draggable/draggableCtrl.js
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
///#source 1 1 /public/Content/scripts/nav/mainCtrl.js
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
///#source 1 1 /public/Content/scripts/nav/navCtrl.js
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
                    $rootScope.$watch(function () { return navService.selectedTab }, function (newValue) {
                        vm.selectedTab = newValue;
                    });
                };
            }]
        );
})();
///#source 1 1 /public/Content/scripts/nav/navService.js
(function () {
    "use strict";

    angular
        .module("DemoApp")
        .value("navService", {
            selectedTab: null
        });
})();
