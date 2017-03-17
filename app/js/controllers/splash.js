angular.module('app.controllers')
  .controller('SplashCtrl', SplashCtrl);

/* @ngInject */
function SplashCtrl() {
  // ViewModel
  const vm = this;
  vm.title = 'Tyrant\'s Monocle!';

}
