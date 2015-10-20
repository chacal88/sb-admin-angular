/**
 * If global variable doesn't exist, create a new object.
 */
if( ! angular ) {
	angular = {};
}

angular.isEmpty = function(a) {
	return !!( angular.isUndefined( a ) || angular.equals( a, null ) || ( angular.isArray( a ) && a.length === 0 ) || ( angular.isString( a ) && ( a.length === 0 || angular.equals( a, '' ) ) ) );
};