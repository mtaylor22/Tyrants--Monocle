angular.module('app.controllers', [])
  .controller('NavCtrl', NavCtrl);

/* @ngInject */
function NavCtrl() {
  // ViewModel
  const vm = this;
  vm.title = 'Tyrant\'s Monocle!';

}
