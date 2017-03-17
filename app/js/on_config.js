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
    .state('Home', {
      url: '/',
      controller: 'SplashCtrl as splash',
      templateUrl: 'splash.html',
      title: 'Splash'
    })
    .state('Nav', {
      url: '/nav',
      controller: 'NavCtrl',
      templateUrl: 'nav.html',
      title: 'Nav'
    });

  $urlRouterProvider.otherwise('/');

}

export default OnConfig;
