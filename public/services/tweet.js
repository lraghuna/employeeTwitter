angular.module('MyApp')
    .factory('Tweet', ['$resource', function($resource) {
        return $resource('/api/tweets/:id', {}, {get: {method:'GET',isArray:true}});
    }]);