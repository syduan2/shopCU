var controllers = angular.module('controllers', []);


controllers.controller("feed_populate",['$scope', '$http', function($scope, $http){
  $scope.categories=['Tech','Clothes','Textbooks'];
  $scope.$on('$viewContentLoaded', function(){
    $http.get('/items').
    success(function(data, status, headers, config) {
      $scope.items=angular.fromJson(data.data);
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

controllers.controller("management_controller",['$scope', '$http', '$window', '$document', function($scope, $http, $window, $document){
  $scope.pageSize = 2;
  $scope.selectedUserPageIdx = 0;
  $scope.selectedItemPageIdx = 0;
  $scope.users = [];
  $scope.userSize = [];
  var getUsers = function(where,skip,limit,sort){
      where = (typeof where === 'undefined') ? '{}' : where;
      skip = (typeof skip === 'undefined') ? '0' : skip;
      limit = (typeof limit === 'undefined') ? '2' : limit;
      sort = (typeof sort === 'undefined') ? '{}' : sort;
      var query='?where='+where+'&sort='+sort+'&limit='+limit+'&skip='+skip;
      $http.get('/users'+query).
        success(function(data) {
          $scope.users=data.data;
          //console.log(data.size/pagesize);
          //console.log("size: "+data.size);
          $scope.userSize = [];
          for(var i = 0; i < data.size/limit; i++) {
            $scope.userSize.push(i);
          }
          //console.log($scope.users);
        }).
        error(function(data, status, headers, config) {
          console.log("OHNOES")
      });
  }
  getUsers(undefined,($scope.selectedUserPageIdx)*$scope.pageSize,$scope.pageSize);
  $scope.items = [];
  $scope.itemSize = [];
  var getItems = function(where,skip,limit,sort){
      where = (typeof where === 'undefined') ? '{}' : where;
      skip = (typeof skip === 'undefined') ? '0' : skip;
      limit = (typeof limit === 'undefined') ? '2' : limit;
      sort = (typeof sort === 'undefined') ? '{}' : sort;
      var query='?where='+where+'&sort='+sort+'&limit='+limit+'&skip='+skip;
      $http.get('/items'+query).
        success(function(data) {
          $scope.items=data.data;
          //console.log(data.size/pagesize);
          $scope.itemSize = [];
          for(var i = 0; i < data.size/limit; i++) {
            $scope.itemSize.push(i);
          }
          //console.log($scope.items);
        }).
        error(function(data, status, headers, config) {
          console.log("OHNOES")
      });
  }
  getItems(undefined,($scope.selectedItemPageIdx)*$scope.pageSize,$scope.pageSize);
  $scope.clearUsers = function() {
        $http.delete('/users').success(function(done){
        alert(done.message);
    }).error(function(done){
        alert(done.message);
    });
    getUsers(undefined,($scope.selectedUserPageIdx)*$scope.pageSize,$scope.pageSize);
  }
  $scope.deleteUser = function(id) {
        $http.delete('/users/'+id).success(function(done){
        alert(done.message);
    }).error(function(done){
        alert(done.message);
    });
    getItems(undefined,($scope.selectedItemPageIdx)*$scope.pageSize,$scope.pageSize);
  }
  $scope.clearItems = function() {
        $http.delete('/items').success(function(done){
        alert(done.message);
    }).error(function(done){
        alert(done.message);
    });
    getItems(undefined,($scope.selectedItemPageIdx)*$scope.pageSize,$scope.pageSize);
  }
  $scope.deleteItem = function(id) {
        $http.delete('/items/'+id).success(function(done){
        alert(done.message);
    }).error(function(done){
        alert(done.message);
    });
    getItems(undefined,($scope.selectedItemPageIdx)*$scope.pageSize,$scope.pageSize);
  }
  //*****************************************************The following functions can and should be merged
  $scope.addItemToUser = function(userID,itemID) {
       var outPacket={
                $addToSet : { postedItems : itemID },
        };
        $http.put('/users/'+userID,outPacket).success(function(done){
        alert(done.message);
    }).error(function(done){
        alert(done.message);
    });
    getUsers(undefined,($scope.selectedUserPageIdx)*$scope.pageSize,$scope.pageSize);
    //document.getElementById('userframe').contentWindow.location.reload(true);
  }
  $scope.addUserToItem = function(userID,itemID) {
       var outPacket={
                $addToSet : { postedBy : userID },
        };
        $http.put('/items/'+itemID,outPacket).success(function(done){
        alert(done.message);
    }).error(function(done){
        alert(done.message);
    });
    getItems(undefined,($scope.selectedItemPageIdx)*$scope.pageSize,$scope.pageSize);
  }
  $scope.removeItemFromUser = function(userID,itemID) {
       var outPacket={
                $pull : { postedItems : itemID },
        };
        $http.put('/users/'+userID,outPacket).success(function(done){
        alert(done.message);
    }).error(function(done){
        alert(done.message);
    });
    getUsers(undefined,($scope.selectedUserPageIdx)*$scope.pageSize,$scope.pageSize);
  }
  $scope.removeUserFromItem = function(userID,itemID) {
       var outPacket={
                $pull : { postedBy : userID },
        };
        $http.put('/items/'+itemID,outPacket).success(function(done){
        alert(done.message);
    }).error(function(done){
        alert(done.message);
    });
    getItems(undefined,($scope.selectedItemPageIdx)*$scope.pageSize,$scope.pageSize);
  }
  // scalable/generalized parts are below
  $scope.collections = [];
  $scope.checkColle = function() {
        $http.get('/collections').success(function(done){
        console.log(done.message);
         $scope.collections = done.data;
    }).error(function(done){
        console.log(done.message);
    });
  }
  $scope.checkColle();
  $scope.collection = '';
  $scope.currCollection = '';
  $scope.getColle = function(colleName) {
      console.log('/'+colleName);
      var query='?where={}';
        $http.get('/'+colleName+query).success(function(done){
         $scope.collection = done.data;
         $scope.currCollection = colleName;
    }).error(function(done){
    });
  }
  $scope.stf = function(doc) {
      return JSON.stringify(doc, undefined, 4);
  }
  $scope.updateDoc = function(id,doc) {
      //console.log("?");
    $http.put('/'+$scope.currCollection+'/'+id,JSON.parse(doc)).success(function(done){
        alert(done.message);
    }).error(function(done){
        alert(done.message);
    });
    $scope.getColle($scope.currCollection);
    getUsers(undefined,($scope.selectedUserPageIdx)*$scope.pageSize,$scope.pageSize);
    getItems(undefined,($scope.selectedItemPageIdx)*$scope.pageSize,$scope.pageSize);
  }
  
  //pagination 
  $scope.page = function(colle,pageIdx,sequencial,index) {
      var pageSize = $scope.pageSize;
      //colle = which collection to get
      if (colle == 'user')
          if (typeof pageIdx != 'undefined'){
            getUsers(undefined,pageIdx*pageSize,pageSize);
            $scope.selectedUserPageIdx = index;
          }
          else if (typeof sequencial != 'undefined' && sequencial == 0 && $scope.selectedUserPageIdx > 0){
            $scope.selectedUserPageIdx--;
            getUsers(undefined,($scope.selectedUserPageIdx)*pageSize,pageSize);
          }
          else if (typeof sequencial != 'undefined' && sequencial == 1 && $scope.selectedUserPageIdx < $scope.userSize.length-1){
            $scope.selectedUserPageIdx++;
            getUsers(undefined,($scope.selectedUserPageIdx)*pageSize,pageSize);
          }
      if (colle == 'item')
          if (typeof pageIdx != 'undefined'){
            getItems(undefined,pageIdx*pageSize,pageSize);
            $scope.selectedItemPageIdx = index;
          }
          else if (typeof sequencial != 'undefined' && sequencial == 0 && $scope.selectedItemPageIdx > 0){
            $scope.selectedItemPageIdx--;
            getItems(undefined,($scope.selectedItemPageIdx)*pageSize,pageSize);
          }
          else if (typeof sequencial != 'undefined' && sequencial == 1 && $scope.selectedItemPageIdx < $scope.itemSize.length-1){
            $scope.selectedItemPageIdx++;
            getItems(undefined,($scope.selectedItemPageIdx)*pageSize,pageSize);
          }
      //pageIdx = determines how much to skip, -1 if sequencial
      //sequencial = 0 is back, 1 is forward, -1 if pageIdx
  }
}]);
