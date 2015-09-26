angular.module('game')
  .directive('mapNavigation', ['$window', function ($window) {
    return {
      scope: {
      }, // {} = isolate, true = child, false/undefined = no change
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      templateUrl: 'app/components/map/map_navigation.html',
      link: function ($scope, $elem, attrs) {
        $scope.$on('clickedMarker', function(e, data) {
          $scope.questions = {};
          $scope.object = {};
          if (angular.isArray(data)) {
            $scope.options = data;
          } else {
            $scope.object = data;
          }
          $scope.$apply();
        });


      }
    }
  }
]);
