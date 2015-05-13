(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

/* App Module */

angular.module('KnAllEdgeApp',[
	  'ngRoute'
	, 'ngSanitize' // necessary for outputing HTML in angular directive
	, 'ngStorage' // local storage support for Angular

	, 'ui.bootstrap' // UI-bootstrap
	, 'textAngular'
	// , 'textAngularSetup'

	, 'knalledgeMapDirectives' // KnAllEdge Map component
	, 'knalledgeMapServices'
	// , 'rimaUserServices'

	, 'rimaServices'
	, 'rimaDirectives'
	, 'rimaFilters'

	, 'notifyServices'
	, 'notifyDirectives'
])
// routes
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/map', {
		templateUrl: '../components/knalledgeMap/partials/index.tpl.html'
	})
	.when('/map/id/:id', {
		templateUrl: '../components/knalledgeMap/partials/index.tpl.html'
	})
	.when('/maps', {
		templateUrl: '../components/knalledgeMap/partials/knalledgeMaps-index.tpl.html'
	})
	.otherwise({
		redirectTo: '/maps'
	});
}])
// Disabling Debug Data
// https://docs.angularjs.org/guide/production#disabling-debug-data
//.config(['$compileProvider', function ($compileProvider) {
//	$compileProvider.debugInfoEnabled(false);
//}])
;

}()); // end of 'use strict';