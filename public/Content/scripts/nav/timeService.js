(function() {
    "use strict";

    angular
        .module("DemoApp")
        .factory("timeService",
            ["$http",
            function($http) {
                return {
                    getLocalTime: function() {
                        return $http.get("/jquing/time/local-time");
                    }
                }
            }]
        );
})();