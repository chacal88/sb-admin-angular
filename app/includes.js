var files = {
	"library" : [
			"bower_components/jquery/dist/jquery.min.js",
			"bower_components/bootstrap/dist/js/bootstrap.min.js",
			"bower_components/angular/angular.min.js",
			"bower_components/angular-ui-router/release/angular-ui-router.min.js",
			"bower_components/json3/lib/json3.min.js",
			"bower_components/oclazyload/dist/ocLazyLoad.min.js",
			"bower_components/angular-loading-bar/build/loading-bar.min.js",
			"bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
			"bower_components/metisMenu/dist/metisMenu.min.js",
			"bower_components/Chart.js/Chart.min.js",
			"bower_components/angular-webstorage/angular-webstorage.min.js",
			"bower_components/angular-translate/angular-translate.min.js",
			"resources/js/sb-admin-2.js",
			"bower_components/angular-cookies/angular-cookies.js",
			"modules/overrides.js",
			"resources/js/underscore/underscore-min.js",
			"resources/js/moment.min.js"
			],
	"bootstrap" : [ 
			"modules/auth/application/bootstrap.js",
			"modules/main/application/bootstrap.js"
			],
	"factories" : [ 
			"modules/main/application/factories/interceptor.js",
			"modules/main/application/factories/socket.js",
			"modules/auth/application/factories/auth.js"
			],
	"constants" : [ 
			"modules/main/application/constants/constants.js",
			"modules/main/application/controllers/application.js"
			],
	"directives" : [
			"modules/auth/application/directives/fader.js"
			],
	"controllers" : [
			"modules/auth/application/controllers/auth/index.js",
			"modules/main/application/controllers/profile/index.js",
			"modules/auth/application/controllers/auth/logout.js"],
	"services" : [
			"modules/auth/application/services/auth/index.js",
			"modules/main/application/services/user/reset-password.js",
			"modules/main/application/services/user/index.js"
			]
};
var readSection = function(section) {
	for (var i = 0; i < files[section].length; i++) {
		document.write('<script type="text/javascript" src="'
				+ files[section][i] + '"></script>');
	}
}
readSection("library");
readSection("bootstrap");
readSection("factories");
readSection("constants");
readSection("directives");
readSection("controllers");
readSection("services");