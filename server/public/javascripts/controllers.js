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
  });
  $scope.search=function(){
    $http.get('/search?q='+$scope.search_box);

  }

    $(function(){

    $(".dropdown-menu").on('click', 'li a', function(){
      $(".btn:first-child").text($(this).text());
      $(".btn:first-child").val($(this).text());
   });

});

}]);

controllers.controller("sell_controller",['$scope', '$http', function($scope, $http){
  //var myDropzone = new Dropzone("dropzone", { url: "/image-upload"});
  $scope.itemID='';
  var myDropzone;
  $http.get('/newPost').
  success(function(data, status, headers, config) {
    $scope.itemID=data;
  }).
  error(function(data, status, headers, config) {
    console.log("OHNOES");
  });
  $.getScript("javascripts/dropzone.js", function(){
     myDropzone = new Dropzone("#drop", {
      url: "/post-image",
      autoProcessQueue: true,
      maxFilesize: 2,
      maxFiles: 7,
      parallelUploads: 7,
      addRemoveLinks: true,
      acceptedFiles: "image/*"});
      myDropzone.on("sending", function(file, xhr, formData) {
      // Will send the filesize along with the file as POST data.
        formData.append("id", $scope.itemID);
        console.log(formData);
      });
      $("#submit-form").click(function(){
        var outPacket={
          title: $("#title").val(),
          description: $("#description").val(),
          tag: $('input[name="tags"]:checked').val(),
          price: $("#price").val(),
          negotiable: $("#negotiable").prop('checked'),
          trade: $("#trade").prop('checked'),
          email: $("#email").val(),
          phone: $("#phone").val(),
          methods: {facebook: $("#facebook").prop('checked'),
                    call: $("#call").prop('checked'),
                    txtmsg: $("#textmsg").prop('checked'),
                    email: $("#e-mail").prop('checked')},
          id: $scope.itemID
        }
        //console.log(outPacket.methods);
        $http.post('/submit', outPacket);
        window.location.href = '/';
      });
  });
}]);
controllers.controller('view_controller', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams){
    $scope.item={}
    $http.get('/post/'+$routeParams.postID).
    success(function(data, status, headers, config) {
      $scope.item=angular.fromJson(data);
      console.log($scope.item);
      $scope.images = $scope.item.images;
      if(!$scope.item.methods.facebook) $("#facebook").attr('class', 'glyphicon glyphicon-remove');
      if(!$scope.item.methods.txtmsg)  $("#txtmsg").attr('class', 'glyphicon glyphicon-remove');
      if(!$scope.item.methods.call)  $("#call").attr('class', 'glyphicon glyphicon-remove');
      if(!$scope.item.methods.email) $("#email").attr('class', 'glyphicon glyphicon-remove');
      if(!$scope.item.trade) $("#trade").attr('class', 'glyphicon glyphicon-remove');
      if(!$scope.item.negotiable) $("#negotiable").attr('class', 'glyphicon glyphicon-remove');
    }).
    error(function(data, status, headers, config) {
      console.log("OHNOES")
    });
  }
]);
controllers.controller("register_controller",['$scope', '$http', '$window', function($scope, $http, $window){
    if ($window.sessionStorage.user)$scope.usernameDisplay = $window.sessionStorage.user;
    else $scope.usernameDisplay = 'New Guest';
    $scope.login = function(email,password) {
        //console.log("username=" + name + "&email="+email);
     /* var dataObj = {
				username : name,
				email : email
		};	*/
    /*$http({
                    method: 'POST',
                    url: '/users',
                    data: "username=" + name + "&email="+email,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })*/
        var outPacket={
                email : email,
				email : email,
                password : password
        };
        $http.post('/login', outPacket).success(function(done){
        alert(done.message);
        $window.sessionStorage.user = $scope.usernameDisplay = done.data;
    }).error(function(done){
        alert(done.message);
    });
  }

    $scope.add = function(name,email,password) {
        var outPacket={
                name : name,
				        email : email,
                password : password
        };
        $http.post('/users', outPacket).success(function(data){
          alert(data.message);
    }).error(function(data){
        alert(data.message);
    });
  }
}]);

controllers.controller("management_controller",['$scope', '$http', '$window', function($scope, $http, $window){
  $scope.clearUsers = function() {
        $http.delete('/users').success(function(done){
        alert(done.message);
    }).error(function(done){
        alert(done.message);
    });
  }
  $scope.clearItems = function() {
        $http.delete('/items').success(function(done){
        alert(done.message);
    }).error(function(done){
        alert(done.message);
    });
  }
  $scope.users = [];
  $http.get('/users').
    success(function(data) {
      $scope.users=data;
      console.log($scope.users);
    }).
    error(function(data, status, headers, config) {
      console.log("OHNOES")
  });
  $scope.items = [];
  $http.get('/items').
    success(function(data) {
      $scope.items=data;
      console.log($scope.users);
    }).
    error(function(data, status, headers, config) {
      console.log("OHNOES")
  });

}]);
