angular.module('app.controllers')
  .controller('BuildCtrl', BuildCtrl);

  /* @ngInject */
function BuildCtrl($scope, ngDialog, $resource) {
  // ViewModel
  const vm = this;
  $scope.Math = window.Math; // Provide JS Math

  vm.title = 'Tyrant\'s Monocle!';
  $scope.actors = ['adagio', 'celeste', 'idris', 'lyra', 'rona', 'vox', 'alpha', 'flicker', 'joule', 'ozo', 'samuel', 'ardan', 'fortress', 'kestrel', 'petal', 'saw', 'baron', 'glaive', 'koshka', 'phinn', 'skaarf', 'blackfeather', 'grumpjaw', 'krul', 'reim', 'skye', 'catherine', 'gwen', 'lance', 'ringo', 'taka'];
  $scope.teams = {
    a: {
      actors: [null, null, null]
    },
    b: {
      actors: [null, null, null]
    }
  };
  $scope.matchType = 'casual';
  $scope.updateMatchType = function(matchType){
    $scope.matchType = matchType;
  };

  $scope.selectionIndex = null;

  $scope.clickToOpen = function (index) {
    $scope.selectionIndex = index;
    ngDialog.open({ template: 'playerSelector.html', className: 'ngdialog-theme-default', scope: $scope });
  };

  $scope.closePlayerSelection = function(player){
    $scope.teams[($scope.selectionIndex >= 3) ? 'b' : 'a'].actors[($scope.selectionIndex >= 3) ? $scope.selectionIndex-3 : $scope.selectionIndex] =
      {actor: player, stats: {
          'kills': 0,
          'deaths': 0,
          'assists': 0,
          'turretCaptures': 0,
          'skillTier': 0,
          'nonJungleMinionKills': 0,
          'minionKills': 0,
          'level': 0,
          'krakenCaptures': 0,
          'karmaLevel': 0,
          'jungleKills': 0,
          'goldMineCaptures': 0,
          'farm': 0,
          'crystalMineCaptures': 0
        }
      };
    $scope.selectActor(player, $scope.selectionIndex);
    $scope.selectionIndex = null;
  };

  $scope.selectedActor = null;
  $scope.selectedActorIndex = null;
  $scope.selectActor = function(actor, index){
    $scope.selectedActor = actor;
    $scope.selectedActorIndex = index;
  };

  $scope.$watch('teams', function(newVal, oldVal){
    if ($scope.isPredictionEligible())
      $scope.buildMatch();
  }, true);


  $scope.isPredictionEligible = function(){
    //There must be at least one player for each team

    var aReady = false, bReady = false;
    $scope.teams.a.actors.forEach(function(actor){
      if (actor) aReady = true;
    });
    $scope.teams.b.actors.forEach(function(actor){
      if (actor) bReady = true;
    });
    return aReady && bReady;
  };

  $scope.buildMatch = function(){
    var gameMode = 'casual';

    switch ($scope.matchType){
      case 'blitz':
        gameMode = 'blitz_pvp_ranked';
        break;
      case 'ranked':
        gameMode = 'ranked';
        break;
      case 'casual':
      default:
        break;
    }

    var match = {
      gameMode: gameMode,
      started: (new Date()).toISOString(),
      duration: 125,
      teams: [
        {
          players: []
        },
        {
          players: []
        }
      ]
    };

    $scope.teams.a.actors.forEach(function(actor){
      if (!actor) return;
      var actorName = actor.actor.toLowerCase();
      var hero = vgLookupReverse.heroes[actorName.capitalize()];
      match.teams[0].players.push({
        actor: hero,
        stats: actor.stats
      });
    });

    $scope.teams.b.actors.forEach(function(actor){
      if (!actor) return;
      var actorName = actor.actor.toLowerCase();
      var hero = vgLookupReverse.heroes[actorName.capitalize()];
      match.teams[1].players.push({
        actor: hero,
        stats: actor.stats
      });
    });


      var Prediction = $resource('http://localhost:8000/predict', {
        'save': {method: 'POST'}
      });
      var prediction = new Prediction();
      prediction.match = match;
      prediction.$save(function(response){
        $scope.prediction = {
          a: Math.floor(response.prediction.a * 10000)/100,
          b: Math.floor(response.prediction.b * 10000)/100
        };
      });

    console.log("Match: "+JSON.stringify(match));

  };
}

// function getGameMode(gameMode){
//   if (/blitz/.test(gameMode)) return 'Blitz';
//   if (/casual/.test(gameMode)) return 'Casual';
//   if (/ranked/.test(gameMode)) return 'Ranked';
//   return gameMode;
// }

// Borrowed from https://docs.schneefux.xyz/python-gamelocker/_modules/gamelocker/strings.html
const vgLookupReverse = {
  'heroes': {
    'Adagio': '*Adagio*',
    'Alpha': '*Alpha*',
    'Ardan': '*Ardan*',
    'Baron': '*Baron*',
    'Blackfeather': '*Blackfeather*',
    'Catherine': '*Catherine*',
    'Celeste': '*Celeste*',
    'Flicker': '*Flicker*',
    'Fortress': '*Fortress*',
    'Glaive': '*Glaive*',
    'Grumpjaw': '*Grumpjaw*',
    'Gwen': '*Gwen*',
    'Krul': '*Krul*',
    'Skaarf': '*Skaarf*',
    'Rona': '*Hero016*',
    'Idris': '*Idris*',
    'Joule': '*Joule*',
    'Kestrel': '*Kestrel*',
    'Koshka': '*Koshka*',
    'Lance': '*Lance*',
    'Lyra': '*Lyra*',
    'Ozo': '*Ozo*',
    'Petal': '*Petal*',
    'Phinn': '*Phinn*',
    'Reim': '*Reim*',
    'Ringo': '*Ringo*',
    'Samuel': '*Samuel*',
    'Saw': '*SAW*',
    'Taka': '*Taka*',
    'Skye': '*Skye*',
    'Vox': '*Vox*'
  }
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
