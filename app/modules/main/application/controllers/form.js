(function(ng, app) {

	"use strict";

	/* Application Main Controller */
	app.controller(
		'FormCtrl', 
		[
			'applicationData', 
			'$scope',
			'$rootScope',
			'$position',
			function(
				applicationData,
				$scope,
				$rootScope, 
				$position) {
			}
		]
	);

})(angular, SFApplication);