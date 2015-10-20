(function( ng, w, app ) {

	"use strict";

	var apiUrl = w['apiUrl'];
	var baseUrl = w['baseUrl'];
	var adminUrl = w['adminUrl'];
	
	/**
	 * Application constants.
	 */
	app.constant('applicationData', {
		'apiUrl': apiUrl,
		'baseUrl': baseUrl,
		'adminUrl': adminUrl,
		'documentTitle': document.title,
		'userLanguage': 'en_US',
		'userId': '',
		'sessionId': '',
		'pusher': {
			'apiKey': '',
			'authEndpoint': apiUrl + '/pusher/auth',
			'encrypted': true
		},
		'successTitle': 'Success',
		'errorTitle': 'Error',
		'serverErrorMessage': 'Sorry, an error has occurred. Please try again later.'
	});

	app.constant('keyCodes', {
		8: 'backspace',
		9: 'tab',
		13: 'enter',
		27: 'esc',
		32: 'space',
		33: 'pageup',
		34: 'pagedown',
		35: 'end',
		36: 'home',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		45: 'insert',
		46: 'delete'
	});

})( angular, window, SFApplication );
