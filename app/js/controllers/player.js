angular.module('app.controllers')
  .controller('PlayerCtrl', PlayerCtrl);

  /* @ngInject */
function PlayerCtrl($scope, $stateParams, $state, $resource) {
  // ViewModel
  const vm = this;
  vm.title = 'Tyrant\'s Monocle!';
  $scope.actors = ['adagio', 'celeste', 'idris', 'lyra', 'rona', 'vox', 'alpha', 'flicker', 'joule', 'ozo', 'samuel', 'ardan', 'fortress', 'kestrel', 'petal', 'saw', 'baron', 'glaive', 'koshka', 'phinn', 'skaarf', 'blackfeather', 'grumpjaw', 'krul', 'reim', 'skye', 'catherine', 'gwen', 'lance', 'ringo', 'taka'];
  var playerId = $stateParams.playerId;
  $scope.getMatches = function(){
    var Match = $resource('http://localhost:8000/player/:playerId');
    var match = new Match();
    match.$get({playerId: playerId}, function(response){
      $scope.matches = _.map(response.matches, function(match){
        // teams =>
        return {
          players: _.map(match.teams, function(team){
            return _.map(team.players, function(player){
              return {
                actor: player.actor,
                player: player.player
              }
            });
          }),
          id: match.id,
          mode: getGameMode(match.gameMode),
          start: match.started,
          winner: (match.teams[0].won) ? 0: 1,
          startedAgo:moment().diff(moment(match.started), 'minutes'),
          matches: response.matches
        };
      });
      $scope.players = {};
      _.each(response.matches[0].teams, function(team){
          _.each(team.players, function (player) {
            $scope.players[player.actor] = player;
          });
      });
      var firstPlayer = Object.keys($scope.players)[0];
      $scope.selectedPlayer = $scope.players[firstPlayer];
    });

  };
  $scope.getMatches();
  $scope.selectPlayer = function(actor){
    $scope.selectedPlayer = $scope.players[actor];
  };

  $scope.openMatch = function(matchId){
    $state.go('Match', {matchId: matchId});
  };

}

function getGameMode(gameMode){
  if (/blitz/.test(gameMode)) return 'Blitz';
  if (/casual/.test(gameMode)) return 'Casual';
  if (/ranked/.test(gameMode)) return 'Ranked';
  return gameMode;
}
