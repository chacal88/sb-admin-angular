(function( ng, us, app ) {

	"use strict";

	/* Factory Activity */
	app.factory('authFactory', 
		['$rootScope', 
		 '$q', 
		 '$http',
		 '$log',
		 'webStorage',
		 'authIndexService',
		 'applicationData',
		 'userResetPasswordService', 
	function(
		$rootScope, 
		$q,
		$http,
		$log,
		webStorage,
		authIndexService,
		applicationData,
		userResetPasswordService){

		var prefixApplication = 'super-frota';
		var userDataRealm = 'sf-storage-user-data';
		var isLogged = false;

		/**
		 * Loading application data from session storage
		 */
		var dataApplication = webStorage.local.get( prefixApplication );
		if( dataApplication && ng.isObject( dataApplication ) ) {
			applicationData.userId = dataApplication.auth.info.user.id;
			applicationData.userEmail = dataApplication.auth.info.user.email;
			applicationData.userNome = dataApplication.auth.info.user.name;
			applicationData.sessionId = dataApplication.auth.info.user.token;				
			applicationData.permissions = dataApplication.auth.info.user.recursos.map(function(permission) { return permission.toString().toLowerCase(); });
			applicationData.auth = dataApplication.auth;
		}

		var checkIsLogged = function() {
			
			var data = webStorage.local.get( prefixApplication );
			if( ng.isObject( data ) ) {
				/**
				 * Updating http headers
				 */
				console.log("session1",data.sessionId);
				$http.defaults.headers.common['X-Session-Token'] = data.sessionId;

				console.log("checando",$http.defaults.headers);
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
			delete $http.defaults.headers.common['X-Session-Token'];

			/**
			 * Clear any session storage
			 */
			clearLocalWebStorage();

			/**
			 * User is not logged.
			 */
			return false;
		};

		var hasPermission = function(permission) {
			return ( dataApplication && 'permissions' in applicationData && us.contains( applicationData.permissions, permission ) ? true : false );
		};

		var successLoginResponse = function(response) {
			/**
			 * Clear any session storage
			 */
			clearLocalWebStorage();

			/**
			 * @todo Authentication returns http code 203 instead of 500
			 * Returning a promise
			 */
			if ( typeof response.data === 'object' && response.code === 201 ) {

				/**
				 * Updating applicationData
				 */
				applicationData.userId = response.data.info.user.id;
				applicationData.userEmail = response.data.info.user.email;
				applicationData.userNome = response.data.info.user.name;
				applicationData.sessionId = response.data.info.user.token;				
				applicationData.permissions = response.data.info.user.recursos.map(function(permission) { return permission.toString().toLowerCase(); });
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

				console.log("session2",applicationData.sessionId);
				$http.defaults.headers.common['X-Session-Token'] = applicationData.sessionId;

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
			applicationData.userId = response.data.info.user.id;
			applicationData.userEmail = response.data.info.user.email;
			applicationData.userNome = response.data.info.user.name;
			applicationData.sessionId = response.data.info.user.token;				
			applicationData.permissions = response.data.info.user.recursos.map(function(permission) { return permission.toString().toLowerCase(); });
			applicationData.auth = response.data;

			/**
			 * Store the new application data session
			 */
			webStorage.local.set( prefixSuperUserApplication, applicationData.superUser );
		}

		var errorLoginResponse = function(response) {

			//invalid response
			return $q.reject(response);
		};

//		var become = function( sessionId, userId, accountId ) {
//			return $q.all([
//					authIndexService.become( sessionId, userId, accountId ),
//					authIndexService.session( sessionId )
//				]).then( function (response){
//					successLoginResponse( response[0] );
//					successSessionResponse( response[1] );
//				});
//		};

		var login = function( data ) {

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
			delete $http.defaults.headers.common['X-Session-Token'];

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
			webStorage.local.set( prefixApplication, data );
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
		//	become: become,
		//	checkIsSuperUser: checkIsSuperUser,
			saveToStorage: saveToStorage,
			saveLastSuccessfulLogin: saveLastSuccessfulLogin,
			getLastSuccessfulLogin: getLastSuccessfulLogin
		};
	}]);

})( angular, _, SFApplicationAuth );