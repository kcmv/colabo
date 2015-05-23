(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

/* App Module */

angular.module('KnAllEdgeApp',[
	  'ngRoute'
	, 'ngSanitize' // necessary for outputing HTML in angular directive
	, 'ngStorage' // local storage support for Angular
	, 'ngAnimate'

	, 'ui.bootstrap' // UI-bootstrap
	, 'textAngular'
	// , 'textAngularSetup'
	, 'ngWizard'

	, 'knalledgeMapServices' // KnAllEdge Map component
	, 'knalledgeMapDirectives'
	// , 'rimaUserServices'

	, 'loginServices'
	, 'loginDirectives'

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
	// http://localhost:8410/app/index-dev.html#/login/iAmId
	.when('/login/iAmId/:iAmId?', {
		templateUrl: '../components/login/partials/index.tpl.html'
	})
	// https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
	// http://stackoverflow.com/questions/17510962/can-angularjs-routes-have-optional-parameter-values
	// http://localhost:8410/app/index-dev.html#/login/iAmId/55268521fb9a901e442172f8/token/1/route/whoAmI
	.when('/login/iAmId/:iAmId/token/:token?/route/:route?', {
		templateUrl: '../components/login/partials/index.tpl.html'
	})
	// http://localhost:8410/app/index-dev.html#/logout
	.when('/logout', {
		templateUrl: '../components/login/partials/logout-index.tpl.html'
	})
	// http://localhost:8410/app/index-dev.html#/whoAmI
	.when('/whoAmI', {
		templateUrl: '../components/rima/partials/rima-whoAmI.tpl.html'
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