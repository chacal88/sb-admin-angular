(function( ng, app ) {

	"use strict";

	/* User Service */
	app.factory('userIndexService', ['$http', '$q', 'applicationData', function($http, $q, applicationData) {
		return {
			"query": function() {
				return $http({
					method: 'GET',
					url: applicationData.apiUrl + '/private/user/'
				}).then(function(response) {
					if ( response && "data" in response && typeof response.data === 'object' ) {
						return response.data;
					} else {
						// invalid response
						return $q.reject(response.data);
					}
				}, function(response) {
					// something went wrong
					return $q.reject(response.data);
				});
			},
			"get": function(id) {
				return $http({
					method: 'GET',
					url: applicationData.apiUrl + '/private/user/' + id
				}).then(function(response) {
					if ( response && "data" in response && typeof response.data === 'object' ) {
						return response.data;
					} else {
						// invalid response
						return $q.reject(response.data);
					}
				}, function(response) {
					// something went wrong
					return $q.reject(response.data);
				});
			}
		};
	}]);
})( angular, SFApplication );