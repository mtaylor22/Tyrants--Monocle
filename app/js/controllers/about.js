angular.module('app.controllers')
  .controller('AboutCtrl', AboutCtrl);

  /* @ngInject */
function AboutCtrl($scope, $state) {
  // A controller with a really easy job
  $scope.goHome = function(){
    $state.go('Nav', {});
  };
}
