(function( doc, ng, app ) {

	"use strict";

	/* Socket Factory Pusher Events */
	app.factory('socketFactory', ['applicationData', '$log','$rootScope', function(applicationData, $log, $rootScope) {
		return {
			trigger: function(channel, event, data, callback) {
				$rootScope.pusherRegistration(applicationData);
				var triggered = $rootScope.pusher.channels.channels[channel].trigger(event, data);
			}
		}
	}]);

})( document, angular, SFApplication );