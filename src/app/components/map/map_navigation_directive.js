angular.module('game')
  .directive('mapNavigation', ['$window', '$swipe', function ($window, $swipe) {
    return {
      scope: {
      }, // {} = isolate, true = child, false/undefined = no change
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      templateUrl: 'app/components/map/map_navigation.html',
      link: function ($scope, $elem, attrs) {
        var delta;
        $swipe.bind($elem, {
          'start': function(coords) {
            startX = coords.x;
            pointX = coords.y;
          },
          'move': function(coords) {
            delta = coords.x - pointX;
            $elem.children()[0].style.transform = "translate3d(" + delta + "px, 0, 0);";
          },
          'end': function(coords) {
            if (~~delta < 300) {
              $elem.children()[0].style.transform = "";
            } else {
              $scope.options = [];
              $scope.object = {};
              $scope.$apply();
            }
            console.log('ended');
          },
          'cancel': function(coords) {
            console.log('canceled');
          }
          });
        $scope.$on('clickedMarker', function(e, data) {
          $scope.options = [];
          $scope.object = {};
          if (angular.isArray(data)) {
            $scope.options = data;
          } else {
            $scope.object = data;
          }
          $scope.$apply();
        });

        $scope.setActive = function (object) {
          $scope.options = [];
          $scope.object = object;
        };


      }
    }
  }
]);
