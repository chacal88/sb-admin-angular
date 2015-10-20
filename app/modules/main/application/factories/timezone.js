
(function( doc, ng, tz, app ) {

	"use strict";

	/* Factory Crypto */
	app.factory('timezoneFactory', ['$log', function($log) {
		return {
			timezone: function() {
				return tz;
			},
			detect: function() {
				return tz.determine().name();
			}
		};
	}]);

})( document, angular, jstz, SFApplication );