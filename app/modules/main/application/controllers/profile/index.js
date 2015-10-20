(function(ng, app) {

	"use strict";

	/* Application Main Controller */
	app.controller('ProfileController', [
			'$scope',
			'$rootScope',
			'$position',
			'applicationData',
			'userIndexService',
		function(
			$scope,
			$rootScope, 
			$position,
			applicationData,
			userIndexService
		) {
			
			/**
			 * Profile
			 */
			$scope.profile = {};

			/**
			 * Getting profile user.
			 */
			var getProfile = function getProfile() {
				userIndexService.get( applicationData.userId ).then(function(response) {
					var profile = !ng.isUndefined(response.data) ? response.data : $scope.profile;
					console.log(profile);
					$scope.profile.nome = profile.name;

				});
			};
			getProfile();
		}
	]);

})(angular, SFApplication);