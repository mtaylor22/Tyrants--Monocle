function OnConfig($stateProvider, $locationProvider, $urlRouterProvider, $compileProvider) {
  'ngInject';

  if (process.env.NODE_ENV === 'production') {
    $compileProvider.debugInfoEnabled(false);
  }

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $stateProvider
    .state('Nav', {
      url: '/',
      controller: 'NavCtrl',
      templateUrl: 'nav.html',
      title: 'Nav'
    })
    .state('About', {
      url: '/about',
      controller: 'AboutCtrl',
      templateUrl: 'about.html',
      title: 'About'
    })
    .state('Build', {
      url: '/build?actor',
      controller: 'BuildCtrl',
      templateUrl: 'build.html',
      title: 'Build'
    })
    .state('Match', {
      url: '/match/:matchId',
      controller: 'MatchCtrl',
      templateUrl: 'match.html',
      title: 'Match'
    })
    .state('Player', {
      url: '/player/:playerId',
      controller: 'PlayerCtrl',
      templateUrl: 'player.html',
      title: 'Player'
    });

  $urlRouterProvider.otherwise('/');

}

export default OnConfig;
