(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('loginDirectives', ['Config'])
	.directive('loginAuthentication', ['$rootScope', '$routeParams', '$window', '$location', 'RimaService',
		function($rootScope, $routeParams, $window, $location, RimaService){
		console.log("[loginAuthentication] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/login/partials/login_authentication.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};

				if($routeParams.iAmId){
					RimaService.setIAmId($routeParams.iAmId);
				}else{
					$routeParams.iAmId = RimaService.getIAmId();
				}

				if($routeParams.token){
					RimaService.setUserToken($routeParams.token);
				}else{
					$routeParams.token = RimaService.getUserToken();
				}

				$scope.iAmId = $routeParams.iAmId;
				$scope.token = $routeParams.token;
				$scope.route = $routeParams.route;

				if($scope.route){
					$location.path($scope.route);
				}
			}
    	};
	}])

	.directive('loginLogout', ['$rootScope', '$routeParams', '$window', '$location', 'RimaService',
		function($rootScope, $routeParams, $window, $location, RimaService){
		console.log("[loginLogout] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/login/partials/logout.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};

				$scope.iAmId = RimaService.getIAmId();
				RimaService.logout();
			}
    	};
	}])
}()); // end of 'use strict';
