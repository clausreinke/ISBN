// ISBN-based item lookup and management

angular.module('app', ['ionic'])

.controller('ISBNCtrl',function($scope,$http){

  $scope.itemFields = ["isbn","title","author","publisher","year"];

  $scope.items = {
    '0': {title:'The Title',author:'An Author'}
   ,'1': {title:'The Sequel',author:'Another Author'}
  };

  $scope.item = {isbn:9783446439412};

  $scope.message = '';

  $scope.clear = function(){
    console.log("$scope.clear");
    $scope.item = { };
  };

  $scope.lookup = function(){
    console.log("$scope.lookup");
    if ($scope.item.isbn) {
      var url = 'http://xisbn.worldcat.org/webservices/xid/isbn/'
                +$scope.item.isbn+'?method=getMetadata&format=json&fl=*&callback=JSON_CALLBACK'
      $http.jsonp(url)
           .then(function(response){
                   $scope.response=response;
                   var result = response.data.list[0];
                   $scope.itemFields.forEach(function(field){
                     $scope.item[field] = result[field];
                   });
                   $scope.message = undefined;
                 }
                ,function(response){
                   $scope.response=response;
                   $scope.message = 'lookup failed';
                 }
                );
    } else {
      $scope.message = 'no ISBN for lookup';
    }
  };

  $scope.byField = function(field,$event){
    console.log("$scope.byField",field,$scope.item);
    if (field==="isbn" && $event.which===13) {
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
