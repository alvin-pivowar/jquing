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
                            var options = {};
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