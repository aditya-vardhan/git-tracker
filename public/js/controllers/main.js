angular.module('gitApp')

	// inject the App service factory into our controller
	.controller('mainController', ['$scope','$http', 'Http', function($scope, $http, Http) {
		// GET =====================================================================
		// when landing on the page, get all apps and show them
    // use the service to get all the apps
    Http.getMyAppIds()
      .then((res) =>{
        $scope.myAppIds = res.data
      })


    $scope.searchApps = () => {
      // validate the searchText to make sure that something is there
			// if searchText is empty, nothing will happen
			if ($scope.searchText) {
        $scope.loading = true;

				// call the create function from our service (returns a promise object)
				Http.searchApps($scope.searchText)

					// if successful creation, call our get function to get all the new apps
					.then(function(res) {
            console.log(res.data.items)
						$scope.loading = false;
						$scope.searchText = ''; // clear the searchText so our user is ready to enter another
            $scope.apps = res.data.items; // assign our new list of apps
					}).catch(function(res) {
            console.log(res)
          });
			}
    }

		// CREATE ==================================================================
		// when submitting the add searchText, send the name to the node API
		$scope.importApp = function(appId, appName) {
        // call the import function from our service (returns a promise object)
        
      var req = {
        method: 'GET',
        url: `https://api.github.com/repos/${appName}/contents/package.json`,
        headers: {
          'Accept': 'application/vnd.github.mercy-preview+json'
        },
        dataType: 'json',
        contentType: 'application/json'
       }
      $http(req)
      .then((res)=>{
        console.log(res)
        var req2 = {
          method: 'GET',
          url: res.data.download_url,
          headers: {
            'Accept': 'application/vnd.github.mercy-preview+json'
          },
          dataType: 'json',
          contentType: 'application/json'
         }
        return $http(req2)
      })
      .then((res) => {
        console.log(res.data)
        let repos = Object.assign(res.data.dependencies, res.data.devDependencies)
        let importData = {
          id: appId,
          repoName: appName,
          packages: repos
        }
				return Http.import(importData)
      })
      .then(function(res) {
        console.log('imported',res.data)
        $scope.myAppIds = res.data; // assign our new list of apps
      })
      .catch((res) => {
        alert('package json file doesnot exist for this repo');
        console.log(res)
      })
		};

		// DELETE ==================================================================
		// delete a gitApp after checking it
		$scope.deleteTodo = function(id) {
			$scope.loading = true;

			Http.delete(id)
				// if successful creation, call our get function to get all the new apps
				.then(function(res) {
					$scope.loading = false;
					$scope.apps = res.data; // assign our new list of apps
				});
		};
	}]);
