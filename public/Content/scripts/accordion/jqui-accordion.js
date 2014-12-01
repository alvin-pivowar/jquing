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
                                    ngModel.$setViewValue(newModelValue);
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