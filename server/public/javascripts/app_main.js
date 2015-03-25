var app=angular.module("feed", []);

app.controller("feed_populate",['$scope',function($scope){
  $scope.input_name="name";
  $scope.input_url="google.com";
  $scope.categories=['Tech','Clothes','Textbooks'];
  $scope.items=[
    {'Name' : 'camera', 'img_link' : 'http://ecx.images-amazon.com/images/I/319lZQWPEuL._AC_SY220_.jpg'},
    {'Name' : 'phone', 'img_link' : 'http://ecx.images-amazon.com/images/I/41K8jK0oS1L._AC_SY220_.jpg'},
    {'Name' : 'movie', 'img_link' : 'http://ecx.images-amazon.com/images/I/51Cfy5iCp7L._AC_SY220_.jpg'},
    {'Name' : 'ipod', 'img_link' : 'http://ecx.images-amazon.com/images/I/41cwEhtosRL._AC_SY220_.jpg'},
    {'Name' : 'camera', 'img_link' : 'http://ecx.images-amazon.com/images/I/319lZQWPEuL._AC_SY220_.jpg'},
    ];
  $scope.init=function(){
    $http.get('/items').
    success(function(data, status, headers, config) {
      $scope.items.concat(angular.fromJson(data));
    }).
    error(function(data, status, headers, config) {
      console.log("OHNOES")
    });
  };


  $scope.add_item=function(){
    $scope.items.push({'Name' : $scope.input_name, 'url' : $scope.input_url});
  };
  $scope.search=function(){
    $http.get('/search?q='+$scope.search_box);

  }

}]);
