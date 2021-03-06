(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('notifyDirectives', ['Config'])
	.directive('notifyRelevantList', ['$rootScope', 'NotifyService',
		function($rootScope, WhatAmIService){
		console.log("[notifyWhats] loading directive");
		return {
			restrict: 'AE',
			scope: {
				'readonly': '=',
				'node': "="
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: 'components/notify/partials/notify-relevant-list.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};
			}
    	};
	}])

}()); // end of 'use strict';
