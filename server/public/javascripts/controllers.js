var controllers = angular.module('controllers', []);


controllers.controller("feed_populate",['$scope', '$http', function($scope, $http){
  $scope.categories=['Tech','Clothes','Textbooks'];
  $scope.$on('$viewContentLoaded', function(){
    $http.get('/items').
    success(function(data, status, headers, config) {
      $scope.items=angular.fromJson(data);
      console.log($scope.items)
    }).
    error(function(data, status, headers, config) {
      console.log("OHNOES")
    });
    //var myDropzone = new Dropzone("dropzone", { url: "/image-upload"});
  });
  $scope.search=function(){
    $http.get('/search?q='+$scope.search_box);

  }

}]);