(function( ng, app ) {

	"use strict";

	/* Application Directive*/
	app.directive('fader', [function() {
		return {
			restrict : 'A',
			link : function(scope, element, attrs) {
				element.fadeIn( 400 ).delay( 5000 ).fadeOut( 400 );
			}
		}
	}]);

})( angular, SFApplicationAuth );