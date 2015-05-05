// ISBN-based item lookup and management

angular.module('app', ['ionic'])

.controller('ISBNCtrl',function($scope){
  $scope.items = {
    '0': {title:'The Title',author:'An Author'}
   ,'1': {title:'The Sequel',author:'Another Author'}
  };

  $scope.item = {};

  $scope.clear = function(){
    console.log("$scope.clear");
    $scope.item = { isbn: '', author: '', title: ''};
  };

  $scope.lookup = function(){
    console.log("$scope.lookup");
  };

  $scope.byISBN = function($event){
    console.log("$scope.byISBN",$scope.item);
    if ($event.which===13) {
      var storedItem = $scope.items[$scope.item.isbn];
      if (storedItem) {
        console.log(storedItem);
        $scope.item.title = storedItem.title;
        $scope.item.author = storedItem.author;
      }
    }
  };

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
