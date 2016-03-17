(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

/* App Module */

var requiresList = [
	  'ngRoute'
	, 'ngSanitize' // necessary for outputing HTML in angular directive
	, 'ngStorage' // local storage support for Angular
	, 'ngAnimate'

	, 'ui.bootstrap' // UI-bootstrap
	, 'textAngular'
	// , 'textAngularSetup'
	, 'ngWizard'
	, 'btford.socket-io'

	, 'collaboPluginsServices'
	, 'collaboPluginsDirectives'

	, 'knalledgeMapServices' // KnAllEdge Map component
	, 'knalledgeMapDirectives'
];

requiresList.push('rimaServices');
requiresList.push('rimaDirectives');
requiresList.push('rimaFilters');

requiresList.push('loginServices');
requiresList.push('loginDirectives');

requiresList.push('notifyServices');
requiresList.push('notifyDirectives');

requiresList.push('topiChatServices');
requiresList.push('topiChatDirectives');

// we want to avoid hardoced registering plugins here
requiresList.push('ontovServices');

// a module that contains ng2 directives and services downgraded for ng1 space
requiresList.push('KnAllEdgeNg2');

angular.module('KnAllEdgeApp', requiresList)
// routes
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/map', {
		templateUrl: 'components/knalledgeMap/partials/new-index.tpl.html'
	})
	.when('/map/id/:id', {
		templateUrl: 'components/knalledgeMap/partials/new-index.tpl.html'
	})
	.when('/maps', {
		templateUrl: 'components/knalledgeMap/partials/knalledgeMaps-index.tpl.html'
	})
	// http://localhost:8410/app/index-dev.html#/login/iAmId
	.when('/login/iAmId/:iAmId?', {
		templateUrl: 'components/login/partials/index.tpl.html'
	})
	// https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
	// http://stackoverflow.com/questions/17510962/can-angularjs-routes-have-optional-parameter-values
	// http://localhost:8410/app/index-dev.html#/login/iAmId/55268521fb9a901e442172f8/token/1/route/whoAmI
	.when('/login/iAmId/:iAmId/token/:token?/route/:route?', {
		templateUrl: 'components/login/partials/index.tpl.html'
	})
	// http://localhost:8410/app/index-dev.html#/logout
	.when('/logout', {
		templateUrl: 'components/login/partials/logout-index.tpl.html'
	})
	// http://localhost:8410/app/index-dev.html#/whoAmI
	.when('/whoAmI', {
		templateUrl: 'components/rima/partials/rima-whoAmI.tpl.html'
	})
	.when('/rima-insights', {
		templateUrl: 'components/rima/partials/rima-insights.tpl.html'
	})
	.when('/rima-insights-map', {
		templateUrl: 'components/rima/partials/rima-insights-map.tpl.html'
	})
	.when('/plugins', {
		templateUrl: 'components/collaboPlugins/partials/plugins-index.tpl.html'
	})
	.otherwise({
		redirectTo: '/maps'
	});
}])

.config(['$tooltipProvider', function($tooltipProvider){
  $tooltipProvider.setTriggers({
    'mouseenter': 'mouseleave',
    'click': 'click',
    'focus': 'blur',
    'never': 'mouseleave', // <- This ensures the tooltip will go away on mouseleave
    'always': 'mouseleave', // <- This ensures the tooltip will go away on mouseleave
    'openTrigger': 'closeTrigger',
    'show': 'hide'
  });
}])
// Disabling Debug Data
// https://docs.angularjs.org/guide/production#disabling-debug-data
//.config(['$compileProvider', function ($compileProvider) {
//	$compileProvider.debugInfoEnabled(false);
//}])
;

// angular.bootstrap(document.body, ['KnAllEdgeApp'], {strictDi: false});

}()); // end of 'use strict';
