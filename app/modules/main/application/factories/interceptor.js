(function( doc, ng, us, app ) {

	"use strict";

	/* Factory Auth Interceptor */
	app.factory('handlerInterceptorFactory', ['$injector', 'applicationData', '$q', function($injector, applicationData, $q) {

		var requestCallback = function requestCallback(configRaw) {			
			var config = ng.copy(configRaw);
			for (var key in config.params) {
				if (config.params[key] instanceof Array) {
					config.params[key + '[]'] = config.params[key].sort();
					delete config.params[key];
				}
			}
			return config || $q.when(config);
		};		
		
		var responseCallback = function responseCallback(response) {
			var $state = $injector.get('$state');

			if( ng.isDefined( $state.current.data ) && ! $state.current.data.isPublic ) {
				if( us.contains( [203, 401], response.status ) || ng.isEmpty( applicationData.sessionId ) ) {
					$state.go( 'auth.logout' );
					return $q.reject(response);
				} else if( us.contains( [500], response.status )) {
					return $q.reject(response);
				} 
			}

			return response || $q.when(response);
		};

		return {
			'request': requestCallback,
			'response': responseCallback,
			'responseError': responseCallback
		};
	}]);

})( document, angular, _, SFApplication );