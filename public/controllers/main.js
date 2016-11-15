angular.module('MyApp')
    .controller('MainCtrl', ['$scope', '$routeParams', 'Tweet', function($scope, $routeParams,  Tweet) {

        $scope.headingTitle = 'Top tweets from your followers';

        var tweets = Tweet.get({ id: $routeParams.id }, function() {
            console.log(tweets);
            $scope.tweets = tweets;
        });

    }]);