//Declare app level module which depends on filters, and services
var SFApplication = angular.module(
		'SFApplication',
		[
			'oc.lazyLoad',
			'ui.router',
			'ui.bootstrap',
			'angular-loading-bar',
			'webStorageModule',
			'SFApplicationAuth.Auth'
		]);

/**
 * Configure Web Application
 */
SFApplication.config(
	[
		'$stateProvider',
		'$urlRouterProvider',
		'$locationProvider',
		'$ocLazyLoadProvider',
		'$httpProvider',
		'applicationData',
	function (
		$stateProvider,
		$urlRouterProvider,
		$locationProvider,
		$ocLazyLoadProvider,
		$httpProvider,
		applicationData
	) {
		$ocLazyLoadProvider.config({
			debug:true,
			events:true,
		});

		console.log("inciando bootstrap main");
		/**
		 * Enable cross-domain requests
		 */
		//$httpProvider.defaults.useXDomain = true;

		/**
		 * Set AJAX request header to all requests
		 */
	//	$httpProvider.defaults.headers.common[ 'X-Requested-With' ] = 'XMLHttpRequest';

		/**
		 * Adding http interceptor
		 */
		$httpProvider.interceptors.push( 'handlerInterceptorFactory' );

		/**
		 * Default
		 */
		$urlRouterProvider.otherwise('/dashboard/home');

		$stateProvider
		.state('dashboard', {
			url:'/dashboard',
			data: {
				isPublic: false
			},
			templateUrl: 'modules/main/partials/dashboard/main.html',
			resolve: {
				loadMyDirectives:function($ocLazyLoad){
					return $ocLazyLoad.load(
					{
						name:'SFApplication',
						files:[
							'modules/main/application/directives/header/header.js',
							'modules/main/application/directives/header/header-notification/header-notification.js',
							'modules/main/application/directives/sidebar/sidebar.js',
							'modules/main/application/directives/sidebar/sidebar-search/sidebar-search.js'
						]
					}),
					$ocLazyLoad.load(
					{
							name:'toggle-switch',
							files:[
								"bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
								"bower_components/angular-toggle-switch/angular-toggle-switch.css"
							]
					}),
					$ocLazyLoad.load(
					{
						name:'ngAnimate',
						files:['bower_components/angular-animate/angular-animate.js']
					})
					$ocLazyLoad.load(
					{
						name:'ngCookies',
						files:['bower_components/angular-cookies/angular-cookies.js']
					})
					$ocLazyLoad.load(
					{
						name:'ngResource',
						files:['bower_components/angular-resource/angular-resource.js']
					})
					$ocLazyLoad.load(
					{
						name:'ngSanitize',
						files:['bower_components/angular-sanitize/angular-sanitize.js']
					})
					$ocLazyLoad.load(
					{
						name:'ngTouch',
						files:['bower_components/angular-touch/angular-touch.js']
					})
				}
			}
		})
		.state('dashboard.home',{
			url:'/home',
			controller: 'ApplicationController',
			templateUrl:'modules/main/partials/dashboard/home.html',
			resolve: {
				loadMyFiles:function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name:'SFApplication',
						files:[
							'modules/main/application/controllers/main.js',
							'modules/main/application/directives/timeline/timeline.js',
							'modules/main/application/directives/notifications/notifications.js',
							'modules/main/application/directives/chat/chat.js',
							'modules/main/application/directives/dashboard/stats/stats.js'
						]
					})
				}
			}
		})
		.state('dashboard.profile',{
			url:'/profile',
			controller: 'ProfileController',
			templateUrl:'modules/main/partials/profile/index.html'
		})
		.state('dashboard.form',{
			templateUrl:'modules/main/partials/form.html',
			url:'/form'
		})
		.state('dashboard.blank',{
			templateUrl:'modules/main/partials/pages/blank.html',
			url:'/blank'
		})
		.state('login',{
			templateUrl:'modules/main/partials/pages/login.html',
			url:'/login'
		})
		.state('dashboard.chart',{
			templateUrl:'modules/main/partials/chart.html',
			url:'/chart',
			controller:'ChartCtrl',
			resolve: {
				loadMyFile:function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name:'chart.js',
						files:[
							'bower_components/angular-chart.js/dist/angular-chart.min.js',
							'bower_components/angular-chart.js/dist/angular-chart.css'
						]
					}),
					$ocLazyLoad.load({
						name:'SFApplication',
						files:['modules/main/application/controllers/chartContoller.js']
					})
				}
			}
		})
		.state('dashboard.table',{
			templateUrl:'modules/main/partials/table.html',
			url:'/table'
		})
		.state('dashboard.panels-wells',{
			templateUrl:'modules/main/partials/ui-elements/panels-wells.html',
			url:'/panels-wells'
		})
		.state('dashboard.buttons',{
			templateUrl:'modules/main/partials/ui-elements/buttons.html',
			url:'/buttons'
		})
		.state('dashboard.notifications',{
			templateUrl:'modules/main/partials/ui-elements/notifications.html',
			url:'/notifications'
		})
		.state('dashboard.typography',{
				templateUrl:'modules/main/partials/ui-elements/typography.html',
				url:'/typography'
			})
		.state('dashboard.icons',{
				templateUrl:'modules/main/partials/ui-elements/icons.html',
				url:'/icons'
			})
		.state('dashboard.grid',{
				templateUrl:'modules/main/partials/ui-elements/grid.html',
				url:'/grid'
			})
		}]
	);
/**
 * Application bootstrap
 */
SFApplication.run([
		'$rootScope', '$window', '$http', '$log', '$filter',
		function($rootScope, $window, $http, $log, $filter) {

			$log.log('Running Application...');

			$http.defaults.transformResponse.push(function(data) {
				$(window).trigger('resize');
				return data;
			});

			/**
			 * Get previous and current state.
			 */
			$rootScope.previousState;
			$rootScope.currentState;
			$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
				$rootScope.previousState = { name: from.name, params: fromParams };
				$rootScope.currentState = { name: to.name, params: toParams };
			});
		} ]);