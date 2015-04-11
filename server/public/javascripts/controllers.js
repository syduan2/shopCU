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
  var itemID;
  var myDropzone;
  $http.get('/newPost').
  success(function(data, status, headers, config) {
    itemToken=data;
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
        formData.append("id", itemID);
        console.log(formData);
      });
      $("#submit-form").click(function(){
        var outPacket={
          title: $("#title").val(),
          description: $("#description").val(),
          tag: $('input[name="tags"]:checked').val(),
          price: $("#price").val(),
          negotiable: $("#negotiable").is(':checked'),
          trade: $("trade").is(':checked'),
          email: $("#email").val(),
          phone: $("#phone").val(),
          methods: {facebook: $("#facebook").is(':checked'),
                    call: $("call").is(':checked'),
                    txtmsg: $("textmsg").is(':checked'),
                    email: $("e-mail").is(':checked')},
          id: itemToken
        }
        console.log(outPacket);
      });
  });


}]);
