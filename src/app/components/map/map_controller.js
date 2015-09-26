angular.module('game')
  .controller('MapController', ['$scope', 'Restangular', 'socket', function ($scope, Restangular, socket) {
    var gameWatcher = $scope.$watchGroup(['player.latitude', 'player.longitude'], function (coords) {
      Restangular.one('game').get({ latitude: coords[0], longitude: coords[1] }).then(function (data) {
        $scope.players = data.players;
        $scope.buildings = data.estates;

        socket.on('user location changed', function (data) {
          $scope.$broadcast('user-moved', data.user);
        });
      });

      gameWatcher();
    });
  }]);