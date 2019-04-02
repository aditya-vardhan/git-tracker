angular.module('gitApp')

	// inject the App service factory into our controller
	.controller('packagesController', ['$scope','$http','Http', function($scope, $http, Http) {
		$scope.apps = {};

		// GET =====================================================================
		// when landing on the page, get all apps and show them
		// use the service to get all the apps
		Http.getTopPackages()
			.then(function(res) {
        console.log('dddddd',res)
				$scope.apps = res.data;
			});
	}]);
