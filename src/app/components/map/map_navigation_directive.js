angular.module('game')
  .directive('mapNavigation', ['$window', '$swipe', 'Restangular', function ($window, $swipe, Restangular) {
    return {
      scope: {
        player: '=',
        buildings: '='
      }, // {} = isolate, true = child, false/undefined = no change
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      templateUrl: 'app/components/map/map_navigation.html',
      link: function ($scope, $elem, attrs) {
        $scope.attack = function(estate) {
          alert("O, koks mandras!");
        };

        var delta;
        $swipe.bind($elem, {
          start: function(coords) {
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
          },
          cancel: function(coords) {
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

        $scope.getEstateTypes = function (estate) {
          Restangular.one('estates', estate.id).all('estate_types').getList().then(function (types) {
            $scope.estateTypes = types;
          });
        };

        $scope.buyEstate = function (estateType, estate) {
          Restangular.one('estates', estate.id).patch({
            estate: {
              estate_type_id: estateType.id,
              player_id: $scope.player.id
            }
          }).then(function (boughtEstate) {
            var buildings = $scope.buildings;

            buildings[buildings.indexOf(estate)] = boughtEstate;
            $scope.estateTypes = [];
          });
        };

        $scope.canAfford = function (estate) {
          return $scope.player.gold >= estate.cost;
        };
      }
    }
  }
]);
