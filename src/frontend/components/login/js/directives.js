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

				$scope.whoAmI = RimaService.getWhoAmI();

				if($scope.route){
					$location.path($scope.route);
				}

				$scope.logout = function(){
					$location.path('/logout');
				};
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
				$scope.whoAmI = RimaService.getWhoAmI();
				RimaService.logout();
			}
    	};
	}])

	.directive('loginRegister', ['$rootScope', '$routeParams', '$window', '$location', 'RimaService',
		function($rootScope, $routeParams, $window, $location, RimaService){
		console.log("[loginRegister] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/login/partials/register.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};

				$scope.user = new knalledge.WhoAmI();
				$scope.user.firstname = "Sasha";
				$scope.user.familyname = "Rudan";
				$scope.user.affiliation = "University of Oslo";
				$scope.user.e_mail = "mprinc@gmail.com";

				// $scope.iAmId = RimaService.getIAmId();

				$scope.cancelled = function(){

				};

				$scope.createNew = function(){
					var user = RimaService.createWhoAmI($scope.user);
					user.$promise.then(function(userFromServer){

					});
				};

				// RimaService.logout();
			}
    	};
	}])

}()); // end of 'use strict';
