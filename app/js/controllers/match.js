angular.module('app.controllers')
  .controller('MatchCtrl', MatchCtrl);

  /* @ngInject */
function MatchCtrl($scope, $stateParams, $resource) {
  // ViewModel
  const vm = this;
  vm.title = 'Tyrant\'s Monocle!';
  $scope.actors = ['adagio', 'celeste', 'idris', 'lyra', 'rona', 'vox', 'alpha', 'flicker', 'joule', 'ozo', 'samuel', 'ardan', 'fortress', 'kestrel', 'petal', 'saw', 'baron', 'glaive', 'koshka', 'phinn', 'skaarf', 'blackfeather', 'grumpjaw', 'krul', 'reim', 'skye', 'catherine', 'gwen', 'lance', 'ringo', 'taka'];
  var matchId = $stateParams.matchId;
  $scope.getMatches = function(){
    var Match = $resource('http://localhost:8000/match/:matchId');
    var match = new Match();
    match.$get({matchId: matchId}, function(response){
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
          matches: response.matches,
          prediction: response.prediction,
          prettyPrediction: {
            a: Math.floor(response.prediction.a * 10000)/100,
            b: Math.floor(response.prediction.b * 10000)/100
          }
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
}

function getGameMode(gameMode){
  if (/blitz/.test(gameMode)) return 'Blitz';
  if (/casual/.test(gameMode)) return 'Casual';
  if (/ranked/.test(gameMode)) return 'Ranked';
  return gameMode;
}
