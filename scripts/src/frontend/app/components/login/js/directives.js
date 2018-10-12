(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

// duplicated at components/rima/directives.js
var SLASH_ENCODING = '___';
var decodeRoute = function(routeEncoded){
	var route = decodeURI(routeEncoded);
	var slashIndex = 0;

	// replace the first level
	var slash0 = SLASH_ENCODING+"0";
	var rx = new RegExp(slash0, 'gi');
	route = route.replace(rx, '/');

	// decrease next levels
	for(var i=1; i<10; i++){
		var slashCurrent = SLASH_ENCODING+i;
		var rx = new RegExp(slashCurrent, 'gi');
		var slashLess = SLASH_ENCODING+(i-1);
		route = route.replace(rx, slashLess);
	}
	return route;
};

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
					$scope.route = decodeRoute($routeParams.route);
				}

				$scope.whoAmI = RimaService.getWhoAmI();

				$scope.followRoute = function(){
					if($scope.route){
						// alert("redirecting to: " + $scope.route);
						$location.path($scope.route);
					}
				};

				$scope.login = function(){
					if(!$scope.user.e_mail){
						window.alert("Please provide your e-mail");
						return;
					}
					RimaService.login($scope.user, "by_email", function(whoAmI){
						if(whoAmI && whoAmI._id){
							$scope.whoAmI = RimaService.getWhoAmI();
							// $location.path('/maps');
						}else{
							window.alert("Login unsuccessful. Please verify your credentials and try again!");
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
					$scope.route = decodeRoute($routeParams.route);
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
					if(!$scope.user.firstname){
						window.alert("Please provide your name");
						return;
					}
					if(!$scope.user.familyname){
						window.alert("Please provide your surname");
						return;
					}
					if(!$scope.user.displayName){
						window.alert("Please provide your display name");
						return;
					}
					if(!$scope.user.e_mail){
						window.alert("Please provide your e-mail");
						return;
					}

					var user = RimaService.createWhoAmI($scope.user,true, false);
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
