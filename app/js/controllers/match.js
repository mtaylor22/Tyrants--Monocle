angular.module('app.controllers')
  .controller('MatchCtrl', MatchCtrl);

  /* @ngInject */
function MatchCtrl($scope, $stateParams, $state, $resource) {
  // ViewModel
  const vm = this;
  $scope.Math = window.Math; // Provide JS Math

  vm.title = 'Tyrant\'s Monocle!';
  $scope.actors = ['adagio', 'celeste', 'idris', 'lyra', 'rona', 'vox', 'alpha', 'flicker', 'joule', 'ozo', 'samuel', 'ardan', 'fortress', 'kestrel', 'petal', 'saw', 'baron', 'glaive', 'koshka', 'phinn', 'skaarf', 'blackfeather', 'grumpjaw', 'krul', 'reim', 'skye', 'catherine', 'gwen', 'lance', 'ringo', 'taka'];
  var matchId = $stateParams.matchId;
  $scope.loading = false;
  $scope.goHome = function(){
    $state.go('Nav', {});
  };
  $scope.getMatches = function(){
    var Match = $resource('http://localhost:8000/match/:matchId');
    var match = new Match();
    $scope.loading = true;
    match.$get({matchId: matchId}, function(response){
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
          winner: (match.teams[0].won) ? 0: 1,
          startedAgo:moment().diff(moment(match.started), 'minutes'),
          matches: response.matches,
          prediction: response.prediction,
          prettyPrediction: {
            a: Math.floor(response.prediction.a * 10000)/100,
            b: Math.floor(response.prediction.b * 10000)/100
          },
          insights: _.keyBy(_.flatten(response.insights), 'actor')
        };
      });
      $scope.players = {};
      _.each(response.matches[0].teams, function(team){
          _.each(team.players, function (player) {
            $scope.players[player.player] = player;
          });
      });
      var firstPlayer = Object.keys($scope.players)[0];
      // $scope.selectedPlayer = $scope.players[firstPlayer];
      $scope.selectPlayer(firstPlayer);
    });

  };
  $scope.getMatches();
  $scope.validInsightCount = 0;
  $scope.selectPlayer = function(player){
    $scope.selectedPlayer = $scope.players[player];
    $scope.validInsightCount = 0;
    $scope.matches[0].insights[$scope.selectedPlayer.actor].insights.forEach(function(insight){
      if (insight.impact > 1) $scope.validInsightCount++;
    });
  };

  $scope.heroTips = {
    '*Adagio*': 'Typically used as a jungler or protector, I usually use adagio completely as a support character, however, it has been noted that adagio can be a weak support for various reasons. He is not quite as tanky as phinn, so he pairs better with tankier junglers. Adagio’s stun radius is huge, but slow, so be sure to use it wisely!',
    '*Alpha*': 'Alpha is a great jungler whose recommended build is weapon power. Though this build is effective, I tend to prefer to build alpha using crystal power to rely on her deadly A and B abilities. Nothing quite like catching a fleeing enemy hero with her A ability to secure the kill!',
    '*Ardan*': 'Ardan\'s C ability can really be a game changer. If used with the right build, he can secure a huge amount of damage to enemy heroes that try to get out of the gauntlet along with a great stun that gives your laner and jungler a chance to secure those last hits. I play Ardan solely as a support character, but I\'ve seen some fantastic players using weapon power during battle royales that are nothing short of formidable!',
    '*Baron*': 'A great character for the lane, Baron’s A ability was given a great amount of range that I would argue out matches that of some of vainglory’s best snipers. The only downfall to playing as baron is that the B ability is very slow to launch and he can easily be caught when fleeing from enemy heroes. If you are playing as baron, be sure to stand back behind your jungler and support to safely snipe your way to victory!',
    '*Blackfeather*': 'While blackfeather is advertised to be a lane character, I find his close combat skills to be more fitting in the jungle. His C ability helps with quick escapes or capturing enemy heroes as they run away. For blackfeather, I prefer a weapon power build with some lifesteal, as you are bound to be in very close quarters with enemy heroes that want to focus on you. If you learn to use that B ability to focus on the maximum amount of heroes, you have a great chance of solidifying the win!',
    '*Catherine*': 'Catherine is easily my favorite support character, boasting both a stun ability and shielding effect. I use her solely as support, but many in battle royales other players have used a weapon power build that is as unexpected as it is effective. She has natural tankiness that makes her a great support, so choose your build wisely!',
    '*Celeste*': 'Celeste is wonderful in both lane and jungle, even though she is marketed as a lane character. I say this because she can easily find hiding opponents in bushes using her A ability and can attack them unexpectedly as they are doing their shopping in the jungle. For Celeste, I would only focus crystal power so that her snipes are the most effective!',
    '*Flicker*': 'Team invisibility is a great feature that can turn the tides of a match very quickly. I use flicker solely as a support character and I use my B ability to slow running enemy characters so that my lane and jungle characters can chase them down for the kill. When not building support, weapon power flicker has worked surprisingly well in battle royales in my experience. When using taka, kestrel, and flicker, there is no limit to the amount of trolling you can do in game! ',
    '*Fortress*': 'Fortress is a lot of fun to play because he is a very fast support character. Not burdened in an escape like phinn, fortress can run out of a losing team fight to avoid an ace. Fortress’s C ability is very useful, especially against any team invisible heroes. I play fortress solely as a support character, but I will sometimes build more crystal power items in quicker games like battle royales!',
    '*Glaive*': 'Playing with glaive is a lot of fun, but can be dangerous when on an enemy team. In my experience, the more tornado triggers I have, the more likely I am to be victorious! While that sounds like bad advice, the more of glaive’s strong hits you can secure on an enemy hero, the higher the likelihood that you are going to out power them. However, if you are pitted against a character like taka or koshka, be sure to have a good escape route handy!',
    '*Grumpjaw*': 'Weapon power is a great build for grumpjaw because the more basic attacks you make, the harder you are to kill. You have already probably noticed, but using a combination of your C and A abilities, you can drag enemies to your turrets, causing mass damage as they try to get away from their devastating firepower. Be sure to get those armor stacks so you can get away to safely deposit the enemy hero with as little damage as possible!',
    '*Gwen*': 'A fierce laner, Gwen is a sniper that rivals ringo very easily. I play her mostly with weapon power builds, but those better with crystal power can find solace in the fact that she is equally dangerous in both builds. Practice with her C ability can really affect your gameplay in any match!',
    '*Idris*': 'Idris is known to be a very good jungle character, but if enough crystal power items are built, I\'ve found he is just as effective in the lane. I\'ve used both weapon and crystal builds, but I personally prefer the crystal power due to the heightened range of basic attacks and the neat tricks you can do using your abilities. Even though these might just seem like neat tricks, it really is no joke when idris’s chakram hits an enemy character like five times!',
    '*Joule*': 'The C ability on joule can really be the bane of any fleeing enemy’s existence. The recommended build for joule tends to focus weapon power, but as your skill using joule rises, I would recommend trying a few crystal power builds. The more you practice with joule’s A stun, the more likely you are to change the outcome of your match!',
    '*Kestrel*': 'This member of team invisible really has it all. A combo of B and then A abilities can land a team fight changing stun on enemy characters, which is most effective when building crystal power. I\'ve used both crystal and weapon power builds on kestrel, but I tend to prefer crystal power depending on the match. Be sure you practice quite a bit with kestrel’s ultimate so you can not only deal fatal damage to enemy characters as they try to escape, but to also troll snipe a last hit on a kraken once or twice!',
    '*Koshka*': 'Because koshka is such a fast character, it is very easy to deal loads of damage then escape to safety as enemies begin to chase you down. Leading these enemies to your allies lying in wait can be a fun ambush for you to use in game. The only builds I use for koshka are crystal builds as I solely rely on her get in: get out strategy!',
    '*Krul*': 'Krul is a great character to use in long term strategies because he is able to solo the gold mine and the kraken fairly easily, however, he can be quickly taken down in an ambush and is focused on because of these dangerous lifesteal abilities. Krul is very slow, so you have to be sure you have a safe attack before moving into the fray. Both weapon power and crystal power builds are great, but I usually use a mix of both. Attack speed is krul’s best friend!',
    '*Lance*': 'Lance is an awesome support character that uses tactics that push enemies away rather than bringing them in closer. He is best used on a team that is going to need an escape route. However, if you use lance’s C ability to roll behind enemies then his B ability to push them forward, you can have a different effect as a support!',
    '*Lyra*': 'For Lyra\'s builds I\'ll usually use a mix of support items and crystal power items, even though I use her primarily as support. In some cases, I have seen players use Lyra’s A ability as mostly an attack against enemy players, but I recommend using it more as a heal for your allies, especially because it grants the speed boost at the end of its term. Great Lyra players also try to focus the C ability to catch enemies in a loop when making an escape. Practice with lyra’s C ability and you will make a great escape artist in no time!',
    '*Ozo*': 'Ozo is a character I use with the get in -get out method. He deals a lot of damage when building crystal power, but waiting for those abilities to respawn can be a bit of a pain. For ozo, I build solely crystal power with lifesteal and regeneration items. Ozo can be a very difficult player to learn, but a devastating character when mastered!',
    '*Petal*': 'Petal is a great jungler and not very good in the lane. When using a high crystal power build, the minions chasing down enemy heroes combined with the C ability can destroy them in three hits! Petal is a fantastic hero to use when mastered, but getting that C ability to work may cause some trouble for beginners. Remember, you must have locked in an enemy for your minions to chase them! I always build petal as crystal power, but I have seen a few weapon power builds that were also effective. Whenever I play as petal, I always spawn my first three minions in the home base area so I waste as little energy as possible at the beginning of the match!',
    '*Phinn*': 'This hero is the king of tanking! His defense is naturally very high, so using lots of support items can make him virtually invincible. A well placed drag with your C ability and stun with your A ability can cause enemy heroes to be finished off by your turrets as well. Phinn’s only downfall is that he is extremely slow, but combined with the fact that he has the tankiest nature in the game, his ability to survive enemy attacks is extremely high. Remember to use your B ability when your nearby allies are low on health!',
    '*Reim*': 'Reim is one of the few characters that can safely face off in a 1v1 interaction with Krul! An accurate combination of his A then B ability can root characters for long enough to deal quite a bit of damage from a distance when building crystal power. Rein is difficult to use in close combat, so I only use crystal power when playing as this hero. I find that most of my victories are achieved through persistence when pursuing enemy heroes and strategic use of my abilities!',
    '*Ringo*': 'Ringo is an awesome sniper that tends to get high kill counts in every game, but he has a great weakness in lack of defense. Ringo is very good with both crystal and weapon power, but I mostly build weapon power. I also like to have plenty of attack speed on hand to get in the most damage before enemy heroes can get close to me. Stacking damage is also great in this instance! ',
    '*Rona*': 'Rona is a fantastic hero if you like to jump into the fray of a team fight and deal loads of damage. I find the most success lies in rona’s weapon power build, but if you intend to use the C ability to its greatest extent, then crystal power would be the best for you! Weapon power Rona can deal mad hits whenever complimented by her B ability. If you choose to build weapon power, I recommend using a lifesteal item!',
    '*Samuel*': 'I always say that a good Samuel never dies! Samuel’s natural lifesteal abilities from his basic attacks or a well placed B and A ability combo make him very difficult to kill. I recommend only a crystal build for Samuel and lots of practice with dealing the A ability during retreats. Regeneration items in this case are crucial to ensure you can deal the highest amount of crystal damage in these instances.',
    '*SAW*': 'Saw is one of the most formidable characters in the lane due to his range and insane amount of natural damage. A weapon or crystal power saw can be equally dangerous to enemy characters, but I find crystal power to be the most fun build! Nothing quite like having a shatterglass then using the A ability to run up and kill a fleeing enemy!',
    '*Skaarf*': 'Leaving flaming goo strategically can really cause enemies to fall back when they would otherwise be chasing you. Learning where to aim your A ability is essential to mastering skaarf, although he tends to be one of the best characters to use if you are just beginning. Skaarf’s best build is through crystal power. Be sure to build a broken myth to cut through enemy defenses!',
    '*Skye*': 'Skye is easily regarded as one of the most difficult heroes to use in vainglory. Her A ability tears through the lane and being equipped with a frostburn can make her detrimental to any enemy character in her line of fire. Learning how to best use her abilities can make you skate across the map with ease as you land hits on slower enemy characters or flee the scene through walls if you\'re caught in the jungle during a losing team fight. I have seen a few great weapon power builds, but she is definitely most effective with crystal power!',
    '*Taka*': 'Taka is a damage dealing escape artist that resides in the jungle. I have found that for longer matches, I prefer a crystal power build, but if you master the art of side stepping, his weapon power build can also be super effective. Farming is taka’s main objective, because the sooner you are able to build those items, the harder you are to catch!',
    '*Vox*': 'Any great vox player is insane as a laner. I believe that most people like to use crystal power vox, but I believe that weapon power vox is just as good. Either way, building items with higher damage and stacks tend to be ideal. Be sure to use vox’s B ability when the maximum amount of enemy heroes are close to ensure the damage you deal is used to its fullest extent!'
  };

}

function getGameMode(gameMode){
  if (/blitz/.test(gameMode)) return 'Blitz';
  if (/casual/.test(gameMode)) return 'Casual';
  if (/ranked/.test(gameMode)) return 'Ranked';
  return gameMode;
}
