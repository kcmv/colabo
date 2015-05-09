(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('rimaDirectives', ['Config'])
	.directive('rimaWhats', ['$rootScope', 'WhatAmIService', 'WhatService',
		function($rootScope, WhatAmIService, WhatService){
		console.log("[rimaWhats] loading directive");
		return {
			restrict: 'AE',
			scope: {
				'readonly': '=',
				'node': "="
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/rima/partials/rima-whats.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
					viewspec: 'viewspec_manual'
				};

				$scope.items = WhatService.getWhats();
				$scope.getItems = function(value){
					var items = WhatAmIService.getByNameContains(value);
					// return items;
					return items.$promise;
					// return items.$promise.then(function(items_server){
					// 	console.log("getItems: ", JSON.stringify(items_server));
					// 	// return WhatService.getWhats();
					// 	return items_server;
					// });
				};

				$scope.enterPressed = function(value){
					console.log("Enter pressed. value: %s", value);
					$scope.addNewWhat(value);
				};

				$scope.addClicked = function(value){
					console.log("Add clicked. value: %s", value);
					$scope.addNewWhat(value);
				};

				$scope.addNewWhat = function(name){
					// not clicked on any item, but just type a string
					if(typeof value === 'string'){
						if(!node){
							console.log("Node is not selected");
							return;
						}
						console.log("Adding new what to the node: %d", node.kNode._id);
					}
					else{
						console.log("Value type is: %s", typeof value);
					}
				};

				$scope.selected = function($item, $model, $label){
					console.log("selected: $item: %s, $model: %s, $label: %s", JSON.stringify($item), JSON.stringify($model), JSON.stringify($label));
				};
			}
    	};
	}])

	.directive('rimaHows', ["$rootScope", "$timeout", "$location", "RimaService",
		function($rootScope, $timeout, $location, RimaService){
		console.log("[rimaHows] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/rima/partials/rima-hows.tpl.html',
			controller: function ( $scope, $element) {
				var init = function(){
					$scope.items = RimaService.getUsersHows(RimaService.getActiveUserId());
			    	//$scope.selectedItem = RimaService.getActiveUser();
				}
				$scope.items = null;
				$scope.selectedItem = null;

				//html-select:
				$scope.hows = RimaService.getHows();
				$scope.selectedHowOption= {id:1};

				$scope.createHow = function(){
					var how = new knalledge.HowAmI();
					how.whoAmI = RimaService.getActiveUserId();
					var selectedHow = RimaService.getHowForId($scope.selectedHowOption);
					how.how = selectedHow.title;
					how.whatAmI = $scope.whatInput; //TODO:
					RimaService.createHowAmI(how);
				}
				 //TODO: select from map.dataContent.mcm.authors list
				//RimaService.loadUsersFromList().$promise.then(init); //TODO: change to load from MAP
				init();
				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + $scope.selectedItem.displayName + ": " + $scope.selectedItem._id);
				};
				$scope.whatChanged = function(item) {
					
				}
    		}
    	};
	}])

	.directive('rimaWhat', ['$rootScope', 'RimaService',
		function($rootScope, RimaService){
		console.log("[rimaWhats] loading directive");
		return {
			restrict: 'AE',
			scope: {
				'readonly': '=',
				'item': '='
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/rima/partials/rima-what.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
					viewspec: 'viewspec_manual'
				};

				$scope.viewspecChanged = function(){
					console.log("[rimaWhats] viewspec: %s", $scope.bindings.viewspec);
					var viewspecChangedEventName = "viewspecChangedEvent";
					//console.log("result:" + JSON.stringify(result));
					$rootScope.$broadcast(viewspecChangedEventName, $scope.bindings.viewspec);
				};
			}
    	};
	}]);

}()); // end of 'use strict';
