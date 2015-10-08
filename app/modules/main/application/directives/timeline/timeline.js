(function(ng, app) {

	"use strict";

	/* Application Directive: Accordion */
	app.directive(
		'timeline',
		[ function() {
			return {
				templateUrl : 'modules/main/application/directives/timeline/timeline.html',
				restrict : 'E',
				replace : true,
			}
		} ]
	);
})(angular, SFApplication);
