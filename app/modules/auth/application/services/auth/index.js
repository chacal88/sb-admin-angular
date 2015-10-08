(function( ng, app ) {

	"use strict";

	/* Activity Service */
	app.factory('authIndexService', ['$http', '$q', 'applicationData', function($http, $q, applicationData) {
		return {
			"login": function(data) {
				return $http({
					method: 'POST',
					data: {
						"data": data
					},
					url: applicationData.apiUrl + '/auth'
				}).then(function(response) {
					if ( response && "data" in response && response && "data" in response && typeof response.data === 'object' && response.status === 200 ) {
						return response.data;
					} else {
						//invalid response
						return $q.reject(response.data);
					}
				}, function(response) {
					// something went wrong
					return $q.reject(response.data);
				});
			},
			"logout": function(token) {
				return $http({
					method: 'DELETE',
					url: applicationData.apiUrl + '/auth/' + token
				}).then(function(response) {
					if ( response && "data" in response && response && "data" in response && typeof response.data === 'object' && response.status === 200 ) {
						return response.data;
					} else {
						//invalid response
						return $q.reject(response.data);
					}
				}, function(response) {
					// something went wrong
					return $q.reject(response.data);
				});
			},
			"become": function(sessionId, userId, accountId) {
				return $http({
					method: 'POST',
					data: {
						"data": {
							user_id: userId,
							account_id: accountId
						}
					},
					url: applicationData.apiUrl + '/become',
					headers: {
						'X-Session-Id': sessionId
					}
				}).then(function(response) {
					if ( response && "data" in response && response && "data" in response && typeof response.data === 'object' && response.status === 200 ) {
						return response.data;
					} else {
						//invalid response
						return $q.reject(response.data);
					}
				}, function(response) {
					// something went wrong
					return $q.reject(response.data);
				});
			},
			"session": function(sessionId) {
				return $http({
					method: 'GET',
					headers: {
						'X-Session-Id': sessionId
					},
					url: applicationData.apiUrl + '/session/' + sessionId
				}).then(function(response) {
					if ( response && "data" in response && response && "data" in response && typeof response.data === 'object' && response.status === 200 ) {
						return response.data;
					} else {
						//invalid response
						return $q.reject(response.data);
					}
				}, function(response) {
					// something went wrong
					return $q.reject(response.data);
				});
			}
		};
	}]);
})( angular, SFApplicationAuth );