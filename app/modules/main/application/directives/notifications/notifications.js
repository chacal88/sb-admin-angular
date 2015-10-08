(function(ng, app) {

	"use strict";

	/* Application Directive: Accordion */
	app.directive(
		'notifications',
		[ function() {
			return {
				templateUrl : 'modules/main/application/directives/notifications/notifications.html',
				restrict : 'E',
				replace : true,
			}
		} ]);
})(angular, SFApplication);
