(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('collaboPluginsDirectives', ['Config'])
	.directive('collaboPluginsList', ['$rootScope', 'CollaboPluginsService',
		function($rootScope, CollaboPluginsService){

		// http://docs.angularjs.org/guide/directive

		return {
			restrict: 'EA',
			scope: {
				mapData: "=",
				mapConfig: "=",
				nodeSelected: "&"
			},
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: 'components/collaboPlugins/partials/plugins-list.tpl.html',
			link: function ($scope, $element) {
				$scope.getItemsNames = function(obj){
					return Object.keys(obj);
				};

				$scope.getItemsNo = function(obj){
					return Object.keys(obj).length;
				};

				$scope.pluginsInfo = CollaboPluginsService.getPluginsInfo();
				$scope.pluginsNo = Object.keys($scope.pluginsInfo).length;

				$scope.referencesInfo = CollaboPluginsService.getReferencesInfo();
				$scope.referencesNo = Object.keys($scope.referencesInfo).length;

				$scope.apisInfo = CollaboPluginsService.getApisInfo();
				$scope.apisNo = Object.keys($scope.apisInfo).length;
			},

			controller: function ( $scope, $element) {

			}
    	};
	}])
;

}()); // end of 'use strict';
