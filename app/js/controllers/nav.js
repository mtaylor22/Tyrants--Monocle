angular.module('app.controllers')
  .controller('NavCtrl', NavCtrl);

  /* @ngInject */
function NavCtrl($scope, $state, $resource) {
  // ViewModel
  const vm = this;
  vm.title = 'Tyrant\'s Monocle!';
  $scope.actors = ['adagio', 'celeste', 'idris', 'lyra', 'rona', 'vox', 'alpha', 'flicker', 'joule', 'ozo', 'samuel', 'ardan', 'fortress', 'kestrel', 'petal', 'saw', 'baron', 'glaive', 'koshka', 'phinn', 'skaarf', 'blackfeather', 'grumpjaw', 'krul', 'reim', 'skye', 'catherine', 'gwen', 'lance', 'ringo', 'taka'];

  $scope.openMatch = function(matchId){
    $state.go('Match', {matchId: matchId});
  };

  $scope.lookupMatchId = function(){
    $state.go('Match', {matchId: $scope.lookupMatchIdInput});
  };

  $scope.lookupPlayerId = function(){
    $state.go('Player', {playerId: $scope.lookupPlayerIdInput});
  };

  $scope.getMatches = function(){
    // var matches = $resource('/echo/json/:fakeOptionalParameter');

    var Match = $resource('http://localhost:8000/match');
    var match = new Match();
    match.$get(function(response){
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
          startedAgo:moment().diff(moment(match.started), 'minutes')
        };
      });
    });
  };
  $scope.getMatches();
}

function getGameMode(gameMode){
  if (/blitz/.test(gameMode)) return 'Blitz';
  if (/casual/.test(gameMode)) return 'Casual';
  if (/ranked/.test(gameMode)) return 'Ranked';
  return gameMode;
}
