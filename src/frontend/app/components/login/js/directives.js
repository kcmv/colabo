(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var SLASH_ENCODING = '___';

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
			templateUrl: 'components/login/partials/login_authentication.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};

				$scope.user = new knalledge.WhoAmI();

				// $scope.user.e_mail = "mprinc@gmail.com";

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
				if($routeParams.route){
					$scope.route = decodeURI($routeParams.route);
					var rx = new RegExp(SLASH_ENCODING, 'gi');
					$scope.route = $scope.route.replace(rx, '/');
				}

				$scope.whoAmI = RimaService.getWhoAmI();

				$scope.followRoute = function(){
					if($scope.route){
						// alert("redirecting to: " + $scope.route);
						$location.path($scope.route);
					}
				};

				$scope.login = function(){
					RimaService.login($scope.user, "by_email", function(whoAmI){
						if(whoAmI && whoAmI._id){
							$location.path('/maps');
						}
					});
				};
				$scope.logout = function(){
					$location.path('/logout');
				};

				$scope.register = function(){
					$location.path('/register');
				};

				$scope.gotoMainPage = function(){
					$location.path('/maps');
				};
			}
    	};
	}])

	.directive('loginCheck', ['$rootScope', '$routeParams', '$window', '$timeout', '$location', 'RimaService',
		function($rootScope, $routeParams, $window, $timeout, $location, RimaService){
		console.log("[loginAuthentication] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: 'components/login/partials/login_check.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};

				$scope.whoAmI = RimaService.getWhoAmI();

				// TODO: use broadcasting instead of timeout pulling
				var recheck = function() {
					$scope.whoAmI = RimaService.getWhoAmI();
					$timeout(recheck, 1000);
				};

				recheck();

				$scope.login = function(){
					$location.path('/login');
				};

				$scope.logout = function(){
					$location.path('/logout');
				};

				$scope.gotoMainPage = function(){
					$location.path('/maps');
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
			templateUrl: 'components/login/partials/logout.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};

				$scope.iAmId = RimaService.getIAmId();
				$scope.whoAmI = RimaService.getWhoAmI();
				RimaService.logout();

				$scope.login = function(){
					$location.path('/login');
				};

				$scope.gotoMainPage = function(){
					$location.path('/maps');
				}
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
			templateUrl: 'components/login/partials/register.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};

				$scope.user = new knalledge.WhoAmI();
				// $scope.user.firstname = "Sasha";
				// $scope.user.familyname = "Rudan";
				// $scope.user.affiliation = "University of Oslo";
				// $scope.user.e_mail = "mprinc@gmail.com";

				// $scope.iAmId = RimaService.getIAmId();

				if($routeParams.route){
					$scope.route = decodeURI($routeParams.route);
					var rx = new RegExp(SLASH_ENCODING, 'gi');
					$scope.route = $scope.route.replace(rx, '/');
				}

				$scope.followRoute = function(){
					if($scope.route){
						// alert("redirecting to: " + $scope.route);
						$location.path($scope.route);
					}
				};

				$scope.cancelled = function(){

				};

				$scope.createNew = function(){
					var user = RimaService.createWhoAmI($scope.user);
					user.$promise.then(function(userFromServer){
						var path = '/login';
						// forward route
						if($routeParams.route){
							path += '/route/'
								+ $routeParams.route;
						}
						$location.path(path);
					});
				};

				// RimaService.logout();
			}
    	};
	}])

}()); // end of 'use strict';
