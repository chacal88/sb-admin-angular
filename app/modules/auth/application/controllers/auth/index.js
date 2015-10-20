(function( ng, app ) {

	"use strict";

	/* Controllers */
	app.controller('AuthController', ['$rootScope', '$scope', '$state', '$location', 'authFactory', 'applicationData', function($rootScope, $scope, $state, $location, authFactory, applicationData) {

		console.log("Auth Controller");
		$scope.data = {
			"user": '',
			"pass": '',
			"stay_sign_in": 0,
			//"timezone": timezoneFactory.detect()
		};
		$scope.login = function($event) {

			/**
			 * Removing errors and messages
			 */
			$scope.clearErrors();
			$scope.clearMessages();

			/**
			 * Prevent the default action
			 */
			$event.preventDefault();

			/**
			 * Call service login
			 */
			authFactory.login( $scope.data ).then(function(response) {

				/**
				 * Saving last successful login email.
				 */
				authFactory.saveLastSuccessfulLogin(response.data.info.user.email);

				/**
				 * Redirect application
				 */
				$state.go( 'dashboard' );
			}, function(response) {
				$scope.error = !ng.isUndefined(response.data) && !ng.isUndefined(response.data.message) ? response.data.message : applicationData.serverErrorMessage ;
			});
		};
//
//		$scope.resetPassword = function($event) {
//
//			/**
//			 * Removing errors and messages
//			 */
//			$scope.clearErrors();
//			$scope.clearMessages();
//
//			/**
//			 * Prevent the default action
//			 */
//			$event.preventDefault();
//			$ionicLoading.show();
//			/**
//			 * Call service login
//			 */
//			authFactory.resetPassword( {"email": $scope.data.email } ).then(function(response) {
//				$ionicLoading.hide();
//				$scope.success = response.data.message;
//			}, function(response) {
//				$ionicLoading.hide();
//				$scope.error = !ng.isUndefined(response.data) && !ng.isUndefined(response.data.message) ? response.data.message : $translate( applicationData.serverErrorMessage );
//			});
//		};

		$scope.clearErrors = function($event) {
			$scope.error = null;
		};

		$scope.clearMessages = function($event) {
			$scope.success = null;
		};

//		$scope.data.username = authFactory.getLastSuccessfulLogin();

	}]);

})( angular, SFApplicationAuth );