(function( ng, app ) {

	"use strict";

	/* User Service */
	app.factory('userResetPasswordService', ['$http', '$q', 'applicationData', function($http, $q, applicationData) {
		return {
			"reset": function(data) {
				return $http({
					method: 'POST',
					data: {
						"data": data
					},
					url: applicationData.apiUrl + '/user/reset-password'
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