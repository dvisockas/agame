angular.module('game')
  .directive('mapNavigation', ['$window', '$swipe', 'Restangular', 'socket', '$timeout', function ($window, $swipe, Restangular, socket, $timeout) {
    return {
      scope: {
        player: '='
      },
      restrict: 'E',

      templateUrl: 'app/components/map/map_navigation.html',
      link: function ($scope, $elem, attrs) {
        $scope.actions = {
          inviteSent: false,
          challenged: false,
          fighting: false,
          declined: false
        }

        $scope.attack = function(estate) {
          alert("O, koks mandras!");
        };

        $scope.cancel = function() {
          $scope.options = [];
          $scope.object = {};
        };

        $scope.attackUser = function (user) {
          socket.emit('rps send invite', user);
          $scope.actions.inviteSent = true;
          $scope.challenger = user;
        };

        socket.on('rps get invite', function (data) {
          if ($scope.player.id === data.user.id) {
            $scope.actions.challenged = true;
            $scope.challenger = data.attacker;
            $scope.object = data.attacker;
          }
        });

        socket.on('rps responded invite', function (data) {
          if ($scope.player.id === data.user.id) {
            if (data.accepted) {
              $scope.actions.fighting = true;
            } else {
              $scope.message = 'your opponent is a pussy';

              delete $scope.userResponse;
              delete $scope.opponentAction;
              delete $scope.challenger;
              $scope.actions.fighting = false;
              $scope.actions.inviteSent = false;
              $scope.actions.challenged = false;

              $timeout(function () { delete $scope.message; }, 5000);
            }
          }
        });

        $scope.fightBack = function (action) {
          $scope.userResponse = action;
          socket.emit('rps action', {user: $scope.player, action: action});

          console.log('I fight!')
          console.log('my response: ' + $scope.userResponse)
          console.log('opponent: ' + $scope.oppenentAction)
          if ($scope.opponentAction) {
            whoWon(action, $scope.opponentAction);

            delete $scope.userResponse;
            delete $scope.opponentAction;
            delete $scope.challenger;
            $scope.actions.fighting = false;
            $scope.actions.inviteSent = false;
            $scope.actions.challenged = false;
          }
        };

        socket.on('rps responded action', function (data) {
          if ($scope.challenger.id === data.user.id) {
            console.log('opponent responded')
            console.log('my response: ' + $scope.userResponse)
            console.log('opponent: ' + $scope.oppenentAction)
            if ($scope.userResponse) {
              whoWon($scope.userResponse, data.action);

              delete $scope.userResponse;
              delete $scope.opponentAction;
              delete $scope.challenger;
              $scope.actions.fighting = false;
              $scope.actions.inviteSent = false;
              $scope.actions.challenged = false;
            } else {
              $scope.opponentAction = data.action;
            }
          }
        });

        var whoWon = function(action1, action2) {
            if (action1 == action2) {
              $scope.message = "It's a fucking tie";
            } else if (
              action1 == 1 && action2 == 3 ||
              action1 == 3 && action2 == 2 ||
              action1 == 2 && action2 == 1
            ) {
              $scope.message = 'You won!';
              // Restangular.all('players').customOperation('patch', 'attack', {
              //   attack: {
              //     winner_id: $scope.player.id,
              //     loser_id: $scope.challenger.id
              //   }
              // }).then(function (data) {
              //   console.log(data)
              // })
            } else {
              $scope.message = 'You lost..';
              // Restangular.all('players').customOperation('patch', 'attack', {
              //   attack: {
              //     loser_id: $scope.player.id,
              //     winner_id: $scope.challenger.id
              //   }
              // }).then(function (data) {
              //   console.log(data)
              // })
            }
            // $scope.object = {};

            $timeout(function () {
              delete $scope.message;
            }, 5000)
        }

        $scope.respondToChallenge = function (accepted) {
          socket.emit('rps response invite', {user: $scope.challenger, accepted: accepted});
          if (accepted) {
            $scope.actions.fighting = true;
          } else {
            $scope.message = 'pussy';

            delete $scope.userResponse;
            delete $scope.opponentAction;
            delete $scope.challenger;
            $scope.actions.fighting = false;
            $scope.actions.inviteSent = false;
            $scope.actions.challenged = false;

            $timeout(function () { delete $scope.message; }, 5000);
          }
        };

        $scope.nearby = function(obj) {
          return distance(obj.latitude, obj.longitude, $scope.player.latitude, $scope.player.longitude) < 0.12;
        };

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
            angular.forEach(boughtEstate, function (val, prop) {
              estate[prop] = val;
            });

            delete $scope.estateTypes;
          });
        };

        $scope.canAfford = function (estate) {
          return $scope.player.gold >= estate.cost;
        };

        function distance(lat1, lon1, lat2, lon2) {
          var radlat1 = Math.PI * lat1/180
          var radlat2 = Math.PI * lat2/180
          var radlon1 = Math.PI * lon1/180
          var radlon2 = Math.PI * lon2/180
          var theta = lon1-lon2
          var radtheta = Math.PI * theta/180
          var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          dist = Math.acos(dist)
          dist = dist * 180/Math.PI
          dist = dist * 60 * 1.1515
          dist = dist * 1.609344
          return dist
        }
      }
    }
  }
]);
