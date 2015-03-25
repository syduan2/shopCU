var app=angular.module("shopcu_main", ['ngRoute', 'controllers']);
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'views/feed.html',
        controller: 'feed_populate'
      }).
      when('/register', {
        templateUrl: 'views/register.html',
        controller: 'register_controller'
      }).
      when('/sell', {
        templateUrl: 'views/post.html',
        controller: 'sell_controller'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
