(function(ng, app) {

	"use strict";

	/* Application Directive: Accordion */
	app.directive(
		'headerNotification',
		[ function() {
			return {
				templateUrl : 'modules/main/application/directives/header/header-notification/header-notification.html',
				restrict : 'E',
				replace : true,
			}
		} ]
	);
})(angular, SFApplication);
