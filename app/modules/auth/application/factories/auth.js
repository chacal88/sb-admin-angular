(function( ng,  app ) {

	"use strict";

	/* Factory Activity */
	app.factory('authFactory', [
		'$rootScope', '$q', '$http', 
		'$log', 'webStorage', 'authIndexService', 
		'applicationData', 'userResetPasswordService',  '$translate', 
	function(
		$rootScope, $q, $http, $log, 
		webStorage, authIndexService, applicationData, 
		userResetPasswordService, $translate) {

		var prefixApplication = 'super-frota';
		var userDataRealm = 'sf-storage-user-data';
		var isLogged = false;

		/**
		 * Loading application data from session storage
		 */
		var dataApplication = webStorage.local.get( prefixApplication );
		if( dataApplication && ng.isObject( dataApplication ) ) {
			applicationData.userId = dataApplication.userId;
			applicationData.userLanguage = dataApplication.userLanguage;
			applicationData.sessionId = dataApplication.sessionId;
			applicationData.company = dataApplication.company;
			applicationData.permissions = dataApplication.permissions;
			applicationData.pusher.apiKey = dataApplication.pusher.apiKey;
			applicationData.auth = dataApplication.auth;
		}

		var checkIsLogged = function() {
			var data = webStorage.local.get( prefixApplication );
			if( ng.isObject( data ) ) {
				/**
				 * Updating http headers
				 */
				$http.defaults.headers.common['X-Session-Id'] = data.sessionId;

				/**
				 * Notify application
				 */
				if( ! isLogged ) {
					isLogged = true;
					$rootScope.$broadcast( 'login:success' );
				}

				/**
				 * User is logged.
				 */
				return true;
			}

			/**
			 * Remove header
			 */
			delete $http.defaults.headers.common['X-Session-Id'];

			/**
			 * Clear any session storage
			 */
			clearLocalWebStorage();

			/**
			 * User is not logged.
			 */
			return false;
		};

		/**
		 * Check if is super user.
		 */
		var checkIsSuperUser = function() {
			return webStorage.local.get( prefixSuperUserApplication ) != null;
		};

		var hasPermission = function(permission) {
			return ( dataApplication && 'permissions' in applicationData && us.contains( applicationData.permissions, permission ) ? true : false );
		};

		var successLoginResponse = function(response) {
			/**
			 * Hide loading.
			 */
			$ionicLoading.hide();

			/**
			 * Clear any session storage
			 */
			clearLocalWebStorage();

			/**
			 * @todo Authentication returns http code 203 instead of 500
			 * Returning a promise
			 */
			if ( typeof response.data === 'object' && response.code === 200 ) {

				/**
				 * Do not log in webapp if is a super user.
				 */
				if( response.data.user.permissions.indexOf("super_user") != -1 ) {
					return response;
				}

				/**
				 * Updating applicationData
				 */
				applicationData.userId = response.data.account_user.id;
				applicationData.userLanguage = response.data.account_user.language;
				applicationData.sessionId = response.data.session_id;
				applicationData.company = response.data.account.contact_info.user.company;
				applicationData.permissions = response.data.user.permissions.map(function(permission) { return permission.toString().toLowerCase(); });
				applicationData.pusher.apiKey = response.data.account.pusher_application_info.auth_key;
				applicationData.auth = response.data;

				/**
				 * Store the new application data session
				 */
				saveToStorage( applicationData );

				/**
				 * Store data into module variable.
				 */
				dataApplication = applicationData;

				/**
				 * Updating http headers
				 */
				$http.defaults.headers.common['X-Session-Id'] = response.data.session_id;

				/**
				 * Status of session
				 */
				isLogged = true;

				/**
				 * Notify application
				 */
				$rootScope.$broadcast( 'login:success' );

				//valid response
				return response;
			} else {
				//invalid response
				return $q.reject(response);
			}
		};

		var successSessionResponse = function(response) {
			/**
			 * Start Object to avoid undefined error.
			 */
			applicationData.superUser = {};

			/**
			 * Updating applicationData for SuperUser.
			 */
			applicationData.superUser.userId = response.data.account_user.id;
			applicationData.superUser.userLanguage = response.data.account_user.language;
			applicationData.superUser.sessionId = response.data.session_id;
			applicationData.superUser.company = response.data.account.contact_info.user.company;
			applicationData.superUser.permissions = response.data.user.permissions.map(function(permission) { return permission.toString().toLowerCase(); });
			applicationData.superUser.pusher.apiKey = response.data.account.pusher_application_info.auth_key;
			applicationData.superUser.auth = response.data;


			/**
			 * Store the new application data session
			 */
			webStorage.local.add( prefixSuperUserApplication, applicationData.superUser );
		}

		var errorLoginResponse = function(response) {
			/**
			 * Hide loading.
			 */
			$ionicLoading.hide();

			//invalid response
			return $q.reject(response);
		};

		var become = function( sessionId, userId, accountId ) {
			return $q.all([
					authIndexService.become( sessionId, userId, accountId ),
					authIndexService.session( sessionId )
				]).then( function (response){
					successLoginResponse( response[0] );
					successSessionResponse( response[1] );
				});
		};

		var login = function( data ) {
			/**
			 * Show loading.
			 */
			$ionicLoading.show({
				template: $translate('Loading') + '...'
			});

			return authIndexService.login( data ).then( successLoginResponse, errorLoginResponse );
		};

		var logout = function() {
			/**
			 * Destroy session id
			 */
			authIndexService.logout( applicationData.sessionId );

			/**
			 * Clear session
			 */
			this.clearSession();
		};

		var clearSession = function() {
			/**
			 * Remove session.
			 */
			authIndexService.logout( applicationData.sessionId );

			/**
			 * Status of session
			 */
			isLogged = false;

			/**
			 * Remove header
			 */
			delete $http.defaults.headers.common['X-Session-Id'];

			/**
			 * Clear any session storage
			 */
			clearLocalWebStorage();

			/**
			 * Clear variable.
			 */
			dataApplication = {};
		};

		var resetPassword = function( data ) {
			return userResetPasswordService.reset( data ).then(function(response) {
				return response;
			}, function(response) {
				//invalid response
				return $q.reject(response);
			});
		};

		var saveToStorage = function( data ) {
			webStorage.local.add( prefixApplication, data );
		};

		var clearLocalWebStorage = function() {
			/**
			 * Clear any session storage, but keeping the last successful login email
			 */
			var dataRaw = getLastSuccessfulLogin();
			webStorage.local.clear();
			saveLastSuccessfulLogin(dataRaw);
		};

		var saveLastSuccessfulLogin = function(username) {
			webStorage.local.add(userDataRealm, {'username' : username});
		};

		var getLastSuccessfulLogin = function() {
			var data = webStorage.local.get(userDataRealm);
			return ng.isObject(data) ? data.username : '';
		};

		return {
			checkIsLogged: checkIsLogged,
			hasPermission: hasPermission,
			login: login,
			logout: logout,
			clearSession: clearSession,
			resetPassword: resetPassword,
			become: become,
			checkIsSuperUser: checkIsSuperUser,
			saveToStorage: saveToStorage,
			saveLastSuccessfulLogin: saveLastSuccessfulLogin,
			getLastSuccessfulLogin: getLastSuccessfulLogin
		};
	}]);

})( angular, SFApplicationAuth );