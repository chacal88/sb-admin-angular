(function( ng, app ) {

	"use strict";

	/* Application Controller */
	app.controller('ApplicationController', [
				'$rootScope', '$scope','$interval', '$log', '$location', '$timeout',
				'authFactory', 'userIndexService', 
				 'applicationData','$state','socketFactory',

			function(
				$rootScope, $scope, $interval, $log, $location, $timeout,
				authFactory, userIndexService,
				 applicationData, $state, socketFactory
		) {

		console.log(applicationData);
		
		console.log("inciando application main");
		$rootScope.userStatus = {
				isOnline : false
		};

		/**
		 * Load the image picture.
		 */
		$scope.$on( 'loadUserProfileImage', function(event) {
		//	$rootScope.userData.picture = applicationData.apiUrl + '/contact/picture/' + applicationData.userContactId + '?X-Token=' + applicationData.sessionId + '&date=' + new Date().getTime();
		});

//		/**
//		 * Used for setting icon ACTIVE.
//		 */
//		$scope.isActive = function(route) {
//			return $state.current.name.match(new RegExp('\\b'+route+'\\b', 'g'));
//		};

		/**
		 * Get current user status.
		 */
		$scope.$on( 'login:success', function() {
			$log.log('Login Success!');

			/**
			 * Setting Account Company
			 */
			//$scope.company = applicationData.company;

//			/**
//			 * Setting URLs.
//			 */
//			$scope.adminUrl = applicationData.adminUrl + '/?sid=' + applicationData.sessionId;
//			$scope.rapUrl = applicationData.rapUrl + '/?sid=' + applicationData.sessionId;
			$scope.sessionId = applicationData.sessionId;

			/**
			 * Get user informations
			 */
			userIndexService.get(applicationData.userId).then(function(response) {
				/**
				 * Setting data on $rootScope.
				 */
				$rootScope.userData = response.data;

				/**
				 * Get current user status.
				 */
				$rootScope.userStatus = {
					isOnline : ng.equals('AVAILABLE', $rootScope.userData.status)
				};

				/**
				 * Load user profile picture.
				 */
			//	$rootScope.userData.picture = applicationData.apiUrl + '/contact/picture/' + applicationData.userContactId + '?X-Token=' + applicationData.sessionId + '&date=' + new Date().getTime();

//				/**
//				 * Register pusher.
//				 */
//				$rootScope.pusherRegistration(applicationData, true);
//
//				/**
//				 * Listening for Status changes.
//				 */
//				$scope.$on('private-' + applicationData.userId + ':client-user-status', function(event, data) {
//					$rootScope.userStatus.isOnline = data.status;
//					$scope.$digest();
//				});

				/**
				 * Notify system
				 */
//				$timeout(function() {
//					$rootScope.$broadcast('userData', response.data);
//				}, 2000);
			});

			/**
			 * Load Users.
			 */
			userIndexService.query().then(function(response) {
				$rootScope.users = response.data.rows;
			});

			/**
			 * Check if user has permission
			 */
	//		$scope.hasAdminPermission = authFactory.hasPermission( 'admin' );
		});

		/**
		 * Logout user from application.
		 */
		$scope.logout = function($event) {
			$event.preventDefault();

			/**
			 * Call auth to clean session
			 */
			authFactory.logout();

			/**
			 * Redirect user to login page
			 */
			$location.path( '/login' );
		};

		/**
		 * Go to route path
		 */
		$scope.goToPath = function(path) {
			$location.path( path );
		};

		/**
		 * For opening in external browser (app).
		 */
		$scope.openUrl = function(url) {
			if( url.substring(0, 4) != 'http' ) {
				url = 'http://' + url;
			}
			window.open(url, '_system', 'location=no');
		};

		/**
		 * Check if user is logged
		 */
		$scope.checkIsLogged = authFactory.checkIsLogged;
		/**
		 * Setting admin permission.
		 */
//		$scope.hasAdminPermission = true;
		
		

//		$scope.userToggleStatus = function() {
//			userToggleStatusService.toggleStatus().then(function(response) {
//				console.log(response.data.message, $translate("Success"));
//			}, function(response) {
//				$rootScope.userStatus.isOnline = !$rootScope.userStatus.isOnline;
//				console.log(response.data.message);
//			});
//		};

//		$scope.$on(applicationData.userId + ':user_status_do_not_disturb', function(event, data) {
//			$rootScope.userStatus.isOnline = false;
//			$scope.$digest();
//		});
//
//		$scope.$on(applicationData.userId + ':user_status_available', function(event, data) {
//			$rootScope.userStatus.isOnline = true;
//			$scope.$digest();
//		});

		var checkJson = function checkJson(data) {
			if( ! ng.isObject( data ) && ng.isString( data ) ) {
				try {
					data = JSON.parse( data );
				} catch (e) {}
			}
			return data;
		};


//		/**
//		 * Create pusher instance and subscribe to channels.
//		 */
//		$rootScope.pusherRegistration = function(applicationData, forceConnect) {
//			if(typeof $rootScope.pusher != 'undefined' && !forceConnect ) return;
//
//			var options = {
//					auth: {
//						headers: {
//							'X-Token': applicationData.sessionId,
//							'X-Requested-With': 'XMLHttpRequest'
//						}
//					},
//					encrypted: applicationData.pusher.encrypted,
//					authEndpoint: applicationData.pusher.authEndpoint,
//					unavailable_timeout: 2000
//				};
//
//			/**
//			 * Singleton
//			 */
//			if( ! $rootScope.pusher ) {
//				$rootScope.pusher = new Pusher(applicationData.pusher.apiKey, options);
//			}
//
//			function bindDefaultChannels() {
//				var channelsNames = [applicationData.userId, applicationData.accountId, 'presence-' + applicationData.accountId, 'private-' + applicationData.userId];
//
//				for (var i in channelsNames) {
//					$rootScope.pusher.subscribe(channelsNames[i]);
//				};
//
//				/**
//				 * User Channel.
//				 */
//				$rootScope.pusher.channels.channels[applicationData.userId].bind_all(function(event, data) {
//					data = checkJson(data);
//					if(/^(pusher|incoming)(.*)/.test(event) === false) {
//						$rootScope.$broadcast(applicationData.userId + ':' + event, data);
//					} else {
//						if(/^(incoming)(.*)/.test(event) === true) {
//							$rootScope.$broadcast(event, data);
//						}
//					}
//				});
//
//				/**
//				 * Account Channel.
//				 */
//				$rootScope.pusher.channels.channels[applicationData.accountId].bind_all(function(event, data) {
//					data = checkJson(data);
//					if(/^pusher(.*)/.test(event) === false) {
//						$rootScope.$broadcast(applicationData.accountId + ':' + event, data);
//					}
//				});
//
//				/**
//				 * Presence Channel.
//				 */
//				$rootScope.pusher.channels.channels['presence-' + applicationData.accountId].bind_all(function(event, data) {
//					$rootScope.$broadcast('presence-' + applicationData.accountId + ':' + event, data);
//				});
//
//				/**
//				 * Private Channel.
//				 */
//				$rootScope.pusher.channels.channels['private-' + applicationData.userId].bind_all(function(event, data) {
//					$rootScope.$broadcast('private-' + applicationData.userId + ':' + event, data);
//				});
//
//				/**
//				 * Update Language from pusher event - Broadcasted from bootstrap.
//				 */
//				$rootScope.$on('userDataLoaded', function() {
//					if( $rootScope.userData.language != applicationData.userLanguage ) {
//						$ionicLoading.show();
//						applicationData.userLanguage = $rootScope.userData.language;
//						authFactory.saveToStorage(applicationData);
//						$translate.uses( $rootScope.userData.language ).then(function() {
//							$ionicLoading.hide();
//						});
//					}
//				});
//			};
//
//			bindDefaultChannels();
//
//			(function checkConnection() {
//				/**
//				 * Force reconnect if Pusher service is down.
//				 */
//				var maxRetries = 100;
//				$rootScope.pusherInterval = $interval(function() {
//					if( $rootScope.pusher && us.contains( [ 'failed', 'disconnected', 'unavailable' ] , $rootScope.pusher.connection.state ) && maxRetries > 0 ) {
//						maxRetries--;
//						try {
//							/**
//							 * Trying to disconnect
//							 */
//							$rootScope.pusher.disconnect();
//						} catch (e) {}
//
//						/**
//						 * Trying to connect
//						 */
//						$rootScope.pusher.connect();
//
//						/**
//						 * Binding default channels
//						 */
//						bindDefaultChannels();
//
//						$timeout(function() {
//							/**
//							 * If connected, restore max retries.
//							 */
//							if( $rootScope.pusher && $rootScope.pusher.connection.state === 'connected' ) {
//								maxRetries = 100;
//							}
//						}, 1000);
//					}
//				}, 5000);
//			})();
//		};
	}]);
})( angular, SFApplication );