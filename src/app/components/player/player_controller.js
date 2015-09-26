angular.module('game')
  .controller('PlayerController', ['$scope', 'Restangular', '$window', 'localStorageService', '$state',
    function ($scope, Restangular, $window, localStorageService, $state) {
      $scope.become = function () {
        $window.navigator.geolocation.getCurrentPosition(function (data) {
          var coords = data.coords;

          $scope.player.latitude = coords.latitude;
          $scope.player.longitude = coords.longitude;

          Restangular.all('players').post({ player: $scope.player }).then(function (player) {
            localStorageService.set('player-name', player.name);
            socket.on('location changed', function(data) {
              debugger;
            });

            $state.go('game');
          });
        }, $window.alert.bind($window, 'Ne tai ne.'));
      };
    }
  ]);
