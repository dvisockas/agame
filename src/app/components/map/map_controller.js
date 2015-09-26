angular.module('game')
  .controller('MapController', ['$scope', 'Restangular', 'socket', function ($scope, Restangular, socket) {
    var gameWatcher = $scope.$watchGroup(['player.latitude', 'player.longitude'], function (coords) {
      Restangular.one('game').get({ latitude: coords[0], longitude: coords[1], distance: 0.5 }).then(function (data) {
        $scope.buildings = data.estates;
      }).then(startListening);

      gameWatcher();
    });

    function startListening () {
      socket.on('user location changed', function (data) {
        $scope.$broadcast('user-moved', data.user);
      });

      socket.on('user joined', function (user) {
        $scope.$broadcast('user-joined', user);
      });

      socket.on('user left', function (user) {
        $scope.$broadcast('user-left', user);
      });
    }
  }]);