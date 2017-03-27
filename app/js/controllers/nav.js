angular.module('app.controllers')
  .controller('NavCtrl', NavCtrl);

  /* @ngInject */
function NavCtrl($scope, $state, $resource) {
  // ViewModel
  const vm = this;
  vm.title = 'Tyrant\'s Monocle!';
  $scope.actors = ['adagio', 'celeste', 'idris', 'lyra', 'rona', 'vox', 'alpha', 'flicker', 'joule', 'ozo', 'samuel', 'ardan', 'fortress', 'kestrel', 'petal', 'saw', 'baron', 'glaive', 'koshka', 'phinn', 'skaarf', 'blackfeather', 'grumpjaw', 'krul', 'reim', 'skye', 'catherine', 'gwen', 'lance', 'ringo', 'taka'];
  $scope.loading = false;
  $scope.openMatch = function(matchId){
    $state.go('Match', {matchId: matchId});
  };

  $scope.goHome = function(){
    $state.go('Nav', {});
  };

  $scope.lookupMatchIdInput='';
  $scope.lookupPlayerIdInput='';

  $scope.input = {
    match: '',
    player: ''
  };

  $scope.lookupMatchId = function(id){
    $state.go('Match', {matchId: $scope.input.match});
  };

  $scope.lookupPlayerId = function(id){
    $state.go('Player', {playerId: $scope.input.player});
  };

  $scope.openBuild = function(actor){
    $state.go('Build', {actor: actor});
  };

  $scope.getMatches = function(){
    // var matches = $resource('/echo/json/:fakeOptionalParameter');

    var Match = $resource('http://localhost:8000/match');
    var match = new Match();
    $scope.loading = true;
    match.$get(function(response){
      $scope.loading = false;
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

    var Stats = $resource('http://localhost:8000/stats');
    var stats = new Stats();
    stats.$get(function(response){
      $scope.stats = response;
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
