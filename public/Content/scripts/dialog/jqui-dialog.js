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