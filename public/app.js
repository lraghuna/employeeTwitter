angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute'])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/users/:id', {
                templateUrl: 'views/home.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

    }]);