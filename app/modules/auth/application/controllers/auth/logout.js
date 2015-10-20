(function( ng, app ) {

	"use strict";

	/* Controllers */
	app.controller('LogoutController', 
		['$state', 
		 'authFactory', 
		 function(
			$state,
			authFactory) {

		/**
		 * Call auth to clean session
		 */
		authFactory.clearSession();

		/**
		 * Unbind all events from Pusher.
		 */
//		$interval.cancel($rootScope.pusherInterval);
//		$rootScope.pusher.unsubscribe(applicationData.userId);
//		$rootScope.pusher.unsubscribe(applicationData.accountId);

		/**
		 * Redirect to login page.
		 */
		$state.go('auth.login');

	}]);

})( angular, SFApplicationAuth );