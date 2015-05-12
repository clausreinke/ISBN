// ISBN-based item lookup and management

angular.module('app', ['ionic'])

.controller('ISBNCtrl',function($scope,$http){

  $scope.itemFields = ["isbn","title","author","publisher","ed","year","lang","info"];

  function copyItem(target,source) {
    $scope.itemFields.forEach(function(field){
      target[field] = source[field];
    });
    return target;
  }

  $scope.item = {isbn:9783446439412};

  $scope.message = '';

  $scope.items = {
    '0': {isbn: '0', title: 'The Title', author: 'An Author'}
   ,'1': {isbn: '1', title: 'The Sequel', author: 'Another Author'}
  };

  $scope.store = function() {
    console.log("$scope.store");
    $scope.items[$scope.item.isbn] = copyItem({},$scope.item);
  };

  $scope.clear = function(){
    console.log("$scope.clear");
    $scope.item = { };
    $scope.message = undefined;
    $scope.response = undefined;
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
                   result.isbn = $scope.item.isbn;
                   copyItem($scope.item,result);
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
    if ($event.which===13) {
      if (field==="isbn") {
        var storedItem = $scope.items[$scope.item.isbn];
        if (storedItem) {
          console.log(storedItem);
          copyItem($scope.item,storedItem);
        }
      } else {
        var filteredItem = Object.keys($scope.items)
                                 .filter(function(isbn){
                                          return $scope.items[isbn][field]
                                              && $scope.items[isbn][field].match($scope.item[field])
                                         })[0];
        console.log(field,$scope.item[field],filteredItem);
        filteredItem && copyItem($scope.item,$scope.items[filteredItem]);
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
