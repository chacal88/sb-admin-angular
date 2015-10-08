(function( ng, app ) {

	"use strict";

	/* Controllers */
	app.controller('Auth.Index.Index', ['$rootScope', '$scope', '$state', '$location', '$translate', 'timezoneFactory', 'authFactory', 'applicationData', '$ionicLoading', '$ionicViewService', function($rootScope, $scope, $state, $location, $translate, timezoneFactory, authFactory, applicationData, $ionicLoading, $ionicViewService) {

		$scope.data = {
			"username": '',
			"password": '',
			"stay_sign_in": 0,
			"timezone": timezoneFactory.detect()
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
				 * Check if is a super user and redirect to reseller application.
				 */
				if( response.data.user.permissions.indexOf("super_user") != -1 ) {
					window.location = applicationData.rapUrl + '/login?sid=' + response.data.session_id;
					return;
				}

				/**
				 * Clean Options for next view (back button).
				 */
				$ionicViewService.nextViewOptions({
					disableAnimate: false,
					disableBack: true
				});

				/**
				 * Set the user's language as app current language.
				 */
				$translate.uses(applicationData.userLanguage);

				/**
				 * Saving last successful login email.
				 */
				authFactory.saveLastSuccessfulLogin(response.data.account_user.email);

				/**
				 * Redirect application
				 */
				$state.go( 'app.welcome-page' );
			}, function(response) {
				$scope.error = !ng.isUndefined(response.data) && !ng.isUndefined(response.data.message) ? response.data.message : $translate( applicationData.serverErrorMessage );
			});
		};

		$scope.resetPassword = function($event) {

			/**
			 * Removing errors and messages
			 */
			$scope.clearErrors();
			$scope.clearMessages();

			/**
			 * Prevent the default action
			 */
			$event.preventDefault();
			$ionicLoading.show();
			/**
			 * Call service login
			 */
			authFactory.resetPassword( {"email": $scope.data.email } ).then(function(response) {
				$ionicLoading.hide();
				$scope.success = response.data.message;
			}, function(response) {
				$ionicLoading.hide();
				$scope.error = !ng.isUndefined(response.data) && !ng.isUndefined(response.data.message) ? response.data.message : $translate( applicationData.serverErrorMessage );
			});
		};

		$scope.clearErrors = function($event) {
			$scope.error = null;
		};

		$scope.clearMessages = function($event) {
			$scope.success = null;
		};

		$scope.data.username = authFactory.getLastSuccessfulLogin();

	}]);

})( angular, SFApplicationAuth );