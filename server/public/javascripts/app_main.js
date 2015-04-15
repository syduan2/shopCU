var app=angular.module("shopcu_main", ['ngRoute', 'controllers']);
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        controller: 'feed_populate',
        templateUrl: 'views/feed.html'
      }).
      when('/register', {
        templateUrl: 'views/register.html',
        controller: 'register_controller'
      }).
      when('/sell', {
        templateUrl: 'views/post.html',
        controller: 'sell_controller'
      }).
      when('/posts/:postID', {
        templateUrl: 'views/view.html',
        controller: 'view_controller'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
