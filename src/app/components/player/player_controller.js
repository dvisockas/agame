angular.module('game')
  .controller('PlayerController', ['$scope', 'Restangular', '$window', 'localStorageService', '$state',
    function ($scope, Restangular, $window, localStorageService, $state) {
      $scope.become = function () {
        $window.navigator.geolocation.getCurrentPosition(function (data) {
          var coords = data.coords;

          ['latitude', 'longitude'].forEach(function (prop) {
            $scope.player[prop] = coords[prop];
          });

          Restangular.all('players').post({ player: $scope.player }).then(function (player) {
            localStorageService.set('player-name', player.name);

            $state.go('game');
          });
        }, $window.alert.bind($window, 'Ne tai ne.'));
      };
    }
  ]);
