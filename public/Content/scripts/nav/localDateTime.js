(function () {
    "use strict";

    angular
        .module("DemoApp")
        .directive("localDatetime",
            ["$compile", "$interval", "$parse", "$timeout",  "timeService",
            function ($compile, $interval, $parse, $timeout, timeService) {

                // Private Variables
                var linkFn;
                var rootScope;
                var targetElement;

                // Call the time service and update the DOM.
                function update() {
                    timeService.getLocalTime().then(function (results) {
                        var date;
                        var datetime;
                        var day;
                        var isPM;
                        var scope;
                        var time;
                        var month;

                        // Build a new (isolated) scope and fill it in with data from the service call.

                        datetime = results.data;
                        date = datetime.date;
                        month = date.month;
                        scope = rootScope.$new(true);
                        scope.month = month.ordinal;
                        scope.longMonthName = month.longDisplayName;
                        scope.shortMonthName = month.shortDisplayName;

                        day = date.day;
                        scope.day = day.ordinal;
                        scope.longDayName = day.longDisplayName;
                        scope.shortDayName = day.shortDisplayName;

                        scope.year = date.year;

                        time = datetime.time;
                        isPM = (time.meridiem === "post");
                        scope.hour12 = time.hour - (isPM ? 12 : 0);
                        scope.hour24 = time.hour;
                        scope.minute = time.minute;
                        scope.second = time.second;
                        scope.meridiem = isPM ? "PM" : "AM";

                        // Apply the scope to the compiled template.
                        var newElement = linkFn(scope);

                        // Replace the original (or the last replaced) element with the new element.
                        targetElement.replaceWith(newElement);

                        // Ensure that no CSS is hiding the element.
                        targetElement.css("display", "block");
                        targetElement.css("visibility", "visible");

                        // Set the target to the new element so that the next call to update will work.
                        targetElement = newElement;

                        // The interpolation will not complete until the next digest cycle.  Schedule it.
                        $timeout(function() { scope.$apply(); });
                    });
                }

                return {
                    restrict: "E",
                    link: function (scope, element, attrs) {
                        var interval;
                        var templateElement;

                        // Because we are replacing the entire element,
                        // doing so causes a reentry of the directive.
                        // This line will only allow the directive to run once.
                        if (targetElement)
                            return;

                        targetElement = element;

                        // Use the inner HTML of the element as the template.
                        // The link function will remain unchanged throughout the lifetime of the directive.
                        templateElement = angular.element(element);
                        linkFn = $compile(templateElement);

                        // Get the rootscope from the current scope.
                        // If the directive is used within the root scope,
                        // then scope is the rootscope and has no $root property.
                        rootScope = scope.$root || scope;

                        update();

                        // If an interval is specified either in an interpolation or model reference,
                        // set up an interval that will call update() periodically.
                        if (attrs.intervalInSeconds) {
                            attrs.$observe("intervalInSeconds", function(value) {
                                interval = 1000 * scope.$eval(value);
                                if (interval)
                                    $interval(update, interval);
                            });

                            scope.$watch($parse(attrs.intervalInSeconds), function(newValue) {
                                interval = 1000 * newValue;
                                if (interval)
                                    $interval(update, interval);
                            });
                        }
                    }
                };
            }]
        );
})();