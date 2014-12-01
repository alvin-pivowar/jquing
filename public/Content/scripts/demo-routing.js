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
                        .otherwise({
                            redirectTo: '/'
                        });

                $locationProvider.html5Mode(false);
            }]
        );
})();