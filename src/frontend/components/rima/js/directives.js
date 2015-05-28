(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var triggerPopup = function($timeout, $element, selector, event){
	// $element.find("#testing_input").trigger('openTrigger');
	// $element.find("#testing_input").triggerHandler('openTrigger');
	// $element.find("#testing_input").popover('show');

	// angular.element("#testing_input").trigger('openTrigger');
	// angular.element("#testing_input").triggerHandler('openTrigger');

	// $element.find("#testing_input").trigger('show');
	// $element.find("#testing_input").triggerHandler('show');
	// $element.find("#testing_input").popover('show');

	// $("#RegisterHelp").trigger('show');
	// $("#RegisterHelp").triggerHandler('show');
	// $element.triggerHandler( 'openTrigger' );

	// $element.find(selector).popover( event );
	// $element.find(selector).trigger( event );

	// http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
	// http://stackoverflow.com/questions/22447374/how-to-trigger-ng-click-angularjs-programmatically
	// https://docs.angularjs.org/api/ng/function/angular.element
	$timeout(function () {
		$element.find(selector).triggerHandler( event );
	}, 1000);
};

angular.module('rimaDirectives', ['Config'])
	.directive('rimaRelevantList', ['$rootScope', 'WhatAmIService',
		function($rootScope, WhatAmIService){
		console.log("[rimaRelevantList] loading directive");
		return {
			restrict: 'AE',
			scope: {
				'readonly': '=',
				'node': "="
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/rima/partials/rima_relevant_list.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};
			}
		};
	}])

	.directive('rimaUsersList', ["$rootScope", "$timeout", "$location", "RimaService",
		function($rootScope, $timeout, $location, RimaService){
		console.log("[rimaUsersList] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/rima/partials/rimaUsers-list.tpl.html',
			controller: function ( $scope, $element) {
				var init = function(){
					$scope.items = RimaService.getUsers();
			    	$scope.selectedItem = RimaService.getActiveUser();
				};
				$scope.config = RimaService.config;
				$scope.configChanged = function(){
					var mapStylingChangedEventName = "mapStylingChangedEvent";
					$rootScope.$broadcast(mapStylingChangedEventName);
				};
				$scope.items = null;
				$scope.selectedItem = null;
				 //TODO: select from map.dataContent.mcm.authors list
				RimaService.loadUsersFromList().$promise.then(init); //TODO: change to load from MAP
				
				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + $scope.selectedItem.displayName + ": " + $scope.selectedItem._id);
				    RimaService.selectActiveUser(item);
				};
    		}
    	};
	}])

	.directive('rimaRelevantWhatsList', ['$rootScope', 'KnalledgeMapVOsService', 'WhatAmIService', 'RimaService',
		function($rootScope, KnalledgeMapVOsService, WhatAmIService, RimaService){
		console.log("[rimaRelevantWhatsList] loading directive");
		return {
			restrict: 'AE',
			scope: {
				'readonly': '=',
				'node': "="
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/rima/partials/rima-relevant_whats_list.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};

				$scope.items = [];

				var updateList = function(){
					$scope.items.length = 0;

					var userHows = RimaService.howAmIs;
					for (var i in KnalledgeMapVOsService.mapStructure.nodesById){
						var vkNode = KnalledgeMapVOsService.mapStructure.nodesById[i];
						var nodeWhats = (vkNode && vkNode.kNode.dataContent && vkNode.kNode.dataContent.rima && vkNode.kNode.dataContent.rima.whats) ?
							vkNode.kNode.dataContent.rima.whats : [];

						var relevant = false;
						// TODO: can be optimized by hash of userHows
						for(var i=0;i<nodeWhats.length;i++){
							var nodeWhat = nodeWhats[i];
							for(var j in userHows){
								var userHow = userHows[j];
								if (userHow && userHow.whatAmI && (userHow.whatAmI.name == nodeWhat.name))
								{
									relevant = true;
								}
							}
						}
						if(relevant){
							var whats = [
								{
									name: "knalledge",
									relevant: true
								},
								{
									name: "science",
									relevant: false
								}
							]
							$scope.items.push(
								{
									_id: vkNode.kNode._id,
									name: vkNode.kNode.name,
									vkNode: vkNode,
									whats: whats
								}
							);
						}
					}
				};

				$scope.$watch(function () {
					return RimaService.howAmIs;
				},
				function(newValue){
					//alert("RimaService.howAmIs changed: " + JSON.stringify(newValue));
					updateList();
				}, true);

				$scope.$watch(function () {
					// return KnalledgeMapVOsService.mapStructure.nodesById;
					return KnalledgeMapVOsService.nodesById;
				},
				function(newValue){
					//alert("RimaService.howAmIs changed: " + JSON.stringify(newValue));
					console.log("[KnalledgeMapVOsService.mapStructure.nodesById watch]: elements no: %d", Object.keys(newValue).length);
					updateList();
				}, true);

				// $scope.$watch(function () {
				// 	return KnalledgeMapVOsService.mapStructure.selectedNode;
				// },
				// function(newValue){
				// 	//alert("RimaService.howAmIs changed: " + JSON.stringify(newValue));
				// 	updateList();
				// }, true);

				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = %s", $scope.selectedItem.name);
					var changeSelectedNodeEventName = "changeSelectedNodeEvent";
					$rootScope.$broadcast(changeSelectedNodeEventName, item.vkNode);
				};

				updateList();
			}
    	};
	}])
	.directive('rimaWhats', ['$rootScope', 'RimaService',
		function($rootScope, RimaService){
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

				 $(this).addClass('hidden');

				$scope.items = ($scope.node && $scope.node.kNode.dataContent && $scope.node.kNode.dataContent.rima
					&& $scope.node.kNode.dataContent.rima.whats) ? $scope.node.kNode.dataContent.rima.whats : [];

				$scope.$watch("node", function(newVal, oldVal){
				    console.log('node changed');
					$scope.items = ($scope.node && $scope.node.kNode.dataContent && $scope.node.kNode.dataContent.rima
						&& $scope.node.kNode.dataContent.rima.whats) ? $scope.node.kNode.dataContent.rima.whats : [];
				}, false);


				$scope.getItems = function(value){
					var items = RimaService.getByNameContains(value);
					// return items;
					return items.$promise;
					// return items.$promise.then(function(items_server){
					// 	console.log("getItems: ", JSON.stringify(items_server));
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

				$scope.addNewWhat = function(what){
					
					//RimaService.getWhatsById(['554c14a6d25c460d4f225ee7','554d3d40b77c84c474e0140c']);

					// not clicked on any item, but just type a string
					if(!$scope.node){
						console.log("Node is not selected");
						return;
					}
					$scope.asyncSelected = "";
					var kNode = $scope.node.kNode;
					console.log("Adding new what to the node: %s", kNode._id);
					if(!kNode.dataContent) kNode.dataContent = {};
					if(!kNode.dataContent.rima) kNode.dataContent.rima = {};
					if(!kNode.dataContent.rima.whats){
						kNode.dataContent.rima.whats = [];
						// create binding in the case of creating a new list
						$scope.items = kNode.dataContent.rima.whats;
					}

					var newWhat = null;
					if(typeof what === 'string'){
						newWhat = new knalledge.WhatAmI();
						newWhat.name = what;
					}else{
						newWhat = what;
					}

					for(var i=0;i<kNode.dataContent.rima.whats.length;i++){
						if(kNode.dataContent.rima.whats[i].name == newWhat.name){
							window.alert("The node is already described by '"+newWhat.name+"'");
							return;
						}
					}

					// TODO: it should be just _id;
					kNode.dataContent.rima.whats.push(newWhat);
					$scope.asyncSelected = "";
					var changeKnalledgeRimaEventName = "changeKnalledgeRimaEvent";
					$rootScope.$broadcast(changeKnalledgeRimaEventName, $scope.node);

					/* NEW -- TO BE ADDED - saving in nodes just WhatAmI._id, and saving whole whatAmI in its collection:
					var whatCreated = function(whatFromServer){
						console.log("whatCreated", whatFromServer);
						saveNodeWIthNewWhat(whatFromServer._id);
					}

					var saveNodeWIthNewWhat = function(whatId){
						kNode.dataContent.rima.whats.push(whatId);
						var changeKnalledgeRimaEventName = "changeKnalledgeRimaEvent";
						$rootScope.$broadcast(changeKnalledgeRimaEventName, $scope.node);
					}
					
					if(typeof what === 'string'){ //new what
						var newWhat = new knalledge.WhatAmI();
						newWhat.name = what;
						RimaService.createWhatAmI(newWhat).$promise.then(whatCreated);
					}else{ //already existing what (found through typeahead)
						console.log("already existing what '%s' (found through typeahead)", what);
						saveNodeWIthNewWhat(what._id);
					}
					*/
				};

				$scope.newItemSelected = function($item, $model, $label){
					console.log("newItemSelected: $item: %s, $model: %s, $label: %s", JSON.stringify($item), JSON.stringify($model), JSON.stringify($label));
				};

				$scope.itemSelect = function(item){
					console.log("itemSelect: %s", item.name);
				};

				$scope.itemRemove = function(item){
					console.log("itemRemove: %s", item.name);
					for(var i=0; i<$scope.items.length; i++){
						if($scope.items[i]._id == item._id){
							$scope.items.splice(i, 1);
							var changeKnalledgeRimaEventName = "changeKnalledgeRimaEvent";
							$rootScope.$broadcast(changeKnalledgeRimaEventName, $scope.node);
						}
					}
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
			link: function ( $scope, $element) {
				// triggerPopup($timeout, $element, "#testing_input");
				triggerPopup($timeout, $element, "#testing_tooltip_what", "openTrigger");
			},
			controller: function ( $scope, $element) {
				// triggerPopup($timeout, $element, "#testing_input");

				var whatsLimit = 70;
				var init = function(){
					$scope.items = RimaService.getUsersHows(RimaService.getActiveUserId());
					//$scope.modal.formData.contentTypeId= option.contentTypes[0].id;
					$scope.selectedHowOption = $scope.hows[0].id;
			    	//$scope.selectedItem = RimaService.getActiveUser();
			    	$scope.whats = RimaService.getAllWhats(whatsLimit);
				}
				$scope.items = null;
				$scope.whats = null;
				$scope.selectedItem = null;
				$scope.selectedWhat = null;

				$scope.displayName = RimaService.loggedInWhoAmI.displayName;

				//html-select:
				$scope.hows = RimaService.getHowVerbs();

				$scope.howById = function(id){
					// if(id !== 'undefined'){
					return RimaService.getHowForId(id).title;
					// }
					// else{
					// 	return new knalledge.HowAmI();
					// }
				};

				$scope.haveHows = function(){
					return $scope.items.length != 0;
				};
				$scope.createHow = function(){
					var createdHow = function(howFromServer){
						//done already in service: ahowFromServer.whatAmI = RimaService.getWhatById(howFromServer.whatAmI);
						//already bound to the howAmIs array in the RIMA service, so this would cause duplicates: $scope.items.push(howFromServer);
					}

					var selectedHow = RimaService.getHowForId($scope.selectedHowOption);

					for(var i=0;i<$scope.items.length;i++){
						var item = $scope.items[i];
						var whatName = (typeof $scope.whatInput === 'string') ? $scope.whatInput : $scope.whatInput.name;
						if(selectedHow.id == item.how && whatName.toLowerCase() == item.whatAmI.name.toLowerCase()){
							window.alert("You have already described yourself through this");
							return;
						}
					}

					var how = new knalledge.HowAmI();
					how.whoAmI = RimaService.getActiveUserId();
					how.how = selectedHow.id;
					
					//how.whatAmI = $scope.whatInput; //TODO:

					var whatCreated = function(whatFromServer){
						console.log("whatCreated", whatFromServer);
						saveHowWIthNewWhat(whatFromServer._id);
					}

					var saveHowWIthNewWhat = function(whatId){
						how.whatAmI = whatId;
						RimaService.createHowAmI(how, createdHow);
					}
					
					if(typeof $scope.whatInput === 'string'){ //new what
						var newWhat = new knalledge.WhatAmI();
						newWhat.name = $scope.whatInput.toLowerCase();
						RimaService.createWhatAmI(newWhat).$promise.then(whatCreated);
					}else{ //already existing what (found through typeahead)
						console.log("already existing what '%s' (found through typeahead)", $scope.whatInput);
						RimaService.addToLocalWhats($scope.whatInput);//TODO: here we are adding it to 'whatAmI' local cache:
						saveHowWIthNewWhat($scope.whatInput._id);
					}

					$scope.whatInput = null;

				};

				$scope.getItems = function(value){
					var items = RimaService.getByNameContains(value);
					// return items;
					return items.$promise;
					// return items.$promise.then(function(items_server){
					// 	console.log("getItems: ", JSON.stringify(items_server));
					// 	return items_server;
					// });
				};

				 //TODO: select from map.dataContent.mcm.authors list
				//RimaService.loadUsersFromList().$promise.then(init); //TODO: change to load from MAP
				init();
				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + $scope.selectedItem.displayName + ": " + $scope.selectedItem._id);
				};
				$scope.selectWhat = function(item) {
				    $scope.selectedWhat = item;
				    console.log("$scope.selectWhat = " + $scope.selectWhat.name + ": " + $scope.selectWhat._id);
				};
				$scope.chooseWhat = function(what) {
					console.log("$scope.chooseWhat = " + what.name + ": " + what._id);
					$scope.whatInput = what;
				};

				$scope.delete = function(how) {
					if(confirm("Are you sure you want to delete you relation to '"+ how.whatAmI.name +"'?")){
						RimaService.deleteHow(how._id, function(){
							var index = -1;
							for(var i=0;i<$scope.items.length;i++){
								if($scope.items[i]._id == how._id){
									index = i;
									break;
								}
							}
							if(index != -1){delete $scope.items[index];}
						});
					}
				};

				$scope.finished = function(){
					var finishIt = function(){
						//TODO: should be this, but for simplicity of TNC online event we directed to its map: $location.path("/maps");
						var mapID = "5566f25867a6d01e65beddde"; 'TNC-Online';// old for RTS: 5552c2c87ffdccd74096d0ca
						$location.path("/map/id/" + mapID);
						
					};

					if($scope.items.length == 0){
						if(confirm("You have not added any of descriptions! Are you sure that we should continue?")){
							finishIt();
						}
					}
					else{
						if(confirm("Are you satisfied with your description, so that we can continue?")){
							finishIt();
						}
					}
				};
    		}
    	};
	}])

	.directive('rimaTopics', ["$rootScope", "$timeout", "$location", "RimaService",
		function($rootScope, $timeout, $location, RimaService){
		console.log("[rimaTopics] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/rima/partials/rima-topics.tpl.html',
			controller: function ( $scope, $element) {
				var HOW_VERB_FOR_TOPICS =4;
				var TOPICS_MAX = 2;
				var init = function(){
					$scope.items = RimaService.getUsersHows(RimaService.getActiveUserId());
					//$scope.modal.formData.contentTypeId= option.contentTypes[0].id;
					$scope.selectedHowOption = $scope.hows[0].id;
			    	//$scope.selectedItem = RimaService.getActiveUser();
			    	$scope.whats = RimaService.getAllWhats();
				}
				$scope.items = null;
				$scope.whats = null;
				$scope.selectedItem = null;
				$scope.selectedWhat = null;

				$scope.displayName = RimaService.loggedInWhoAmI.displayName;

				//html-select:
				$scope.hows = RimaService.getHowVerbs();

				$scope.howById = function(id){
					// if(id !== 'undefined'){
					return RimaService.getHowForId(id).title;
					// }
					// else{
					// 	return new knalledge.HowAmI();
					// }
				};

				$scope.haveHows = function(){
					return $scope.items.length != 0;
				};

				$scope.createHow = function(){
					if($scope.items.length>=TOPICS_MAX){
						window.alert("You have already selected maximum number of topics.");
						return;
					}
					var createdHow = function(howFromServer){
						//done already in service: ahowFromServer.whatAmI = RimaService.getWhatById(howFromServer.whatAmI);
						//already bound to the howAmIs array in the RIMA service, so this would cause duplicates: $scope.items.push(howFromServer);
					}

					
					var selectedHow = RimaService.getHowForId(HOW_VERB_FOR_TOPICS);


					for(var i=0;i<$scope.items.length;i++){
						var item = $scope.items[i];
						var whatName = (typeof $scope.whatInput === 'string') ? $scope.whatInput : $scope.whatInput.name;
						if(selectedHow.id == item.how && whatName.toLowerCase() == item.whatAmI.name.toLowerCase()){
							window.alert("You have already described yourself through this");
							return;
						}
					}

					var how = new knalledge.HowAmI();
					how.whoAmI = RimaService.getActiveUserId();
					how.how = selectedHow.id;
					
					//how.whatAmI = $scope.whatInput; //TODO:

					var whatCreated = function(whatFromServer){
						console.log("whatCreated", whatFromServer);
						saveHowWIthNewWhat(whatFromServer._id);
					}

					var saveHowWIthNewWhat = function(whatId){
						how.whatAmI = whatId;
						RimaService.createHowAmI(how, createdHow);
					}
					
					if(typeof $scope.whatInput === 'string'){ //new what
						var newWhat = new knalledge.WhatAmI();
						newWhat.name = $scope.whatInput.toLowerCase();
						RimaService.createWhatAmI(newWhat).$promise.then(whatCreated);
					}else{ //already existing what (found through typeahead)
						console.log("already existing what '%s' (found through typeahead)", $scope.whatInput);
						RimaService.addToLocalWhats($scope.whatInput);//TODO: here we are adding it to 'whatAmI' local cache:
						saveHowWIthNewWhat($scope.whatInput._id);
					}

					$scope.whatInput = null;

				};


				init();
				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + $scope.selectedItem.displayName + ": " + $scope.selectedItem._id);
				};
				$scope.selectWhat = function(item) {
				    $scope.selectedWhat = item;
				    console.log("$scope.selectWhat = " + $scope.selectWhat.name + ": " + $scope.selectWhat._id);
				};
				$scope.chooseWhat = function(what) {
					console.log("$scope.chooseWhat = " + what.name + ": " + what._id);
					$scope.whatInput = what;
					$scope.createHow();
				};

				$scope.delete = function(how) {
					if(confirm("Are you sure you want to delete you relation to '"+ how.whatAmI.name +"'?")){
						RimaService.deleteHow(how._id, function(){
							var index = -1;
							for(var i=0;i<$scope.items.length;i++){
								if($scope.items[i]._id == how._id){
									index = i;
									break;
								}
							}
							if(index != -1){delete $scope.items[index];}
						});
					}
				};
    		}
    	};
	}])

	.directive('rimaWhat', ['$rootScope', 'RimaService',
		function($rootScope, RimaService){
		console.log("[rimaWhat] loading directive");
		return {
			restrict: 'AE',
			scope: {
				'readonly': '=',
				'item': '=',
				'isLast': '=',
				'itemSelect': '&',
				'itemRemove': '&'
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/rima/partials/rima-what.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};

				$scope.select = function(){
					$scope.itemSelect();
				};

				$scope.remove = function(){
					$scope.itemRemove();
				};
			}
    	};
	}])

	/*
	https://angular-ui.github.io/bootstrap/
	http://getbootstrap.com/javascript/#tooltips
	http://stackoverflow.com/questions/23073156/how-to-open-and-close-angular-ui-popovers-programmatically
	http://stackoverflow.com/questions/19730461/hide-angular-ui-tooltip-on-custom-event
	http://stackoverflow.com/questions/13015432/how-to-make-bootstrap-tooltip-to-remain-visible-till-the-link-is-clicked
	http://stackoverflow.com/questions/12411500/show-twitter-bootstrap-tooltip-on-initalize
	https://github.com/angular-ui/bootstrap/issues/618
	http://stackoverflow.com/questions/16651227/enable-angular-ui-tooltip-on-custom-events
	http://plnkr.co/edit/DmNNkYHfofHTX4omt8GC?p=preview
	http://stackoverflow.com/questions/20939754/good-way-to-dynamically-open-close-a-popover-or-tooltip-using-angular-based
	http://plnkr.co/edit/94ZHgQ?p=preview
	*/
	.directive( 'popPopup', function () {
		return {
			restrict: 'EA',
			replace: true,
			scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
			templateUrl: 'template/popover/popover.html'
		};
	})
	  .directive('pop', function pop ($tooltip, $timeout) {
	    var tooltip = $tooltip('pop', 'pop', 'event');
	    var compile = angular.copy(tooltip.compile);
	    tooltip.compile = function (element, attrs) {      
	      var first = true;
	      attrs.$observe('popShow', function (val) {
	        if (JSON.parse(!first || val || false)) {
	          $timeout(function () {
	            element.triggerHandler('event');
	          });
	        }
	        first = false;
	      });
	      return compile(element, attrs);
	    };
	    return tooltip;
	  })
	  .directive('myTooltip', ['$timeout', '$tooltip', function ( $timeout, $tooltip ) {
		var tooltip = $tooltip( 'myTooltip', 'myTooltip', 'openTrigger' );
		var compile = angular.copy(tooltip.compile);
		tooltip.compile = function (element, attrs) {
			var first = true;
			attrs.$observe('myTooltipShow', function (val) {
				if (JSON.parse(!first || val || false)) {
					$timeout(function () {
						element.triggerHandler('openTrigger');
					});
				}
				first = false;
			});
			return compile(element, attrs);
		};
		return tooltip;
	}])

	.directive('rimaWizard', ['$rootScope', '$timeout', 'RimaService',
		function($rootScope, $timeout, RimaService){
		console.log("[rimaWizard] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			templateUrl: '../components/rima/partials/rima-wizard.tpl.html',
			link: function ( $scope, $element) {
				$scope.currentStepNumber = 2;
				// triggerPopup($timeout, $element, "#testing_tooltip_what", "openTrigger");
			},
			controller: function ( $scope, $element) {

				$scope.whoAmI = RimaService.loggedInWhoAmI;
				$scope.submitted = false;
				$scope.bindings = {
					noSkype: false
				};

				$scope.showPopup = function(){
					triggerPopup($timeout, $element, "#testing_tooltip_what", "openTrigger");
					// triggerPopup($timeout, $element, "#testing_input", "openTrigger");
				}
				$scope.closePopup = function(){
					triggerPopup($timeout, $element, "#testing_tooltip_what", "closeTrigger");
					// triggerPopup($timeout, $element, "#testing_input", "openTrigger");
				}

				$scope.stepEntered = function(){
					console.log('stepEntered (); $scope.currentStepNumber: %d',$scope.currentStepNumber);
					RimaService.updateWhoAmI(function(){
						console.log('after:' + RimaService.loggedInWhoAmI);
						//$scope.submitted = true;
					});
				};

				$scope.noSkypeChange = function(){
					//console.log('noSkypeChange ()');
					if($scope.bindings.noSkype){
						$scope.whoAmI.extensions.contacts.skype = '<skype not provided>';
					}
					else{
						$scope.whoAmI.extensions.contacts.skype = '';	
					}
				};

				$scope.submit = function(){//not used in our case, because we save it upon each step
					console.log('pre:'+RimaService.loggedInWhoAmI);
					//$scope.submitted = true;
				};
			}
			
    	};
	}]);

}()); // end of 'use strict';
