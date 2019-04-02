angular.module('httpService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Http', ['$http',function($http) {
		return {
			getMyAppIds : function() {
				return $http.get('/api/apps');
			},
			import : function(app) {
				return $http.post('/api/apps', app);
			},
			delete : function(id) {
				return $http.delete('/api/apps/' + id);
      },
      searchApps: function(searchText) {
        var req = {
          method: 'GET',
          url: 'https://api.github.com/search/repositories?q='+searchText,
          headers: {
            'Accept': 'application/vnd.github.mercy-preview+json'
          }
         }
        return $http(req)
      },
      getTopPackages: function() {
        return $http.get('/api/packages');
      }
		}
	}]);
