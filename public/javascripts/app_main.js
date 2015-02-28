var app=angular.module("feed", []);

app.controller("feed_populate",['$scope',function($scope){
  $scope.input_name="name";
  $scope.input_url="google.com";
  $scope.items=[
    {'name' : 'camera', 'url' : 'http://ecx.images-amazon.com/images/I/319lZQWPEuL._AC_SY220_.jpg'},
    {'name' : 'phone', 'url' : 'http://ecx.images-amazon.com/images/I/41K8jK0oS1L._AC_SY220_.jpg'},
    {'name' : 'movie', 'url' : 'http://ecx.images-amazon.com/images/I/51Cfy5iCp7L._AC_SY220_.jpg'},
    {'name' : 'ipod', 'url' : 'http://ecx.images-amazon.com/images/I/41cwEhtosRL._AC_SY220_.jpg'},
    {'name' : 'camera', 'url' : 'http://ecx.images-amazon.com/images/I/319lZQWPEuL._AC_SY220_.jpg'},
    ];
  $scope.add_item=function(){
    $scope.items.push({'name' : $scope.input_name, 'url' : $scope.input_url});
  };
  $scope.search=function(){
    $http.get('/search?q='+$scope.search_box);
    
  }

}]);
