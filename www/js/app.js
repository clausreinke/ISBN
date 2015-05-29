// ISBN-based item lookup and management

var db = null; // TODO: service

document.addEventListener("deviceready",function(){
  console.log("deviceready");
  navigator.splashscreen.show(); // TODO: still seeing angular templates
  angular.bootstrap(document,['app']);
});

angular.module('app', ['ionic','ngCordova'])

.constant("itemFields",["isbn","title","author","publisher","ed","year","lang","info"])

.constant("ISBNtoURL",{
  'worldcat' : function(isbn) {
    return 'http://xisbn.worldcat.org/webservices/xid/isbn/'
                +isbn+'?method=getMetadata&format=json&fl=*&callback=JSON_CALLBACK';
  }
})

.run(function($ionicPlatform,$cordovaSQLite,itemFields) {
  console.log("run"); // bootstrap after deviceready!

  // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
  // for form inputs)
  if(window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if(window.StatusBar) {
    StatusBar.styleDefault();
  }
  db = $cordovaSQLite.openDB("isbn.db");
  // $cordovaSQLite.execute(db,"DROP TABLE IF EXISTS books");
  $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS books ("
                              +itemFields.map(function(field){
                                                return field==="isbn"
                                                      ?"isbn text primary key"
                                                      :field+" text"
                                                      })
                                         .join(", ")
                              +")"); // TODO continuation?
})

.controller('ISBNCtrl',function($scope
                               ,$http
                               ,$cordovaBarcodeScanner
                               ,$cordovaSQLite
                               ,$cordovaSplashscreen
                               ,itemFields
                               ,ISBNtoURL){

  console.log("ISBNCtrl");

  // NOTE: changes here imply/require database schema migration!
  $scope.itemFields = itemFields;

  function copyItem(target,source) {
    $scope.itemFields.forEach(function(field){
      target[field] = source[field];
    });
    return target;
  }

  $scope.item = {};

  $scope.message = '';

  $scope.items = {};

  var query = "SELECT * FROM books";
  $cordovaSQLite.execute(db,query,[])
                .then(function(result){
                        $scope.response = result;
                        $scope.message = undefined;
                        if (result.rows.length>0) {
                          for (var i=0; i<result.rows.length; i++) {
                            console.log(result.rows.item(i));
                            $scope.items[result.rows.item(i).isbn] = result.rows.item(i);
                          }
                        }
                      }
                     ,function(error){
                        $scope.response = error;
                        $scope.message = "SELECT failed";
                      }
                     );

  $scope.store = function() {
    console.log("$scope.store");
    $scope.items[$scope.item.isbn] = copyItem({},$scope.item);
    var query = "REPLACE INTO books ("+itemFields.join(", ")+")"
                            +"VALUES ("+itemFields.map(function(){return "?"}).join(", ")+")";
    console.log(query);
    $cordovaSQLite.execute(db,query,itemFields.map(function(field){return $scope.item[field]}))
                  .then(function(result){
                          $scope.response = result;
                          $scope.message = undefined;
                        }
                       ,function(error){
                          $scope.response = error;
                          $scope.message = "INSERT failed";
                        }
                       );
  };

  $scope.clear = function(){
    console.log("$scope.clear");
    $scope.item = { };
    $scope.message = undefined;
    $scope.response = undefined;
  };

  $scope.scan = function() {
    $scope.clear();
    $cordovaBarcodeScanner.scan()
      .then(function(data){
              $scope.response = data;
              $scope.item.isbn = data.text;
            }
           ,function(error){
              $scope.message = error;
            });
  };

  $scope.lookup = function(){
    var isbn = $scope.item.isbn;
    console.log("$scope.lookup",isbn);

    if (isbn) {

      if ($scope.items[isbn]) {

        $scope.response = "found in local database";
        $scope.message  = undefined;
        copyItem($scope.item,$scope.items[isbn]);

      } else {

        $http.jsonp(ISBNtoURL.worldcat(isbn))
             .then(function(response){
                     $scope.response=response;
                     var result = response.data.list[0];
                     result.isbn = isbn;
                     copyItem($scope.item,result);
                     $scope.message = undefined;
                   }
                  ,function(response){
                     $scope.response=response;
                     $scope.message = 'lookup failed';
                   }
                  );

      }

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

  $cordovaSplashscreen.hide();
});
