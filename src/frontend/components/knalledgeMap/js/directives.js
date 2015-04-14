(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('knalledgeMapDirectives', ['Config'])
	.directive('knalledgeMap', ['KnalledgeNodeService', 'KnalledgeEdgeService', '$q', /*'$timeout', '$rootScope', 'ConfigMap',*/ function(KnalledgeNodeService, KnalledgeEdgeService, $q /*$timeout, $rootScope, ConfigMap*/){

		// http://docs.angularjs.org/guide/directive
		console.log("[knalledgeMap] loading directive");
		return {
			restrict: 'EA',
			scope: {
				'readonly': '='
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/knalledgeMap/partials/knalledgeMap.tpl.html',
			controller: function ( $scope, $element) {
				// var knalledgeMapClientInterface = {
				// 	getContainer: function(){
				// 		return $element.find('.map-container');
				// 	},
				// 	mapEntityClicked: function(mapEntity /*, mapEntityDom*/){
				// 		$scope.$apply(function () {
				// 			var eventName = "mapEntitySelectedEvent";
				// 			$rootScope.$broadcast(eventName, mapEntity);
				// 		});
				// 	},
				// 	timeout: $timeout
				// };

				// var entityStyles = {
				// 	"object": {
				// 		typeClass: "map_entity_object",
				// 		icon: "O"
				// 	},
				// 	"process": {
				// 		typeClass: "map_entity_process",
				// 		icon: "P"
				// 	}
				// };

				var model = null;
				// var knalledgeMap = new mcm.Map(ConfigMap, knalledgeMapClientInterface, entityStyles);
				// knalledgeMap.init();

				var init = function(model){
					var dimensions = {
						node: {
							width: 150
						}
					};

					var config = {
						nodes: {
							punctual: false,
							svg: {
								show: false
							},
							html: {
								show: true,
								dimensions: {
									sizes: {
										y: 10,
										x: 50,
										width: 150,
										height: 50
									}
								}
							}
						},
						edges: {
							show: true,
							labels: {
								show: true
							}
						},
						tree: {
							viewspec: "viewspec_manual" // "viewspec_tree" // "viewspec_manual"
						},
						transitions: {
							enter: {
								duration: 1000,
								// if set to true, entering elements will enter from the node that is expanding
								// (no matter if it is parent or grandparent, ...)
								// otherwise it elements will enter from the parent node
								referToToggling: true,
								animate: {
									position: true,
									opacity: true
								}
							},
							update: {
								duration: 500,
								referToToggling: true,
								animate: {
									position: true,
									opacity: true
								}
							},
							exit: {
								duration: 750,
								// if set to true, exiting elements will exit to the node that is collapsing
								// (no matter if it is parent or grandparent, ...)
								// otherwise it elements will exit to the parent node
								referToToggling: true,
								animate: {
									position: true,
									opacity: true
								}
							}
						}
					};
					
					var kMapClientInterface = {
						createNode: function(node, callback){
							function created(nodeFromServer){
								console.log("[knalledgeMap.controller'] createNode: " + nodeFromServer);
								if(callback){callback(nodeFromServer);}
							}
							KnalledgeNodeService.create(node).$promise
							.then(created);
						},
						updateNode: function(node, callback){
							function updated(nodeFromServer){
								console.log("[knalledgeMap.controller'] node updated: " + JSON.stringify(nodeFromServer));
								if(callback){callback(nodeFromServer);}
							}
							KnalledgeNodeService.update(node).$promise
							.then(updated);
						},
						createEdge: function(edge, callback){ //TODO: should we return promise?
							function created(edgeFromServer){
								console.log("[knalledgeMap.controller'] edge created: " + edgeFromServer);
								if(callback){callback(edgeFromServer);}
							}
							KnalledgeEdgeService.create(edge).$promise
							.then(created);
						}
						/*,
						mapEntityClicked: function(mapEntity ){
							$scope.$apply(function () {
								var eventName = "mapEntitySelectedEvent";
								$rootScope.$broadcast(eventName, mapEntity);
							});
						},
						mapEntityDraggedIn: function(mapEntity, decoratingEntity){
							$scope.$apply(function () {
								mapEntity.draggedInNo++;
								if(decoratingEntity.type == 'variable'){
									var variableEntity = {
										name: "variable",
										type: "variable"
									};
									var relationship = {
										"name": "",
										"type": mcm.Map.CONTAINS_VARIABLE_OUT
									};
									mcmMap.addChildNode(mapEntity, variableEntity, relationship);
								}
							});
						},
						timeout: $timeout
						*/
					};

					var isNew = true;
					if(isNew){
						var treeHtml = new knalledge.Map(
						d3.select($element.find(".map-container").get(0)),
						config, dimensions, kMapClientInterface, null);
					}else{
						var treeHtml = new TreeHtml(
						d3.select($element.find(".map-container").get(0)),
						config, dimensions, kMapClientInterface);						
					}
					treeHtml.init();
					//treeHtml.load("treeData.json");
					treeHtml.processData(null, model);
				};

				var eventName = "modelLoadedEvent";
				$scope.$on(eventName, function(e, eventModel) {
					console.log("[knalledgeMap.controller::$on] ModelMap  nodes(len: %d): %s",
						eventModel.nodes, JSON.stringify(eventModel.nodes));
					console.log("[knalledgeMap.controller::$on] ModelMap  edges(len: %d): %s",
						eventModel.edges.length, JSON.stringify(eventModel.edges));

					// knalledgeMap.placeModels(eventModel);
					model = eventModel;

					init(model);
				});
			}
    	};
	}])
	.directive('knalledgeMapTools', ["$timeout", 'ConfigMapToolset', function($timeout, ConfigMapToolset){
		console.log("[knalledgeMapTools] loading directive");
		return {
			restrict: 'AE',
			scope: {
				'readonly': '='
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/knalledgeMap/partials/knalledgeMap-tools.tpl.html',
			controller: function ( $scope, $element) {
				var toolsetClientInterface = {
					getContainer: function(){
						return $element.find('ul');
					},
					getData: function(){
						return $scope.tools;
					},
					timeout: $timeout
				};

				var entityListRules = {
					"unselected": [
						{
							id: "assumption",
							name: "assumption",
							type: "assumption",
							icon: "A"
						},
						{
							id: "object",
							name: "object",
							type: "object",
							icon: "O"
						},
						{
							id: "process",
							name: "process",
							type: "process",
							icon: "P"
						},
						{
							id: "grid",
							name: "grid",
							type: "grid",
							icon: "G"
						}
					],
					"object": [
						{
							id: "assumption",
							name: "assumption",
							type: "assumption",
							icon: "A"
						},
						{
							id: "object",
							name: "object",
							type: "object",
							icon: "O"
						},
						{
							id: "process",
							name: "process",
							type: "process",
							icon: "P"
						},
						{
							id: "variable",
							name: "variable",
							type: "variable",
							icon: "V"
						},
						{
							id: "grid",
							name: "grid",
							type: "grid",
							icon: "G"
						}
					],
					"process": [
						{
							id: "assumption",
							name: "assumption",
							type: "assumption",
							icon: "A"
						},
						{
							id: "object",
							name: "object",
							type: "object",
							icon: "O"
						},
						{
							id: "grid",
							name: "grid",
							type: "grid",
							icon: "G"
						}
					]
				};

				$scope.tools = [];
				$scope.tools.length = 0;
				var entities = entityListRules.unselected;
				for(var i in entities){
					$scope.tools.push(entities[i]);
				}

				var toolset = new mcm.EntitiesToolset(ConfigMapToolset, toolsetClientInterface);
				toolset.init();

				var eventName = "mapEntitySelectedEvent";

				$scope.$on(eventName, function(e, mapEntity) {
					console.log("[knalledgeMapTools.controller::$on] ModelMap  mapEntity: %s", JSON.stringify(mapEntity));
					$scope.tools.length = 0;
					var entities = entityListRules[mapEntity ? mapEntity.type : "unselected"];
					for(var i in entities){
						$scope.tools.push(entities[i]);
					}
					toolset.update();
				});
    		}
    	};
	}])
	.directive('knalledgeMapList', ['$rootScope', '$window', 'KnalledgeNodeService', 'KnalledgeEdgeService', '$q', function($rootScope, $window, KnalledgeNodeService, KnalledgeEdgeService, $q){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/knalledgeMap/partials/knalledgeMap-list.tpl.html',
			controller: function ( $scope ) {
				/*
				$scope.knalledgeMapFull = KnalledgeNodeService.query();
				$scope.knalledgeMapFull.$promise.then(function(result){
					console.log("[knalledgeMapList] result.map.(nodes.length = %d, edges.length = %d)", 
						result.map.nodes.length, result.map.edges.length);
					console.log("[knalledgeMapList] $scope.map.knalledgeMap.(nodes.length = %d, edges.length = %d)",
						result.map.nodes.length, result.map.edges.length);
					var eventName = "modelLoadedEvent";
					$rootScope.$broadcast(eventName, $scope.knalledgeMapFull.map);
				}, function(fail){
					$window.alert("Error loading knalledgeMap: %s", fail);
				});
				return;
				*/

				var result = {
					"properties": {
						"name": "TNC (Tesla - The Nature of Creativty) (DR Model)",
						"date": "2015.03.22.",
						"authors": "S. Rudan, D. Karabeg",
						"rootNodeId": 1
					},
					"map": {
						"nodes": new Array(),
						"edges": new Array()
					}
					
				};
				
				function handleReject(){
					$window.alert("Error loading knalledgeMap: %s", fail);
				}
				
				function nodesEdgesReceived(){
					console.log("nodesEdgesReceived");
					for(var i=0; i<nodes.length; i++){
						result.map.nodes.push(nodes[i]);
					}
					for(var i=0; i<edges.length; i++){
						result.map.edges.push(edges[i]);
					}
					
					var eventName = "modelLoadedEvent";
					$scope.knalledgeMapFull = result;
					console.log("$scope.knalledgeMapFull:" + JSON.stringify($scope.knalledgeMapFull));
					$rootScope.$broadcast(eventName, $scope.knalledgeMapFull.map);
				}
				
				var nodes = KnalledgeNodeService.queryInMap('552678e69ad190a642ad461c');
				var edges = KnalledgeEdgeService.queryInMap('552678e69ad190a642ad461c');
				
				$q.all([nodes.$promise, edges.$promise])
				.then(nodesEdgesReceived)
				.catch(handleReject); //TODO: test this. 2nd function fail or like this 'catch' 
				
    		} //controller-function
    	};
	}])
	.directive('knalledgeMapNode', [function(){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'E',
			scope: {
				'sale': '='
				,'isLast': '='
				// default options
				// 	https://github.com/angular/angular.js/issues/3804
				//	http://stackoverflow.com/questions/18784520/angular-directive-with-default-options
				//	https://groups.google.com/forum/#!topic/angular/Wmzp6OU4IRc
				,'readonly': '='
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: 'modules/knalledgeMap/partials/sale-show.tpl.html',
			controller: function ( $scope ) {
				console.log($scope);
    		}
		};
	}])
	.directive('knalledgeMapEdge', [function(){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'E',
			scope: {
				'sale': '='
				,'isLast': '='
				// default options
				// 	https://github.com/angular/angular.js/issues/3804
				//	http://stackoverflow.com/questions/18784520/angular-directive-with-default-options
				//	https://groups.google.com/forum/#!topic/angular/Wmzp6OU4IRc
				,'readonly': '='
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: 'modules/knalledgeMap/partials/sale-show.tpl.html',
			controller: function ( $scope) {
				console.log($scope);
    		}
		};
	}])
;

}()); // end of 'use strict';
