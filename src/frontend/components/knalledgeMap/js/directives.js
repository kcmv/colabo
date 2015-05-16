(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('knalledgeMapDirectives', ['Config'])
	.directive('knalledgeMap', ['$rootScope', 'KnalledgeNodeService', 'KnalledgeEdgeService', 'KnalledgeMapVOsService', 'KnalledgeMapService', 
		'RimaService', 'IbisTypesService', 'NotifyService', 'NotifyNodeService', 'KnalledgeMapViewService', '$compile', '$routeParams', /*'$rootScope', '$qΩ, '$timeout', ConfigMap',*/ 
		function($rootScope, KnalledgeNodeService, KnalledgeEdgeService, KnalledgeMapVOsService, KnalledgeMapService, 
		RimaService, IbisTypesService, NotifyService, NotifyNodeService, KnalledgeMapViewService, $compile, $routeParams /*, $rootScope, $q, $timeout, ConfigMap*/){

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
							viewspec: "viewspec_manual", // "viewspec_tree" // "viewspec_manual",
							selectableEnabled: false,
							fixedDepth: {
								enabled: false,
								levelDepth: 300
							},
							sizing: {
								setNodeSize: true,
								nodeSize: [350, 150]
							},
							margin: {
								top: 35,
								left: 25,
								right: 100,
								bottom: 500
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
						nodeClicked: function(vkNode, dom, commingFromAngular){
							var processNodeClick = function(){
								// Referencing DOM nodes in Angular expressions is disallowed!
								dom = null;
								$scope.nodeSelected({"vkNode": vkNode, "dom": dom});
								var property = "";
								if(vkNode){
									// http://www.historyrundown.com/did-galileo-really-say-and-yet-it-moves/
									if(vkNode.kNode.dataContent) property = vkNode.kNode.dataContent.property;
									console.log("[knalledgeMap::kMapClientInterface::nodeClicked'] vkNode[%s](%s): property: %s", vkNode.id, vkNode.kNode._id, property);
								}else{
									console.log("[knalledgeMap::kMapClientInterface::nodeClicked'] node is not selected. property: %s", property);
								}
								var changeKnalledgePropertyEventName = "changeKnalledgePropertyEvent";

								var nodeContent = {
									node: vkNode,
									property: property
								};
								$rootScope.$broadcast(changeKnalledgePropertyEventName, nodeContent);								
							}

							if(commingFromAngular) processNodeClick();
							else{
								$scope.$apply(processNodeClick);
							}
						},
						mapEntityClicked: function(mapEntity /*, mapEntityDom*/){
							$scope.$apply(function () {
								//var mapEntityClicked = mapEntity;
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

					var mapPlugins = {
						mapVisualizePlugins: {
							'NotifyNodeService': NotifyNodeService
						}
					};

					knalledgeMap = new knalledge.Map(
						d3.select($element.find(".knalledge_map_container").get(0)),
						config, kMapClientInterface, null,
							config.tree.mapService.enabled ? KnalledgeMapVOsService : null, KnalledgeMapVOsService.mapStructure, RimaService, IbisTypesService, NotifyService, mapPlugins, KnalledgeMapViewService);
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
					// console.warn('have $scope.mapData:' + JSON.stringify($scope.mapData));
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
					// there is only one listener so we can stop further propagation of the event
					// e.stopPropagation();
					console.log("[knalledgeMap.controller::$on] ModelMap  nodes(len: %d): %s",
						eventModel.map.nodes, JSON.stringify(eventModel.map.nodes));
					console.log("[knalledgeMap.controller::$on] ModelMap  edges(len: %d): %s",
						eventModel.map.edges.length, JSON.stringify(eventModel.map.edges));

					// knalledgeMap.placeModels(eventModel);
					model = eventModel;

					init(model);
				});

				var knalledgePropertyChangedEventName = "knalledgePropertyChangedEvent";
				$scope.$on(knalledgePropertyChangedEventName, function(e, knalledgePropery) {
					var vkNode = knalledgeMap.mapStructure.getSelectedNode();

					var knalledgeProperyBefore = null;
					if(vkNode){
						console.log("[knalledgeMap.controller::$on:%s] vkNode[%s](%s): (old knalledgePropery: %s), knalledgePropery: %s", knalledgePropertyChangedEventName, vkNode.id, vkNode.kNode._id, 
							(vkNode.kNode.dataContent ? vkNode.kNode.dataContent.property : null),
							knalledgePropery);

						if(!vkNode.kNode.dataContent) vkNode.kNode.dataContent = {};
						if(vkNode.kNode.dataContent.property) knalledgeProperyBefore = vkNode.kNode.dataContent.property;
						//var nowExist = (knalledgePropery !== null) && (knalledgePropery.length > 0);
						//var beforeExisted = (vkNode.kNode.dataContent.property !== null) && (vkNode.kNode.dataContent.property.length > 0);
						if(knalledgeProperyBefore == knalledgePropery) return;
						if(!knalledgeProperyBefore && !knalledgePropery) return;

						vkNode.kNode.dataContent.property = knalledgePropery;
						knalledgeMap.mapStructure.updateNode(vkNode, knalledge.MapStructure.UPDATE_DATA_CONTENT);
					}else{
					console.log("[knalledgeMap.controller::$on:%s] node not selected. knalledgePropery: %s", knalledgePropertyChangedEventName, knalledgePropery);


					}
				});

				var viewspecChangedEventName = "viewspecChangedEvent";
				$scope.$on(viewspecChangedEventName, function(e, newViewspec) {
					console.log("[knalledgeMap.controller::$on] event: %s", viewspecChangedEventName);
					console.log("[knalledgeMap.controller::$on] newViewspec: %s", newViewspec);
					config.tree.viewspec = newViewspec;
					knalledgeMap.update();
				});

				var mapStylingChangedEventName = "mapStylingChangedEvent";
				$scope.$on(mapStylingChangedEventName, function(e) {
					console.log("[knalledgeMap.controller::$on] event: %s", mapStylingChangedEventName);
					knalledgeMap.update();
				});

				var changeKnalledgeRimaEventName = "changeKnalledgeRimaEvent";
				$scope.$on(changeKnalledgeRimaEventName, function(e, vkNode) {
					console.log("[knalledgeMap.controller::$on] event: %s", changeKnalledgeRimaEventName);
					knalledgeMap.mapStructure.updateNode(vkNode, knalledge.MapStructure.UPDATE_DATA_CONTENT);
					knalledgeMap.update();
				});

				var changeSelectedNodeEventName = "changeSelectedNodeEvent";
				$scope.$on(changeSelectedNodeEventName, function(e, vkNode) {
					console.log("[knalledgeMap.controller::$on] event: %s", changeSelectedNodeEventName);
					knalledgeMap.mapManager.getActiveLayout().clickNode(vkNode, undefined, true);
				});

				$scope.$watch(function () {
					return RimaService.howAmIs;
				},
				function(newValue){
					//alert("RimaService.howAmIs changed: " + JSON.stringify(newValue));
					if(knalledgeMap) knalledgeMap.update();
				}, true);

			}
    	};
	}])
	.directive('knalledgeMapTools', ["$timeout", '$rootScope', 'KnalledgeMapViewService', function($timeout, $rootScope, KnalledgeMapViewService){
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

				$scope.config = KnalledgeMapViewService.config;
				$scope.configChanged = function(){
					var mapStylingChangedEventName = "mapStylingChangedEvent";
					$rootScope.$broadcast(mapStylingChangedEventName);
				};

				$scope.viewspecChanged = function(){
					console.log("[knalledgeMapTools] viewspec: %s", $scope.bindings.viewspec);
					var viewspecChangedEventName = "viewspecChangedEvent";
					//console.log("result:" + JSON.stringify(result));
					$rootScope.$broadcast(viewspecChangedEventName, $scope.bindings.viewspec);
				};
			}
    	};
	}])
	.directive('knalledgeMapList', ['$rootScope', /*, '$window', 'KnalledgeNodeService', 'KnalledgeEdgeService', '$q', */ function($rootScope/*, $window, KnalledgeNodeService, KnalledgeEdgeService, $q*/){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/knalledgeMap/partials/knalledgeMap-list.tpl.html',
			controller: function ( $scope ) {
				$scope.nodeContent = {
					htmlProperty: "",
					editing: false
				};

				$scope.enableEditing = function(){
					$scope.nodeContent.editing = true;
				};

				// $scope.nodeState = {
				//     selected: function() {
				//     	//console.warn('knalledgeMap.mapStructure.getSelectedNode():'+knalledgeMap.mapStructure.getSelectedNode());
				//     	return 1;//nodeContent.node;//return knalledgeMap.mapStructure.getSelectedNode();
				//     }
				//  };

				$scope.propertyChanged = function(){
					console.info("[knalledgeMapList:propertyChanged] $scope.nodeContent.htmlProperty: %s", $scope.nodeContent.htmlProperty);
					var knalledgePropertyChangedEventName = "knalledgePropertyChangedEvent";
					//console.log("result:" + JSON.stringify(result));
					$rootScope.$broadcast(knalledgePropertyChangedEventName, $scope.nodeContent.htmlProperty);
				};

				var changeKnalledgePropertyEventName = "changeKnalledgePropertyEvent";
				$scope.$on(changeKnalledgePropertyEventName, function(e, nodeContent) {
					//console.warn('nodeContent.node:'+nodeContent.node);
					console.info("[knalledgeMapList] [on:%s] nodeContent.node: %s (%s), property: %s", changeKnalledgePropertyEventName, (nodeContent.node ? nodeContent.node.id : null),
						(nodeContent.node ? nodeContent.node.kNode._id : null), nodeContent.property);
					$scope.nodeContent.editing = false;
					$scope.nodeContent.node = nodeContent.node;
					$scope.nodeContent.htmlProperty = nodeContent.property;
				});
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
				}

				$scope.cancelled = function(){
					//console.log("Canceled");
					$element.remove();
				};

				$scope.submitted = function(){
					console.log("Submitted: %s", JSON.stringify($scope.image));
					$scope.addedImage($scope.image);
					$element.remove();
				};

				// http://stackoverflow.com/questions/11442712/javascript-function-to-return-width-height-of-remote-image-from-url
				var getImageMeta = function(url, callback) {
					var img = new Image();
					img.src = url;
					img.onload = function() { callback(this.width, this.height);}
					img.onerror = function() { callback();}
				};

				$scope.urlChanged = function(){
					getImageMeta(
						$scope.image.url,
						function(width, height) {
							$scope.$apply(function(){
								// alert(width + 'px ' + height + 'px');
								$scope.image.width = width;
								$scope.image.height = height;
							});
						}
					);
				}

				var placeEntities = function(/*entities, direction*/){

				};

				placeEntities($element);
				$scope.entityClicked = function(entity, event, childScope){
					console.log("[mcmMapSelectSubEntity] entityClicked: %s, %s, %s", JSON.stringify(entity), event, childScope);
				};
    		}
    	};
	}])
	.directive('knalledgeMapsList', ["$rootScope", "$timeout", "$location", 'KnalledgeMapService', 'KnalledgeMapVOsService', 'RimaService',
		function($rootScope, $timeout, $location, KnalledgeMapService, KnalledgeMapVOsService, RimaService){
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
					RimaService.loadUsersFromList(); //TODO remove, after centralized loading is done
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
						KnalledgeMapVOsService.updateNode(rootNode);
					};

					var rootNodeCreated = function(rootNode){
						$scope.mapToCreate.rootNodeId = rootNode._id;
						$scope.mapToCreate.iAmId = RimaService.getActiveUserId();
						var map = KnalledgeMapService.create($scope.mapToCreate);
						map.$promise.then(mapCreated);
					};

					console.log("createNew");
					$scope.modeCreating = false;

					var rootNode = new knalledge.KNode();
					rootNode.name = $scope.mapToCreate.name;
					rootNode.mapId = null;
					rootNode.iAmId = RimaService.getActiveUserId();
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

	.directive('ibisTypesList', ["$rootScope", "$timeout", "$location", "IbisTypesService",
		function($rootScope, $timeout, $location, IbisTypesService){
		console.log("[ibisTypesList] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/knalledgeMap/partials/ibisTypes-list.tpl.html',
			controller: function ( $scope, $element) {
				$scope.mapToCreate = null;
				$scope.modeCreating = false;
				$scope.items = null;
				$scope.selectedItem = null;

				$scope.items = IbisTypesService.getTypes();

			    $scope.selectedItem = IbisTypesService.getActiveType();
				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + $scope.selectedItem.name + ": " + $scope.selectedItem._id);
				    IbisTypesService.selectActiveType	(item);
				};
    		}
    	};
	}])
;

}()); // end of 'use strict';
