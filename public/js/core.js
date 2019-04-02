'use strict';

var gitApp = angular.module('gitApp', ['ngRoute', 'httpService']);


// configure our routes
gitApp.config(function($routeProvider) {
  $routeProvider

      // route for the home page
      .when('/', {
          templateUrl : '../pages/home.html',
          controller: 'mainController'
      })

      // route for the about page
      .when('/packages', {
          templateUrl : '../pages/packages.html',
          controller  : 'packagesController'
      })
});
