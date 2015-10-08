(function(ng, app) {

	"use strict";

	/* Application Directive: Accordion */
	app.directive('chat', [ function() {
		return {
			templateUrl : 'modules/main/application/directives/chat/chat.html',
			restrict : 'E',
			replace : true,
		}
	} ]);

})(angular, SFApplication);