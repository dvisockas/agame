angular.module('game')
  .controller('MapNavigationController', ['$scope', 'Restangular', 'socket', function ($scope, Restangular, socket) {

    $scope.$on('playerClicked', function(event, data) {
      console.log(data);
    });

  }]);
