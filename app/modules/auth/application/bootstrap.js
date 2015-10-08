//Declare app level module which depends on filters, and services
var SFApplicationAuth = angular.module('SFApplicationAuth.Auth', []);

SFApplicationAuth.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('auth', {
		url: '/auth',
		abstract: true,
		templateUrl: 'application/auth/partials/template.html',
		data: {
			isPublic: true
		}
	});

	$stateProvider.state('auth.login', {
		url: '/login',
		views: {
			'authContent': {
				templateUrl: 'application/auth/partials/login.html',
				controller: 'Auth.Index.Index'
			}
		}
	});

	$stateProvider.state('auth.logout', {
		url: '/logout',
		views: {
			'authContent': {
				controller: ['$state', 'authFactory', '$rootScope', 'applicationData', '$interval', function($state, authFactory, $rootScope, applicationData, $interval) {
					/**
					 * Call auth to clean session
					 */
					authFactory.clearSession();

					/**
					 * Unbind all events from Pusher.
					 */
					$interval.cancel($rootScope.pusherInterval);
					$rootScope.pusher.unsubscribe(applicationData.userId);
					$rootScope.pusher.unsubscribe(applicationData.accountId);

					/**
					 * Redirect to login page.
					 */
					$state.go('auth.login');
				}]
			}
		}
	});

	$stateProvider.state('auth.reset-password', {
		url: '/reset-password',
		views: {
			'authContent': {
				templateUrl: 'application/auth/partials/reset-password.html',
				controller: 'Auth.Index.Index'
			}
		}
	});
}]);

SFApplicationAuth.run(['$rootScope', '$state', '$location', '$log', 'authFactory', '$translate', function($rootScope, $state, $location, $log, authFactory, $translate) {

	$log.log('Running Auth...');

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		$log.log('$stateChangeStart');

		$ionicLoading.show({
			template: $translate('Loading') + '...'
		});

		if( toState && ( "data" in toState ) === true && ( "isPublic" in toState.data ) === true && toState.data.isPublic == true ) {
			$log.log( 'Public page...' );
		} else if( toState && ( "data" in toState ) === true && ( ( "isPublic" in toState.data ) === false || ( "isPublic" in toState.data ) === true && toState.data.isPublic == false ) ) {
			$log.log( 'Private page...' );
			/**
			 * Check if has some webSession active and do the logout.
			 */
			if( ! authFactory.checkIsLogged() ) {
				$log.error( 'You don\'t have permission to access this area.' );

				/**
				 * Prevent Default action.
				 */
				event.preventDefault();

				/**
				 * Redirect to login
				 */
				$state.go( 'auth.logout' );
			}
		}
	});

	$rootScope.$on('$stateChangeSuccess', function(next, current) {
		$log.log('$stateChangeSuccess');
	});

	$rootScope.$on('$stateChangeError', function(next, current) {
		$log.log('$stateChangeError');
	});

	$rootScope.$on('$stateUpdate', function(next, current) {
		$log.log('$stateUpdate');
	});

	$rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
		$log.log('$stateNotFound');
		$log.log(unfoundState.to); // "lazy.state"
		$log.log(unfoundState.toParams); // {a:1, b:2}
		$log.log(unfoundState.options); // {inherit:false} + default options
	});

	$rootScope.$on('$viewContentLoading', function(event, viewConfig){
		$log.log('$viewContentLoading');
	});

	$rootScope.$on('$viewContentLoaded', function(event, viewConfig){
		$log.log('$viewContentLoaded');
	});
}]);