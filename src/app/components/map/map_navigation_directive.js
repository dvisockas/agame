angular.module('game')
  .directive('mapNavigation', ['$window', '$swipe', 'Restangular', function ($window, $swipe, Restangular) {
    return {
      scope: {
        player: '=',
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
            var startX = coords.x;
            var pointX = coords.y;
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
          delete $scope.estateTypes;

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
            console.log(Restangular.stripRestangular(boughtEstate))
            angular.forEach(Restangular.stripRestangular(boughtEstate), function (val, prop) {
              estate[prop] = val;
            });
            console.log(estate)

            $scope.player.gold -= estateType.cost;

            delete $scope.estateTypes;
          });
        };

        $scope.canAfford = function (estate) {
          return $scope.player.gold >= estate.cost;
        };
      }
    }
  }
]);
