(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
* the namespace for core services for the KnAllEdge system
* @namespace knalledge.knalledgeMap.knalledgeMapDirectives
*/

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

var KnRealTimeviewConfigChangedEventName = "view-config-change";
//var KnRealTimeMapViewSpecChangedEventName = "map-viewspec-change";
var KnRealTimeBehaviourChangedEventName = "map-behaviour-change";
var KnRealTimeBroadcastUpdateMaps = "update-maps";
var KnRealTimeBroadcastReloadMaps = "reload-maps";

angular.module('knalledgeMapDirectives', ['Config'])

	/**
	* @class knalledgeMap
	* @memberof knalledge.knalledgeMap.knalledgeMapDirectives
	*/
	.directive('knalledgeMap', ['$injector', '$rootScope', '$compile', '$route', '$routeParams', '$timeout', '$location', '$window',
		'KnalledgeNodeService', 'KnalledgeEdgeService', 'KnalledgeMapVOsService',
		'KnalledgeMapService', 'KnalledgeMapViewService',
		'KnAllEdgeSelectItemService', 'KnalledgeMapPolicyService',
		'CollaboPluginsService', 'SyncingService', 'injector', 'Plugins',
		/**
	 	* @memberof knalledge.knalledgeMap.knalledgeMapDirectives.knalledgeMap#
	 	* @constructor
	 	* @param {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeNodeService} KnalledgeNodeService
	 	* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeEdgeService} KnalledgeEdgeService
		* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService} KnalledgeMapVOsService
		* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapService} KnalledgeMapService
		* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapViewService} KnalledgeMapViewService
		* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeSelectItemService} KnAllEdgeSelectItemService
		* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapPolicyService} KnalledgeMapPolicyService
		* @param  {knalledge.collaboPluginsServices.CollaboPluginsService} CollaboPluginsService
		* @param  {knalledge.knalledgeMap.knalledgeMapServices.SyncingService} SyncingService
		* @param  {utils.Injector} injector
		* @param  {config.Plugins}  Plugins
	 	*/

		function($injector, $rootScope, $compile, $route, $routeParams, $timeout, $location, $window,
		KnalledgeNodeService, KnalledgeEdgeService, KnalledgeMapVOsService,
		KnalledgeMapService, KnalledgeMapViewService,
		KnAllEdgeSelectItemService, KnalledgeMapPolicyService,
		CollaboPluginsService, SyncingService, injector, Plugins){

		// getting services dinamicaly by injecting
		// TODO: here we can inject config object/service
		// that will pull/provide services across the system
		// depending on available (which is configurabe) components/plugins
		// and services
		var IbisTypesService = $injector.get('IbisTypesService');
		var NotifyService = $injector.get('NotifyService');
		var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');

		try{
			// * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService} KnAllEdgeRealTimeService
			var KnAllEdgeRealTimeService = Plugins.puzzles.knalledgeMap.config.knAllEdgeRealTimeService.available ?
				$injector.get('KnAllEdgeRealTimeService') : null;
		}catch(err){
			console.warn("Error while trying to retrieve the KnAllEdgeRealTimeService service:", err);
		}
		try{
			// * @param  {rima.rimaServices.RimaService}  RimaService
			var RimaService = Plugins.puzzles.rima.config.rimaService.available ?
				$injector.get('RimaService') : null;
		}catch(err){
			console.warn(err);
		}

		try{
			// * @param {knalledge.collaboPluginsServices.CollaboGrammarService} CollaboGrammarService
			var CollaboGrammarService = Plugins.puzzles.collaboGrammar.config.collaboGrammarService.available ?
				$injector.get('CollaboGrammarService') : null;
		}catch(err){
			console.warn(err);
		}

		injector.addPath("collaboPlugins.CollaboGrammarService", CollaboGrammarService);

		// loading component plugins' services

		var loadPluginsServices = function loadPluginsServices(
			configPlugins, serviceRefs, pluginsToLoad, injectorAngular, injectorPartial
		){
			// iterating through components
			for(var componentName in configPlugins){
				var component = configPlugins[componentName];
				// if disabled skip
				if(!component.active) continue;

				// list of services that we have to load
				var serviceIds = [];

				serviceRefs[componentName] = {};

				// iterating through all plugins we care for in this directive
				if(!component.plugins) continue;
				for(var pluginId in component.plugins){
					if(!pluginsToLoad[pluginId]) continue;

					var plugins = component.plugins[pluginId];
					for(var pId in plugins){
						var serviceId = plugins[pId];
						serviceIds.push(serviceId);
					}
				}

				// injecting reuqired services
				for(var sId in serviceIds){
					var serviceId = serviceIds[sId];
					if(serviceRefs[componentName][serviceId]) continue;
					var serviceConfig = component.services[serviceId];
					// injecting
					var serviceRef =
						injectorAngular.get(serviceConfig.name || serviceId);
					serviceRefs[componentName][serviceId] =
						serviceRef;
					// path to the service
					var servicePath = serviceConfig.path ||
						(componentName + "." + (serviceConfig.name || serviceId));

					if(!injectorPartial.has(servicePath))
						injectorPartial.addPath(servicePath, serviceRef);
				}
			}
		};

		// references to loaded services
		var componentServiceRefs = {};
		// plugins that we care for inside the directive
		var pluginsOfInterest = {
			mapVisualizePlugins: true,
			mapVisualizeHaloPlugins: true,
			mapInteractionPlugins: true,
			keboardPlugins: true
		};

		loadPluginsServices(Config.Plugins.puzzles, componentServiceRefs, pluginsOfInterest, $injector, injector);

		//duplikat: var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');
		var changeKnalledgePropertyEventName = "changeKnalledgePropertyEvent";
		GlobalEmitterServicesArray.register(changeKnalledgePropertyEventName);
		var knalledgeMapUpdateEventName = "knalledgeMapUpdateEvent";
		GlobalEmitterServicesArray.register(knalledgeMapUpdateEventName);
		var mapEntitySelectedEventName = "mapEntitySelectedEvent";
		GlobalEmitterServicesArray.register(mapEntitySelectedEventName);
		var changeKnalledgeRimaEvent = "changeKnalledgeRimaEvent";
		GlobalEmitterServicesArray.register(changeKnalledgeRimaEvent);
		var changeSelectedNodeEventName = "changeSelectedNodeEvent";
		GlobalEmitterServicesArray.register(changeSelectedNodeEventName);
		var selectedNodeChangedEventName = "selectedNodeChangedEvent";
		GlobalEmitterServicesArray.register(selectedNodeChangedEventName);

		var KnRealTimeNodeCreatedEventName = "node-created-to-visual";
		GlobalEmitterServicesArray.register(KnRealTimeNodeCreatedEventName);
		var KnRealTimeNodeDeletedEventName = "node-deleted-to-visual";
		GlobalEmitterServicesArray.register(KnRealTimeNodeDeletedEventName);
		var KnRealTimeNodeUpdatedEventName = "node-updated-to-visual";
		GlobalEmitterServicesArray.register(KnRealTimeNodeUpdatedEventName);

		var KnRealTimeEdgeCreatedEventName = "edge-created-to-visual";
		GlobalEmitterServicesArray.register(KnRealTimeEdgeCreatedEventName);
		var KnRealTimeEdgeUpdatedEventName = "edge-updated-to-visual";
		GlobalEmitterServicesArray.register(KnRealTimeEdgeUpdatedEventName);
		var KnRealTimeEdgeDeletedEventName = "edge-deleted-to-visual";
		GlobalEmitterServicesArray.register(KnRealTimeEdgeDeletedEventName);

		var modelLoadedEventName = "modelLoadedEvent";
		GlobalEmitterServicesArray.register(modelLoadedEventName);
		var knalledgePropertyChangedEventName = "knalledgePropertyChangedEvent";
		GlobalEmitterServicesArray.register(knalledgePropertyChangedEventName);
		var behaviourChangedEventName = "behaviourChangedEvent";
		GlobalEmitterServicesArray.register(behaviourChangedEventName);

		var nodeMediaClickedEventName = "nodeMediaClickedEvent";
		GlobalEmitterServicesArray.register(nodeMediaClickedEventName);

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
			templateUrl: 'components/knalledgeMap/partials/knalledgeMap.tpl.html',
			controller: function ( $scope, $element) {
				$scope.subscriptions = [];

				$scope.$on('$destroy', function(){
					// alert("knalledge.knalledgeMap directive is about to be destroyed!");
					for(var i in $scope.subscriptions){
						// http://stackoverflow.com/questions/36494509/how-to-unsubscribe-from-eventemitter-in-angular-2
						$scope.subscriptions[i].unsubscribe();
					}
					$scope.knalledgeMap.destroy();
				})

				if($routeParams.route){
					$scope.route = decodeRoute($routeParams.route);
				}

				var model = null;
				// var knalledgeMap = new mcm.Map(ConfigMap, knalledgeMapClientInterface, entityStyles);
				// $scope.knalledgeMap.init();

				var knalledgeMap = null;
				var config = null;
				var init = function(){
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
										width: 150,
										height: 40
									}
								}
							},
							labels: {
								show: true
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
							selectableEnabled: false,
							fixedDepth: {
								enabled: false,
								levelDepth: 300
							},
							sizing: {
								setNodeSize: true,
								nodeSize: [200, 100]
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

					/**
					 * API Interface for the knalledge.Map object and sub objects
					 * @interface kMapClientInterface
					 * @memberof knalledge.knalledgeMap.knalledgeMapDirectives.knalledgeMap
					 */
					var kMapClientInterface = {
						/**
						 * Propagates clicked node to parent directive and
						 * broadcasts node's property (content)
						 * @function nodeClicked
						 * @name kMapClientInterface#nodeClicked
						 * **TODO**: make nodeUnselected and nodeSelected (instead)
						 * @param  {knalledge.VKNode} vkNode - clicked node
						 * @param  {DOM} dom - dom of the clicked node
						 * @param  {boolean} commingFromAngular - if the call comes from the ng world or from wildness
						 */
						nodeClicked: function(vkNode, dom, commingFromAngular){
							if(vkNode) kMapClientInterface.nodeSelected(vkNode, dom, commingFromAngular);
							else kMapClientInterface.nodeUnselected(vkNode, dom, commingFromAngular);
						},
						/**
						 * Reacts to clicking media content inside the node
						 * @function nodeMediaClicked
						 * @name kMapClientInterface#nodeMediaClicked
						 * @param  {knalledge.VKNode} vkNode - clicked node
						 */
						nodeMediaClicked: function(vkNode){
							if(vkNode){
								GlobalEmitterServicesArray.get(nodeMediaClickedEventName).broadcast('knalledgeMap', vkNode);
							}
						},
						/**
						 * Propagates selected node to parent directive and
						 * broadcasts node's property (content)
						 * @function nodeSelected
						 * @name kMapClientInterface#nodeSelected
						 * @param  {knalledge.VKNode} vkNode - clicked node
						 * @param  {DOM} dom - dom of the clicked node
						 * @param  {string} selectionSource - source of node selection (internal, external)
						 * @param  {boolean} commingFromAngular - if the call comes from the ng world or from wildness
						 */
						nodeSelected: function(vkNode, dom, selectionSource, commingFromAngular){
							if(selectionSource === knalledge.Map.INTERNAL_SOURCE
							){
								KnalledgeMapPolicyService.provider.config.broadcasting.receiveNavigation = false;
							}

							var processNodeSelected = function(){
								// Referencing DOM nodes in Angular expressions is disallowed!
								dom = null;

								// here we call a parent directive listener interested
								// in clicking the node
								// This is mostly used in the case when top directive provides map data and listens for response from the this (knalledgeMap) directive
								$scope.nodeSelected({"vkNode": vkNode, "dom": dom});
								var property = undefined;

								// get property and broadcast it
								// at the moment `knalledgeMapList` directive listens for this event
								// and presents the property inside the editor
								if(vkNode){
									if($routeParams.node_id !== vkNode.kNode._id){
										$routeParams.node_id = vkNode.kNode._id;
										$route.updateParams($routeParams);
									}
									// http://www.historyrundown.com/did-galileo-really-say-and-yet-it-moves/
									if(vkNode.kNode.dataContent) property = vkNode.kNode.dataContent.property;
									console.log("[knalledgeMap::kMapClientInterface::nodeClicked'] vkNode[%s](%s): property: %s", vkNode.id, vkNode.kNode._id, property);
								}else{
									console.log("[knalledgeMap::kMapClientInterface::nodeClicked'] node is not provided. property: %s", property);
								}

								var nodeContent = {
									node: vkNode,
									property: property
								};

								GlobalEmitterServicesArray.get(changeKnalledgePropertyEventName).broadcast('knalledgeMap', nodeContent);
								GlobalEmitterServicesArray.get(selectedNodeChangedEventName).broadcast('knalledgeMap', vkNode);
							}

							if(commingFromAngular) processNodeSelected();
							else{
								$scope.$apply(processNodeSelected);
							}
						},
						/**
						 * Propagates unselected node to parent directive and
						 * broadcasts node's property (content)
						 * @function nodeUnselected
						 * @name kMapClientInterface#nodeUnselected
						 * @param  {knalledge.VKNode} vkNode - clicked node
						 * @param  {DOM} dom - dom of the clicked node
						 * @param  {boolean} commingFromAngular - if the call comes from the ng world or from wildness
						 */
						nodeUnselected: function(vkNode, dom, selectionSource, commingFromAngular){
							var processNodeUnselected = function(){
								// Referencing DOM nodes in Angular expressions is disallowed!
								dom = null;

								// here we call a parent directive listener interested
								// in clicking the node
								// This is mostly used in the case when top directive provides map data and listens for response from the this (knalledgeMap) directive
								$scope.nodeSelected({"vkNode": null, "dom": dom});
								var property = "";

								// get property and broadcast it
								// at the moment `knalledgeMapList` directive listens for this event
								// and presents the property inside the editor
								var nodeContent = {
									node: null,
									property: undefined
								};

								GlobalEmitterServicesArray.get(changeKnalledgePropertyEventName).broadcast('knalledgeMap', nodeContent);
							}

							if(commingFromAngular) processNodeUnselected();
							else{
								$scope.$apply(processNodeUnselected);
							}
						},
						searchNodeByName: function(){
							$scope.$apply(function () {
								var labels = {
									itemName: "Node",
									itemNames: "Nodes"
								};

								var itemType = "vkNode";

								var selectionOfItemFinished = function(item){
									var vkNode = item;
									if(itemType == 'kNode'){
										$scope.knalledgeMap.mapStructure.getVKNodeByKId(item._id);
									}
									$scope.knalledgeMap.nodeSelected(vkNode);
								};

								// var items = KnalledgeMapVOsService.getNodesList();
								var items = $scope.knalledgeMap.mapStructure.getNodesList();

								KnAllEdgeSelectItemService.openSelectItem(items, labels, selectionOfItemFinished, itemType);
							});
						},

						toggleModerator: function(){
							$scope.$apply(function () {
								KnalledgeMapPolicyService.provider.config.moderating.enabled = !KnalledgeMapPolicyService.provider.config.moderating.enabled;
							});
						},

						togglePresenter: function(){
							$scope.$apply(function () {
								if(KnalledgeMapPolicyService.provider.config.moderating.enabled){
									KnalledgeMapPolicyService.provider.config.broadcasting.enabled = !KnalledgeMapPolicyService.provider.config.broadcasting.enabled;
								}
							});
						},

						mapEntityClicked: function(mapEntity /*, mapEntityDom*/){
							$scope.$apply(function () {
								//var mapEntityClicked = mapEntity;
								GlobalEmitterServicesArray.get(mapEntitySelectedEventName).broadcast('knalledgeMap', mapEntity);
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
											$scope.knalledgeMap.update(vkNode);
										};
										KnalledgeMapVOsService.updateNode(vkNode.kNode,knalledge.KNode.UPDATE_TYPE_IMAGE).$promise
											.then(updated);
									}.bind(this);

								}
							});
						}
					};

					// this function iterates through components' plugins
					// and injects them into mapPlugins structure
					// that will be used in sub components
					function injectPlugins(pluginsName){
						if(!mapPlugins[pluginsName]){
							mapPlugins[pluginsName] = {};
						}

						for(var componentName in Config.Plugins.puzzles){
							var component = Config.Plugins.puzzles[componentName];
							if(component.active && component.plugins &&
								component.plugins[pluginsName]
							){
								for(var sId in component.plugins[pluginsName]){
									var serviceId = component.plugins[pluginsName][sId];
									var serviceConfig = component.services[serviceId];
									var serviceName = serviceConfig.name || serviceId;

									if(!componentServiceRefs[componentName][serviceId].plugins) continue;

									// path to the service
									var servicePath = serviceConfig.path ||
										(componentName + "." + (serviceConfig.name || serviceId));

									mapPlugins[pluginsName][servicePath] =
										componentServiceRefs[componentName][serviceId].plugins[pluginsName];
								}
							}
						}
					}

					/**
					 * Plugins that are provided to the knalledge.Map
					 * @type {Object}
					 */
					var mapPlugins = {
					};

					// injecting plugins
					for(var pluginName in pluginsOfInterest){
						injectPlugins(pluginName);
					}

					injector.addPath("timeout", $timeout);

					injector.addPath("collaboPlugins.globalEmitterServicesArray", GlobalEmitterServicesArray);

					$scope.knalledgeMap = new knalledge.Map(
						d3.select($element.find(".knalledge_map_container").get(0)),
						config, kMapClientInterface, null,
							config.tree.mapService.enabled ? KnalledgeMapVOsService : null,
							// if $scope.mapData is set, we do not use KnalledgeMapVOsService.mapStructure but let knalledge.Map to create a new mapStructure and build VKs from Ks
							checkData($scope.mapData) ? null : KnalledgeMapVOsService.mapStructure,
							CollaboPluginsService, RimaService, IbisTypesService, NotifyService, mapPlugins, KnalledgeMapViewService, SyncingService, KnAllEdgeRealTimeService, KnalledgeMapPolicyService, injector, Plugins);
					$scope.knalledgeMap.init();

					// providing select item service with the context
					// var el = $element;
					// https://docs.angularjs.org/api/ng/function/angular.element
					var el = angular.element('.knalledge_map_middle');
					KnAllEdgeSelectItemService.init(knalledgeMap, $scope, el);

					$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeNodeCreatedEventName).subscribe('knalledgeMap', $scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));
					$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeNodeUpdatedEventName).subscribe('knalledgeMap', $scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));
					$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeNodeDeletedEventName).subscribe('knalledgeMap',$scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));

					$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeEdgeCreatedEventName).subscribe('knalledgeMap', $scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));
					$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeEdgeUpdatedEventName).subscribe('knalledgeMap', $scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));
					$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeEdgeDeletedEventName).subscribe('knalledgeMap',$scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));
				};

				/**
				 * This is necessary since ng2 injects some object into $scope.mapData
				 * even if parent directive do not provide any mapData
				 * Returns true if data exist and are healthy (structurarly) map data
				 * @function checkData
				 * @param  {knalledge.knalledgeMap.knalledgeMapServices.MapData} data - map data
				 * @return {boolean}
				 */
				var checkData = function(data){
					if(!model) return false;
					if(!('map' in model)){
						console.warn("[directive:knalledgeMap:checkData] strange data: ", data);
						return false;
					};
					return true;
				}

				var setData = function(model){
					if(!checkData(model)) return;
					var selectedKNodeId = null;
					if($routeParams.node_id) selectedKNodeId = $routeParams.node_id;
					if($scope.mapData && $scope.mapData.selectedNode){
						selectedKNodeId = $scope.mapData.selectedNode;
					}

					$scope.knalledgeMap.processData(model, selectedKNodeId, function(){
						// we call the second time since at the moment dimensions of nodes (images, ...) are not known at the first update
						// TODO: we need to avoid this and reduce map processing
						// $scope.knalledgeMap.update();
						// if(
						// 	($scope.mapData && $scope.mapData.selectedNode)
						// 	|| $routeParams.node_id){
						// 	var vkNode = $scope.knalledgeMap.mapStructure.getVKNodeByKId($scope.mapData.selectedNode._id);
						// 	$scope.knalledgeMap.mapLayout.selectNode(vkNode, null, true, true, true);
						// }
					});
				};

				$timeout(function(){
					delayedFunc();
				}, 500);

				/**
				 * Loads map with specific map id
				 * @param  {string} mapId the id of the map to be loaded
				 */
				var loadMapWithId = function(mapId){
					/**
					 * Callback after loading map object from the KnalledgeMapService
					 * @param  {knalledge.KMap} map - map object
					 */
					var gotMap = function(kMap){
						console.log('gotMap:'+JSON.stringify(kMap));
						console.log('KnalledgeMapService.map:',KnalledgeMapService.map);
						// this method broadcasts the 'modelLoadedEvent' event after loading and processing kMap
						// this event is subscribed bellow for
						KnalledgeMapVOsService.loadAndProcessData(kMap, function(){
							if($scope.route){
								// alert("redirecting to: " + $scope.route);
								if($scope.route.indexOf("http") < 0){
									$location.path($scope.route);
								}else{
									$window.location.href = $scope.route;
								}
							}
						});
					};

					console.warn("loading map by mcmMapDirectives: mapId: " + mapId);

					// TODO: FIX: promise doesn't work well, we need callback
					// KnalledgeMapService.getById(mapId).$promise.then(gotMap);
					KnalledgeMapService.getById(mapId, gotMap);
				};

				var delayedFunc = function(){
					init();
					if(checkData(model)){
						// console.warn('have $scope.mapData:' + JSON.stringify($scope.mapData));
						setData($scope.mapData);
					}else{
						loadMapWithId($routeParams.id);
					}

					$scope.subscriptions.push(GlobalEmitterServicesArray.get(modelLoadedEventName).subscribe('knalledgeMap', function(eventModel) {
						// there is only one listener so we can stop further propagation of the event
						// e.stopPropagation();

						console.log("[knalledgeMap.controller::$on] ModelMap  nodes(len: %d): ",
							eventModel.map.nodes.length, eventModel.map.nodes);
						console.log("[knalledgeMap.controller::$on] ModelMap  edges(len: %d): ",
							eventModel.map.edges.length, eventModel.map.edges);

						// $scope.knalledgeMap.placeModels(eventModel);
						model = eventModel;
						setData(model);
					}));

					$scope.$watch(function () {
						return $scope.mapData;
					},
					function(newValue){
						//alert("RimaService.howAmIs changed: " + JSON.stringify(newValue));
						if(newValue) setData(newValue);
					}, true);


					$scope.subscriptions.push(GlobalEmitterServicesArray.get(knalledgePropertyChangedEventName).subscribe('knalledgeMap', function(knalledgeProperty) {
						var vkNode = $scope.knalledgeMap.mapStructure.getSelectedNode();

						var knalledgePropertyBefore = null;
						if(vkNode){
							console.log("[knalledgeMap.controller::$on:%s] vkNode[%s](%s): (old knalledgeProperty: %s), knalledgeProperty: %s", knalledgePropertyChangedEventName, vkNode.id, vkNode.kNode._id,
								(vkNode.kNode.dataContent ? vkNode.kNode.dataContent.property : null),
								knalledgeProperty);

							if(!vkNode.kNode.dataContent) vkNode.kNode.dataContent = {};
							if(vkNode.kNode.dataContent.property) knalledgePropertyBefore = vkNode.kNode.dataContent.property;
							//var nowExist = (knalledgeProperty !== null) && (knalledgeProperty.length > 0);
							//var beforeExisted = (vkNode.kNode.dataContent.property !== null) && (vkNode.kNode.dataContent.property.length > 0);
							if(knalledgePropertyBefore == knalledgeProperty) return;
							if(!knalledgePropertyBefore && !knalledgeProperty) return;

							vkNode.kNode.dataContent.property = knalledgeProperty;
							$scope.knalledgeMap.mapStructure.updateNode(vkNode, knalledge.MapStructure.UPDATE_DATA_CONTENT);
						}else{
						console.log("[knalledgeMap.controller::$on:%s] node not selected. knalledgeProperty: %s", knalledgePropertyChangedEventName, knalledgeProperty);


						}
					}));

					// var viewspecChanged = function(newViewspec) {
					// 	console.log("[knalledgeMap.controller::$on] event: %s", viewspecChangedEventName);
					// 	console.log("[knalledgeMap.controller::$on] newViewspec: %s", newViewspec);
					// 	config.tree.viewspec = newViewspec;
					// 	toolsChange(KnRealTimeMapViewSpecChangedEventName);
					// };
					// var viewspecChangedEventName = "viewspecChangedEvent";
					// $scope.subscriptions.push(GlobalEmitterServicesArray.get(viewspecChangedEventName).subscribe('knalledgeMap', viewspecChanged));

					var viewConfigChanged = function(msg) {
						//setData(model);
						console.log("[knalledgeMap.controller::$on] event: %s", viewConfigChangedEventName);
						if(msg.path == 'config.visualization.viewspec'){
								config.tree.viewspec = msg.value;
						}
						toolsChange(KnRealTimeviewConfigChangedEventName, msg);
					};

					function knalledgeMapUpdate(){
						$scope.knalledgeMap.update();
					}

					$scope.subscriptions.push(GlobalEmitterServicesArray.get(knalledgeMapUpdateEventName).subscribe('knalledgeMap', knalledgeMapUpdate));

					var viewConfigChangedEventName = "viewConfigChangedEvent";
					$scope.subscriptions.push(GlobalEmitterServicesArray.get(viewConfigChangedEventName).subscribe('knalledgeMap', viewConfigChanged));

					var toolsChange = function(eventName, msg){
						$scope.knalledgeMap.update();
						// realtime distribution
						if(KnAllEdgeRealTimeService){
							KnAllEdgeRealTimeService.emit(eventName, msg);
						}
					};

					var behaviourChanged = function(msg) {
						//setData(model);
						console.log("[knalledgeMap.controller::$on] event: %s", behaviourChangedEventName);
						toolsChange(KnRealTimeBehaviourChangedEventName, msg);
						updateState(msg.value);
					};
					$scope.subscriptions.push(GlobalEmitterServicesArray.get(behaviourChangedEventName).subscribe('knalledgeMap', behaviourChanged));

					var realTimeBehaviourChanged = function(eventName, msg){
						console.log('realTimeBehaviourChanged:', eventName,'msg:', msg);

						switch(msg.path){
							// case 'policyConfig.behaviour.brainstorming':
							// 	KnalledgeMapPolicyService.provider.config.behaviour.brainstorming = msg.value;
							// 	break;
						}
						updateState(msg.value);
						$scope.knalledgeMap.update();
					}

					var updateState = function(value){
						if(value===0){
		          KnalledgeMapPolicyService.provider.config.state = {id:0, name:''};
		        }else{
		            KnalledgeMapPolicyService.provider.config.state = {id:value, name:'Brainstorming ('+value +')'};
		        }
					}


					// realtime listener registration
					if(KnAllEdgeRealTimeService){
						/**
						 * registered to event `KnRealTimeviewConfigChangedEventName`, to be called by `KnAllEdgeRealTimeService` from `mapStructure.service `
						 * @param  {string} eventName [description]
						 * @param  {Object} msg       [description]
						 * @return {[type]}           [description]
						 */
						var realTimeviewConfigChanged = function(eventName, msg){

							//TODO: this should not be treated as viewConfig change but as other type
							if(msg.path == 'policyConfig.broadcasting.enabled' && msg.value){ // Highlander: There can be only one!
								KnalledgeMapPolicyService.provider.config.broadcasting.enabled = false;
							}

							if(!KnalledgeMapPolicyService.provider.config.broadcasting.receiveVisualization){return;}
							switch(msg.path){
								case 'config.nodes.showImages':
									KnalledgeMapViewService.provider.config.nodes.showImages = msg.value;
									break;
								case 'config.nodes.showTypes':
									KnalledgeMapViewService.provider.config.nodes.showTypes = msg.value;
									break;
								case 'config.edges.showNames':
									KnalledgeMapViewService.provider.config.edges.showNames = msg.value;
									break;
								case 'config.edges.showTypes':
									KnalledgeMapViewService.provider.config.edges.showTypes = msg.value;
									break;
								case 'config.visualization.viewspec':
									KnalledgeMapViewService.provider.config.visualization.viewspec = config.tree.viewspec = msg.value;
									break;
								case 'config.filtering.displayDistance':
									KnalledgeMapViewService.provider.config.filtering.displayDistance = msg.value;
									break;
								case 'config.filtering.visbileTypes.ibis':
									KnalledgeMapViewService.provider.config.filtering.visbileTypes.ibis = msg.value;
									break;
							}
							$scope.knalledgeMap.update();
						};

						// var realTimeMapViewspecChanged = function(eventName, newViewspec){
						// 	console.log("[knalledgeMap.controller::realTimeMapViewspecChanged] newViewspec: %s", newViewspec);
						// 	config.tree.viewspec = newViewspec;
						// 	$scope.knalledgeMap.update();
						// };

						var mapViewPluginOptions = {
							name: "mapView",
							events: {
							}
						};

						mapViewPluginOptions.events[KnRealTimeBroadcastUpdateMaps] = $scope.knalledgeMap.update.bind(knalledgeMap);

						mapViewPluginOptions.events[KnRealTimeBroadcastReloadMaps] = loadMapWithId.bind(null, $routeParams.id);

						mapViewPluginOptions.events[KnRealTimeviewConfigChangedEventName] = realTimeviewConfigChanged.bind(this);

						mapViewPluginOptions.events[KnRealTimeBehaviourChangedEventName] = realTimeBehaviourChanged.bind(this);

						KnAllEdgeRealTimeService.registerPlugin(mapViewPluginOptions);
					}

					var broadcastingChangedEventName = "broadcastingChangedEvent"
					// $scope.subscriptions.push(GlobalEmitterServicesArray.get(broadcastingChangedEventName).subscribe('knalledgeMap', function() {
					// 	console.log("[knalledgeMap.controller::$on] event: %s", broadcastingChangedEventName);
					// 	// $scope.knalledgeMap.syncingChanged(); NOT USED ANY MORE
					// }));

					$scope.subscriptions.push(GlobalEmitterServicesArray.get(changeKnalledgeRimaEvent).subscribe('knalledgeMap',
					function(msg) {
						console.log("[knalledgeMap.controller::$on] event: %s", changeKnalledgeRimaEvent);
						//msg is of type: {actionType:'what_deleted',node:$scope.node,what:whatId}
						$scope.knalledgeMap.mapStructure.nodeWhatsManagement(msg);
						$scope.knalledgeMap.update();
					}));

					$scope.subscriptions.push(GlobalEmitterServicesArray.get(changeSelectedNodeEventName).subscribe('knalledgeMap', function(vkNode) {
						console.log("[knalledgeMap.controller::$on] event: %s", changeSelectedNodeEventName);
						$scope.knalledgeMap.nodeSelected(vkNode);
					}));

					if(RimaService){
						$scope.$watch(function () {
							return RimaService.howAmIs;
						},
						function(newValue){
							//alert("RimaService.howAmIs changed: " + JSON.stringify(newValue));
							if(knalledgeMap) $scope.knalledgeMap.update();
						}, true);
					}
				};
			}
    	};
	}])
	.directive('knalledgeMapList', ['$rootScope', '$injector', 'KnalledgeMapPolicyService', /*, '$window', 'KnalledgeNodeService', 'KnalledgeEdgeService', '$q', */
	function($rootScope, $injector, KnalledgeMapPolicyService /*, $window, KnalledgeNodeService, KnalledgeEdgeService, $q*/){
		// http://docs.angularjs.org/guide/directive
		var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');
		var knalledgePropertyChangedEventName = "knalledgePropertyChangedEvent";
		GlobalEmitterServicesArray.register(knalledgePropertyChangedEventName);
		var changeKnalledgePropertyEventName = "changeKnalledgePropertyEvent";
		GlobalEmitterServicesArray.register(changeKnalledgePropertyEventName);
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: 'components/knalledgeMap/partials/knalledgeMap-list.tpl.html',
			controller: function ( $scope ) {
				$scope.nodeContent = {
					htmlProperty: "",
					editing: false
				};

				$scope.policyConfig = KnalledgeMapPolicyService.provider.config;
				$scope.enableEditing = function(){
					$scope.nodeContent.editing = true;
				};

				// $scope.nodeState = {
				//     selected: function() {
				//     	//console.warn('$scope.knalledgeMap.mapStructure.getSelectedNode():'+$scope.knalledgeMap.mapStructure.getSelectedNode());
				//     	return 1;//nodeContent.node;//return $scope.knalledgeMap.mapStructure.getSelectedNode();
				//     }
				//  };

				$scope.propertyChanged = function(){
					console.info("[knalledgeMapList:propertyChanged] $scope.nodeContent.htmlProperty: %s", $scope.nodeContent.htmlProperty);
					//console.log("result:" + JSON.stringify(result));
					GlobalEmitterServicesArray.get(knalledgePropertyChangedEventName).broadcast('knalledgeMapList', $scope.nodeContent.htmlProperty);
				};

				GlobalEmitterServicesArray.get(changeKnalledgePropertyEventName).subscribe('knalledgeMapList', function(nodeContent) {
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
			templateUrl: 'components/knalledgeMap/partials/knalledgeMap-imageEditing.tpl.html',
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

//	migrated to NG1 component `maps-list.component.ts`
// 	 	.directive('knalledgeMapsList', ["$rootScope", "$timeout", "$location", 'KnalledgeMapService', 'KnalledgeMapVOsService', 'RimaService', 'KnalledgeMapPolicyService'
// ,		function($rootScope, $timeout, $location, KnalledgeMapService, KnalledgeMapVOsService, RimaService, KnalledgeMapPolicyService){
// 		console.log("[mcmMapsList] loading directive");
// 		return {
// 			restrict: 'AE',
// 			scope: {
// 			},
// 			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
// 			// expression: http://docs.angularjs.org/guide/expression
// 			templateUrl: 'components/knalledgeMap/partials/knalledgeMaps-list.tpl.html',
// 			controller: function ( $scope, $element) {
// 				$scope.mapToCreate = null;
// 				$scope.modeCreating = false;
// 				$scope.modeEditing = false;
// 				$scope.items = null;
// 				$scope.selectedItem = null;
// 				$scope.policyConfig = KnalledgeMapPolicyService.provider.config;
//
// 				KnalledgeMapService.queryByParticipant(RimaService.getActiveUserId()).$promise.then(function(maps){
// 					$scope.items = maps;
// 					console.log('maps:'+JSON.stringify($scope.maps));
// 				});
//
// 				$scope.showCreateNewMap = function(){
// 					console.log("showCreateNewMap");
// 					$scope.mapToCreate = new knalledge.KMap();
// 					$scope.mapToCreate.participants = RimaService.getActiveUserId();
// 					$scope.modeCreating = true;
// 				};
//
// 				$scope.cancelled = function(){
// 					console.log("Canceled");
// 					$scope.modeCreating = false;
// 					$scope.modeEditing = false;
// 				};
//
// 				$scope.delete = function(map){
// 					//console.log("mapDelete:", map));
// 					if(window.confirm('Are you sure you want to delete map "'+map.name+'"?')){
// 						var mapDeleted = function(result){
// 							console.log('mapDeleted:result:'+result);
// 							for(let i=0;i<$scope.items.length;i++){
// 					      if($scope.items[i]._id === map._id){
// 					        $scope.items.splice(i, 1);
// 					      }
// 					    }
// 						}
// 						KnalledgeMapVOsService.mapDelete(map._id, mapDeleted);
// 					}
// 				};
//
// 				$scope.duplicate = function(map){
// 					//console.log("mapDelete:", map));
// 					if(window.confirm('Are you sure you want to duplicate map "'+map.name+'"?')){
// 						var mapDuplicated = function(map){
// 							console.log('mapDuplicated:map:'+map);
// 							if(map !== null){
// 								$scope.items.push(map);
// 								$scope.selectedItem = map;
// 							}
// 						}
// 						KnalledgeMapVOsService.mapDuplicate(map, 'duplicatedMap', mapDuplicated);
// 					}
// 				};
//
// 				$scope.getParticipantsNames = function(ids){
// 						var names = '';
// 						for(var i=0; i<ids.length;i++){
// 							var user = RimaService.getUserById(ids[i]);
// 							names+=user == null ? 'unknown' : user.displayName + ', ';
// 						}
// 						return names;
// 				};
//
// 				$scope.createNew = function(){
// 					var mapCreated = function(mapFromServer) {
// 						console.log("mapCreated:");//+ JSON.stringify(mapFromServer));
// 						$scope.items.push(mapFromServer);
// 						$scope.selectedItem = mapFromServer;
// 						rootNode.mapId = mapFromServer._id;
// 						KnalledgeMapVOsService.updateNode(rootNode,knalledge.KNode.UPDATE_TYPE_ALL);
// 					};
//
// 					var rootNodeCreated = function(rootNode){
// 						$scope.mapToCreate.rootNodeId = rootNode._id;
// 						$scope.mapToCreate.iAmId = RimaService.getActiveUserId();
//
// 						//TODO: so far this is string of comma-separated iAmIds:
// 						$scope.mapToCreate.participants = $scope.mapToCreate.participants.replace(/\s/g, '');
// 						$scope.mapToCreate.participants = $scope.mapToCreate.participants.split(',');
//
// 						var map = KnalledgeMapService.create($scope.mapToCreate);
// 						map.$promise.then(mapCreated);
// 					};
//
// 					console.log("createNew");
// 					$scope.modeCreating = false;
//
// 					var rootNode = new knalledge.KNode();
// 					rootNode.name = $scope.mapToCreate.name;
// 					rootNode.mapId = null;
// 					rootNode.iAmId = RimaService.getActiveUserId();
// 					rootNode.type = $scope.mapToCreate.rootNodeType ?
// 						$scope.mapToCreate.rootNodeType : "model_component";
// 					rootNode.visual = {
// 					    isOpen: true,
// 					    xM: 0,
// 					    yM: 0
// 					};
//
// 					rootNode = KnalledgeMapVOsService.createNode(rootNode);
// 					rootNode.$promise.then(rootNodeCreated);
// 				};
//
// 				$scope.updateMap = function(){
// 					$scope.modeEditing = false;
// 					window.alert('Editing is disabled');
// 					return;
// 					var mapUpdated = function(mapFromServer) {
// 						console.log("mapUpdated:");//+ JSON.stringify(mapFromServer));
// 						$scope.items.push(mapFromServer);
// 						$scope.selectedItem = mapFromServer;
// 						rootNode.mapId = mapFromServer._id;
// 						KnalledgeMapVOsService.updateNode(rootNode);
// 					};
//
// 					var rootNodeUpdated = function(rootNode){
// 						$scope.mapToCreate.rootNodeId = rootNode._id;
// 						$scope.mapToCreate.iAmId = RimaService.getActiveUserId();
//
// 						//TODO: so far this is string of comma-separated iAmIds:
// 						$scope.mapToCreate.participants = $scope.mapToCreate.participants.replace(/\s/g, '');
// 						$scope.mapToCreate.participants = $scope.mapToCreate.participants.split(',');
//
// 						var map = KnalledgeMapService.create($scope.mapToCreate);
// 						map.$promise.then(mapUpdated);
// 					};
//
//
// 					var rootNode = KnalledgeMapVOsService.getNodeById($scope.mapToCreate.rootNodeId);
//
// 					rootNode.name = $scope.mapToCreate.name;
// 					//rootNode.mapId = $scope.mapToCreate._id;
// 					//rootNode.iAmId = RimaService.getActiveUserId();
// 					rootNode.type = $scope.mapToCreate.rootNodeType ?
// 						$scope.mapToCreate.rootNodeType : "model_component";
// 					// rootNode.visual = {
// 					// 		isOpen: true,
// 					// 		xM: 0,
// 					// 		yM: 0
// 					// };
//
// 					rootNode = KnalledgeMapVOsService.updateNode(rootNode);
// 					rootNode.$promise.then(rootNodeUpdated);
// 				};
//
// 				$scope.selectItem = function(item) {
// 				    $scope.selectedItem = item;
// 				    console.log("$scope.selectedItem = " + $scope.selectedItem.name + ": " + $scope.selectedItem._id);
// 				};
//
// 				$scope.openMap = function() {
// 				    console.log("openMap");
// 					if($scope.selectedItem !== null && $scope.selectedItem !== undefined){
// 						console.log("openning Model:" + $scope.selectedItem.name + ": " + $scope.selectedItem._id);
// 						console.log("/map/id/" + $scope.selectedItem._id);
// 						$location.path("/map/id/" + $scope.selectedItem._id);
// 						//openMap($scope.selectedItem);
// 						// $element.remove();
// 					}
// 					else{
// 						window.alert('Please, select a Map');
// 					}
// 				};
//
// 				$scope.editMap = function() {
// 					$scope.modeEditing = true;
// 					var mapReceived = function(mapFromServer) {
// 						console.log("mapReceived:");//+ JSON.stringify(mapFromServer));
// 						$scope.items.push(mapFromServer);
// 						$scope.selectedItem = mapFromServer;
// 						rootNode.mapId = mapFromServer._id;
// 						KnalledgeMapVOsService.updateNode(rootNode);
// 					};
//
// 				    //console.log("openMap");
// 					if($scope.selectedItem !== null && $scope.selectedItem !== undefined){
// 						console.log("editMap Model:" + $scope.selectedItem.name + ": " + $scope.selectedItem._id);
// 						console.log("/map/id/" + $scope.selectedItem._id);
// 						$scope.mapToCreate = KnalledgeMapService.getById($scope.selectedItem._id);
// 						$scope.mapToCreate.$promise.then(mapReceived);
// 						//$scope.mapToCreate.participants = RimaService.getActiveUserId();
// 						//openMap($scope.selectedItem);
// 						// $element.remove();
// 					}
// 					else{
// 						window.alert('Please, select a Map');
// 					}
// 				};
//     		}
//     	};
// 	}])

	/* migrated to ng2 IbisTYpesList component
	.directive('ibisTypesList', ["$rootScope", "$timeout", "IbisTypesService",
		function($rootScope, $timeout, IbisTypesService){
		console.log("[ibisTypesList] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: 'components/knalledgeMap/partials/ibisTypes-list.tpl.html',
			controller: function ( $scope, $element) {
				$scope.mapToCreate = null;
				$scope.modeCreating = false;
				$scope.items = null;
				$scope.selectedItem = null;
				$scope.componentShown = true;

				$scope.items = IbisTypesService.getTypes();

			  $scope.selectedItem = IbisTypesService.getActiveType();
				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + $scope.selectedItem.name + ": " + $scope.selectedItem._id);
				    IbisTypesService.selectActiveType	(item);
				};
				$scope.hideShowComponent = function($el){
					// var elSwitch = $element.find('.content');
					// $(elSwitch).slideToggle();
					// console.log("Switching: ", $el);
					$scope.componentShown = !$scope.componentShown;
				}
    		}
    	};
	}])
	*/

	.directive('knalledgeMapSelectItem', ['KnAllEdgeSelectItemService', function(KnAllEdgeSelectItemService){ // mcm_map_select_sub_entity
		return {
			restrict: 'AE',
			// scope: {
			// 	labels: '='
			// },
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angulajrs.org/guide/expression
			templateUrl: 'components/knalledgeMap/partials/knalledgeMap-selectItem.tpl.html',
			link: function ( $scope, $element) {
				// https://api.jquery.com/focus/
				$element.find(".item_name").focus();
			},

			controller: function ( $scope, $element) {

				$scope.selectedItem = null;
				$scope.title = "Select Item";
				$scope.path = ".";
				$scope.item = {
					name: null
				};

				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + JSON.stringify(item.name));
				    if($scope.shouldSubmitOnSelection){
				    	$scope.submitted();
				    }
				};

				var populateItems = function(subName){
					console.log("getItemsDescsByName(%s)", subName);
					$scope.itemType = KnAllEdgeSelectItemService.itemType;
					$scope.items = KnAllEdgeSelectItemService.getItemsDescsByName(subName);
					console.log("$scope.items IN: " + $scope.items);
				};

				populateItems("");

				$scope.nameChanged = function(){
					//console.log("New searching Item name: %s", $scope.item.name);
					populateItems($scope.item.name);
					console.log("$scope.items: " + $scope.items);
				};
				$scope.cancelled = function(){
					unbindEvents();
					console.log("[KnAllEdgeSelectItemService] Cancelled");
					//console.log("Canceled");
					$element.remove(); //TODO: sta je ovo?
					$scope.selectingCanceled();
				};

				$scope.submitted = function(){
					unbindEvents();
					console.log("[KnAllEdgeSelectItemService] Submitted");
					if($scope.selectedItem !== null && $scope.selectedItem !== undefined){
						$scope.selectingSubmited($scope.selectedItem);
						$element.remove();
					}
					else{
						window.alert('Please, select a Item');
					}
				};

				var unbindEvents = function() {
			        // https://docs.angularjs.org/api/ng/function/angular.element
					// http://api.jquery.com/unbind/
					angular.element("body").unbind("keydown keypress", keyboardProcessing);
					$element.unbind("keydown keypress", keyboardProcessing);
				};

				var keyboardProcessing = function (event) {
		            if(event.which === 27) { // ECAPE
		                $scope.$apply(function (){
		                	$scope.cancelled();
		                });

		                event.preventDefault();
		            }

		            if(event.which === 13) { // ENTER
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
	}])
;


}()); // end of 'use strict';
