(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

/* App Module */

var knalledgeApp=angular.module('knalledgeApp',[
	  'ngRoute'
	, 'ngSanitize' // necessary for outputing HTML in angular directive
	, 'ngStorage' // local storage support for Angular
	
	, 'knalledgeMapDirectives' // KnAllEdge Map component
	, 'knalledgeMapServices'
])
// routes
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/knalledge', {
		templateUrl: '../components/KnAllEdgeMap/partials/index.tpl.html'
	})
	.otherwise({
		redirectTo: '/knalledge'
	});
}])
// Disabling Debug Data
// https://docs.angularjs.org/guide/production#disabling-debug-data
.config(['$compileProvider', function ($compileProvider) {
	//$compileProvider.debugInfoEnabled(false);
}]);

}()); // end of 'use strict';