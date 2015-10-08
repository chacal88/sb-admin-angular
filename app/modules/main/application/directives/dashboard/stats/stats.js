(function(ng, app) {

	"use strict";

	/* Application Directive: Accordion */
	app.directive(
		'stats',
		[ function() {
			return {
				templateUrl : 'modules/main/application/directives/dashboard/stats/stats.html',
				restrict : 'E',
				replace : true,
				scope : {
					'model' : '=',
					'comments' : '@',
					'number' : '@',
					'name' : '@',
					'colour' : '@',
					'details' : '@',
					'type' : '@',
					'goto' : '@'
				}
			}
		}]
	);
})(angular, SFApplication);