(function() { // This prevents problems when concatenating scripts that aren't strict.
	'use strict';

	/**
	 * the namespace for core services for the KnAllEdge system
	 * @namespace knalledge.knalledgeMap.knalledgeMapDirectives
	 */

   angular.module('knalledgeMapDirectives')

	 .directive('knalledgeMapSelectItem', ['KnAllEdgeSelectItemService', function(KnAllEdgeSelectItemService) { // mcm_map_select_sub_entity
 		return {
 			restrict: 'AE',
 			// scope: {
 			// 	labels: '='
 			// },
 			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
 			// expression: http://docs.angulajrs.org/guide/expression
 			templateUrl: 'components/knalledgeMap/partials/knalledgeMap-selectItem.tpl.html',
 			link: function($scope, $element) {
 				// https://api.jquery.com/focus/
 				$element.find(".item_name").focus();
 			},

 			controller: function($scope, $element) {

 				$scope.selectedItem = null;
 				$scope.title = "Select Item";
 				$scope.path = ".";
 				$scope.item = {
 					name: null
 				};

 				$scope.selectItem = function(item) {
 					$scope.selectedItem = item;
 					console.log("$scope.selectedItem = " + JSON.stringify(item.name));
 					if ($scope.shouldSubmitOnSelection) {
 						$scope.submitted();
 					}
 				};

 				var populateItems = function(subName) {
 					console.log("getItemsDescsByName(%s)", subName);
 					$scope.itemType = KnAllEdgeSelectItemService.itemType;
 					$scope.items = KnAllEdgeSelectItemService.getItemsDescsByName(subName);
 					var dataContentItems = KnAllEdgeSelectItemService.getItemsDescsByDataContent(subName);
 					var found = false;
 					for(var i=0; i< dataContentItems.length; i++){ //there must be no duplicates and both search methods can return some same elements
 						found = false;
 						for(var j=0; j< $scope.items.length; j++){
 							if(dataContentItems[i] == $scope.items[j]){
 								found = true;
 								continue;
 							}
 						}
 						if(!found){
 							$scope.items.push(dataContentItems[i]);
 						}
 					}
 					console.log("$scope.items IN: " + $scope.items);
 				};

 				populateItems("");

 				$scope.nameChanged = function() {
 					//console.log("New searching Item name: %s", $scope.item.name);
 					populateItems($scope.item.name);
 					console.log("$scope.items: " + $scope.items);
 				};
 				$scope.cancelled = function() {
 					unbindEvents();
 					console.log("[KnAllEdgeSelectItemService] Cancelled");
 					//console.log("Canceled");
 					$element.remove(); //TODO: sta je ovo?
 					$scope.selectingCanceled();
 				};

 				$scope.submitted = function() {
 					unbindEvents();
 					console.log("[KnAllEdgeSelectItemService] Submitted");
 					if ($scope.selectedItem !== null && $scope.selectedItem !== undefined) {
 						$scope.selectingSubmited($scope.selectedItem);
 						$element.remove();
 					} else {
 						window.alert('Please, select a Item');
 					}
 				};

 				var unbindEvents = function() {
 					// https://docs.angularjs.org/api/ng/function/angular.element
 					// http://api.jquery.com/unbind/
 					angular.element("body").unbind("keydown keypress", keyboardProcessing);
 					$element.unbind("keydown keypress", keyboardProcessing);
 				};

 				var keyboardProcessing = function(event) {
 					if (event.which === 27) { // ECAPE
 						$scope.$apply(function() {
 							$scope.cancelled();
 						});

 						event.preventDefault();
 					}

 					if (event.which === 13) { // ENTER
 						// scope.$apply(function (){
 						//     $scope.$eval(attrs.ngEnter);
 						// });

 						// event.preventDefault();
 					}
 				};

 				// https://docs.angularjs.org/api/ng/function/angular.element
 				// http://api.jquery.com/bind/
 				angular.element("body").bind("keydown keypress", keyboardProcessing);
 				// http://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs
 				$element.bind("keydown keypress", keyboardProcessing);
 			}
 		};
 	}]);


   }()); // end of 'use strict';
