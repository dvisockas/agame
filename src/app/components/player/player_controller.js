angular.module('game')
  .controller('PlayerController', ['$scope', 'Restangular', '$window', function ($scope, Restangular, $window) {
    $scope.become = function () {
      $window.navigator.geolocation.getCurrentPosition(function () {
        Restangular.all('players').post({ player: $scope.player }).then(function () {

        });
      }, $window.alert.bind($window, 'Ne tai ne.'));
    };
  }]);