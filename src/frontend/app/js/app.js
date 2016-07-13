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

requiresList.push('gardeningServices');

requiresList.push('topiChatServices');
requiresList.push('topiChatDirectives');

requiresList.push('collaboBroadcastingServices');

// we want to avoid hardoced registering plugins here
requiresList.push('ontovServices');

requiresList.push('requestServices');
requiresList.push('suggestionServices');
requiresList.push('changeServices');


// a module that contains ng2 directives and services downgraded for ng1 space
// requiresList.push('KnAllEdgeNg2');

// console.log('GOTOVO b');

angular.module('KnAllEdgeApp', requiresList)
// routes
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/map/id/:id', {
		templateUrl: 'components/knalledgeMap/partials/new-index.tpl.html',
		// https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
		// http://stackoverflow.com/questions/17981281/change-route-parameters-without-updating-view
		reloadOnSearch: false
	})
	.when('/map/id/:id/route/:route?', {
		templateUrl: 'components/knalledgeMap/partials/new-index.tpl.html',
		reloadOnSearch: false
	})
	.when('/map/id/:id/node_id/:node_id?/route/:route?', {
		templateUrl: 'components/knalledgeMap/partials/new-index.tpl.html',
		reloadOnSearch: false
	})
	.when('/maps', {
		templateUrl: 'components/mapsList/maps-list-index.tpl.html'
	})
	// http://localhost:8410/app/index-dev.html#/register
	.when('/register', {
		templateUrl: 'components/login/partials/register-index.tpl.html'
	})
	.when('/register/route/:route?', {
		templateUrl: 'components/login/partials/register-index.tpl.html'
	})
	// http://localhost:8410/app/index-dev.html#/login/iAmId
	.when('/login', {
		templateUrl: 'components/login/partials/index.tpl.html'
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
	.when('/login/route/:route?', {
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
	.when('/whoAmI/route/:route?', {
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
	.when('/topichat', {
		templateUrl: 'components/topiChat/partials/topichat-index.tpl.html'
	})
	.when('/topichat-report', {
		templateUrl: 'components/topiChat/partials/report-index.tpl.html'
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

.config(['RimaServiceProvider', function(RimaServiceProvider){
	RimaServiceProvider.$init(
		window.Config.Plugins.puzzles.rima.config.rimaService);
}])

.config(['KnalledgeMapVOsServiceProvider', function(KnalledgeMapVOsServiceProvider){
	KnalledgeMapVOsServiceProvider.$init(
		window.Config.Plugins.puzzles.knalledgeMap.config.knalledgeMapVOsService);
}])

// Disabling Debug Data
// https://docs.angularjs.org/guide/production#disabling-debug-data
//.config(['$compileProvider', function ($compileProvider) {
//	$compileProvider.debugInfoEnabled(false);
//}])
;

// angular.bootstrap(document.body, ['KnAllEdgeApp'], {strictDi: false});

}()); // end of 'use strict';
