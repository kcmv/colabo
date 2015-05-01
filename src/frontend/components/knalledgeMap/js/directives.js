(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('knalledgeMapDirectives', ['Config'])
	.directive('knalledgeMap', ['KnalledgeNodeService', 'KnalledgeEdgeService', 'KnalledgeMapVOsService', 'KnalledgeMapService', '$compile', '$routeParams', /*'$rootScope', '$qΩ, '$timeout', ConfigMap',*/ 
		function(KnalledgeNodeService, KnalledgeEdgeService, KnalledgeMapVOsService, KnalledgeMapService, $compile, $routeParams /*, $rootScope, $q, $timeout, ConfigMap*/){

		// http://docs.angularjs.org/guide/directive
		console.log("[knalledgeMap] loading directive");
		return {
			restrict: 'EA',
			scope: {
				mapData: "=",
				mapConfig: "=",
				nodeSelected: "&"
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/knalledgeMap/partials/knalledgeMap.tpl.html',
			controller: function ( $scope, $element) {

				var model = null;
				// var knalledgeMap = new mcm.Map(ConfigMap, knalledgeMapClientInterface, entityStyles);
				// knalledgeMap.init();

				var knalledgeMap = null;
				var config = null;
				var init = function(model){
					config = {
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
										width: 200,
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
							viewspec: "viewspec_tree", // "viewspec_tree" // "viewspec_manual",
							selectableEnabled: true,
							fixedDepth: {
								enabled: false,
								levelDepth: 300
							},
							sizing: {
								setNodeSize: true,
								nodeSize: [400, 200]
							},
							margin: {
								top: 10,
								left: 20,
								right: 100,
								bottom: 10
							},
							scaling: {
								x: 0.5,
								y: 0.5
							},
							mapService: {
								enabled: true
							}
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
						},
						keyboardInteraction: {
							enabled: true
						},
						draggingConfig: {
							enabled: true,
							draggTargetElement: true,
							target: {
								refCategory: '.draggable',
								opacity:  0.5,
								zIndex: 10,
								cloningContainer: null, // getting native dom element from D3 selector (set in code)
								leaveAtDraggedPosition: false,
								callbacks: {
									onend: null // (set in code)
								}
							},
							debug: {
								origVsClone: false
							}
						}
					};

					function overwriteConfig(sourceObj, destinationObj){
						for(var i in destinationObj){
							if(i in sourceObj){
								if(typeof destinationObj[i] === 'object'){
									overwriteConfig(sourceObj[i], destinationObj[i]);
								}else{
									destinationObj[i] = sourceObj[i];
								}
							}
						}
					}

					if($scope.mapConfig) overwriteConfig($scope.mapConfig, config);

					var kMapClientInterface = {
						nodeClicked: function(vkNode, dom){
							$scope.$apply(function () {
								// Referencing DOM nodes in Angular expressions is disallowed!
								dom = null;
								$scope.nodeSelected({"vkNode": vkNode, "dom": dom});
							});
						},
						mapEntityClicked: function(mapEntity /*, mapEntityDom*/){
							$scope.$apply(function () {
								mapEntityClicked = mapEntity;
								var eventName = "mapEntitySelectedEvent";
								$rootScope.$broadcast(eventName, mapEntity);
							});
						},
						addImage: function(vkNode, callback){
							$scope.$apply(function () {
								if(vkNode){
									console.log("Adding image");
									var directiveScope = $scope.$new(); // $new is not super necessary
									// create popup directive
									var directiveLink = $compile("<div knalledge-map-image-editing class='knalledge-map-image-editing'></div>");
									// link HTML containing the directive
									var directiveElement = directiveLink(directiveScope);

									$element.append(directiveElement);
									directiveScope.image = 
										(('dataContent' in vkNode.kNode) && ('image' in vkNode.kNode.dataContent)) ?
											vkNode.kNode.dataContent.image : null;

									directiveScope.addedImage = function(image){
										console.log("Adding image");
										if(!vkNode.kNode.dataContent){
											vkNode.kNode.dataContent = {};
										}
										// http://localhost:8888/knodes/one/5526855ac4f4db29446bd183.json
										vkNode.kNode.dataContent.image = {
											url: image.url,
											width: image.width,
											height: image.height
										};
										var updated = function(kNodeFromServer){
											console.log("[knalledgeMap::kMapClientInterface::addImage::addedImage::updated'] updateKNode: " + kNodeFromServer);
											if(callback){callback(vkNode);}
											knalledgeMap.update(vkNode);
										};
										KnalledgeNodeService.update(vkNode.kNode).$promise
											.then(updated);
									}.bind(this);

								}
							});
						}
					};

					knalledgeMap = new knalledge.Map(
						d3.select($element.find(".knalledge_map_container").get(0)),
						config, kMapClientInterface, null, 
							config.tree.mapService.enabled ? KnalledgeMapVOsService : null);
					knalledgeMap.init();
					//knalledgeMap.load("treeData.json");
					knalledgeMap.processData(model, function(){
						// we call the second time since at the moment dimensions of nodes (images, ...) are not known at the first update
						knalledgeMap.update();
						if($scope.mapData && $scope.mapData.selectedNode){
							var vkNode = knalledgeMap.mapStructure.getVKNodeByKId($scope.mapData.selectedNode._id);
							knalledgeMap.mapLayout.clickNode(vkNode);
						}
					});
				};

				if($scope.mapData){
					console.warn('have $scope.mapData:' + JSON.stringify($scope.mapData));
					init($scope.mapData);
				}else{
					var gotMap = function(map){		
						console.log('gotMap:'+JSON.stringify(map));
						KnalledgeMapVOsService.loadData(map); //broadcasts 'modelLoadedEvent'
					};
					var mapId = $routeParams.id;
					console.warn("loading map by mcmMapDirectives::mapId: " + mapId);

					KnalledgeMapService.getById(mapId).$promise.then(gotMap);
				}

				var eventName = "modelLoadedEvent";
				$scope.$on(eventName, function(e, eventModel) {
					console.log("[knalledgeMap.controller::$on] ModelMap  nodes(len: %d): %s",
						eventModel.map.nodes, JSON.stringify(eventModel.map.nodes));
					console.log("[knalledgeMap.controller::$on] ModelMap  edges(len: %d): %s",
						eventModel.map.edges.length, JSON.stringify(eventModel.map.edges));

					// knalledgeMap.placeModels(eventModel);
					model = eventModel;

					init(model);
				});

				var viewspecChangedEventName = "viewspecChangedEvent";
				$scope.$on(viewspecChangedEventName, function(e, newViewspec) {
					console.log("[knalledgeMap.controller::$on] event: %s", viewspecChangedEventName);
					console.log("[knalledgeMap.controller::$on] newViewspec: %s", newViewspec);
					config.tree.viewspec = newViewspec;
					knalledgeMap.update();
				});
			}
    	};
	}])
	.directive('knalledgeMapTools', ["$timeout", '$rootScope', 'ConfigMapToolset', function($timeout, $rootScope, ConfigMapToolset){
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
				$scope.bindings = {
					viewspec: 'viewspec_manual'
				};

				$scope.viewspecChanged = function(){
					console.log("[knalledgeMapTools] viewspec: %s", $scope.bindings.viewspec);
					var viewspecChangedEventName = "viewspecChangedEvent";
					//console.log("result:" + JSON.stringify(result));
					$rootScope.$broadcast(viewspecChangedEventName, $scope.bindings.viewspec);
				}
			}
    	};
	}])
	.directive('knalledgeMapList', [/*'$rootScope', '$window', 'KnalledgeNodeService', 'KnalledgeEdgeService', '$q', */ function(/*$rootScope, $window, KnalledgeNodeService, KnalledgeEdgeService, $q*/){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/knalledgeMap/partials/knalledgeMap-list.tpl.html',
			controller: function (/* $scope */) {
    		}
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
	.directive('knalledgeMapImageEditing', [function(){
		return {
			restrict: 'AE',
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/knalledgeMap/partials/knalledgeMap-imageEditing.tpl.html',
			controller: function ( $scope, $element) {
				$scope.title = "Create Image for node";
				if(!('image' in $scope)){
					$scope.image = {
						url: "http://upload.wikimedia.org/wikipedia/commons/e/e9/Meister_von_Mileseva_001.jpg",
						width: 200,
						height: 262
					};
					$scope.image = {
						url: "http://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg",
						width: 200,
						height: 268
					};
				};

				$scope.cancelled = function(){
					//console.log("Canceled");
					$element.remove();
				};

				$scope.submitted = function(){
					console.log("Submitted: %s", JSON.stringify($scope.image));
					$scope.addedImage($scope.image);
					$element.remove();
				};

				var placeEntities = function(/*entities, direction*/){

				};

				placeEntities($element);
				$scope.entityClicked = function(entity, event, childScope){
					console.log("[mcmMapSelectSubEntity] entityClicked: %s, %s, %s", JSON.stringify(entity), event, childScope);
				};
    		}
    	};
	}])
	.directive('knalledgeMapsList', ["$rootScope", "$timeout", "$location", 'KnalledgeMapService', 'KnalledgeMapVOsService',
		function($rootScope, $timeout, $location, KnalledgeMapService, KnalledgeMapVOsService){
		console.log("[mcmMapsList] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/knalledgeMap/partials/knalledgeMaps-list.tpl.html',
			controller: function ( $scope, $element) {
				$scope.mapToCreate = null;
				$scope.modeCreating = false;
				$scope.items = null;
				$scope.selectedItem = null;

				KnalledgeMapService.query().$promise.then(function(maps){
					$scope.items = maps;
					console.log('maps:'+JSON.stringify($scope.maps));
				});

				$scope.showCreateNewMap = function(){
					console.log("showCreateNewMap");
					$scope.mapToCreate = new knalledge.KMap();
					$scope.modeCreating = true;
				};

				$scope.cancelled = function(){
					console.log("Canceled");
					$scope.modeCreating = false;
				};

				$scope.createNew = function(){
					var mapCreated = function(mapFromServer) {
						console.log("mapCreated:");//+ JSON.stringify(mapFromServer));
						$scope.items.push(mapFromServer);
						$scope.selectedItem = mapFromServer;
						rootNode.mapId = mapFromServer._id;
						KnalledgeMapVOsService.updateNode(rootNode)
					}

					var rootNodeCreated = function(rootNode){
						$scope.mapToCreate.rootNodeId = rootNode._id;
						var map = KnalledgeMapService.create($scope.mapToCreate);
						map.$promise.then(mapCreated);
					}

					console.log("createNew");
					$scope.modeCreating = false;

					var rootNode = new knalledge.KNode();
					rootNode.name = $scope.mapToCreate.name;
					rootNode.type = $scope.mapToCreate.rootNodeType ? 
						$scope.mapToCreate.rootNodeType : "model_component";
					rootNode.visual = {
					    isOpen: true,
					    xM: 0,
					    yM: 0
					};

					rootNode = KnalledgeMapVOsService.createNode(rootNode);
					rootNode.$promise.then(rootNodeCreated);					
				};

				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + $scope.selectedItem.name + ": " + $scope.selectedItem._id);
				};

				$scope.openMap = function() {
				    console.log("openMap");
					if($scope.selectedItem !== null && $scope.selectedItem !== undefined){
						console.log("openning Model:" + $scope.selectedItem.name + ": " + $scope.selectedItem._id);
						console.log("/map/id/" + $scope.selectedItem._id);
						$location.path("/map/id/" + $scope.selectedItem._id);
						//openMap($scope.selectedItem);
						// $element.remove();
					}
					else{
						window.alert('Please, select a Model');
					}
				};
    		}
    	};
	}])
;

;

}()); // end of 'use strict';
