(function(ng, app) {

	"use strict";

	/* Application Directive: Accordion */
	app.directive(
		'header',
		[ function() {
			return {
				templateUrl : 'modules/main/application/directives/header/header.html',
				restrict : 'E',
				replace : true,
			}
		}]
	);
})(angular, SFApplication);