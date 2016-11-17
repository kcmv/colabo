(function() { // This prevents problems when concatenating scripts that aren't strict.
	'use strict';

  var SLASH_ENCODING = '___';

	// duplicated at components/rima/directives.js
	var decodeRoute = function(routeEncoded) {
		var route = decodeURI(routeEncoded);
		var slashIndex = 0;

		// replace the first level
		var slash0 = SLASH_ENCODING + "0";
		var rx = new RegExp(slash0, 'gi');
		route = route.replace(rx, '/');

		// decrease next levels
		for (var i = 1; i < 10; i++) {
			var slashCurrent = SLASH_ENCODING + i;
			var rx = new RegExp(slashCurrent, 'gi');
			var slashLess = SLASH_ENCODING + (i - 1);
			route = route.replace(rx, slashLess);
		}
		return route;
	};

	/**
	 * the namespace for core services for the KnAllEdge system
	 * @namespace knalledge.knalledgeMap.knalledgeMapDirectives
	 */

   var KnRealTimeviewConfigChangedEvent = "view-config-change";
 	var KnRealTimeBehaviourChangedEvent = "map-behaviour-change";
 	var KnRealTimeBroadcastUpdateMaps = "update-maps";
 	var KnRealTimeBroadcastReloadMaps = "reload-maps";

   angular.module('knalledgeMapDirectives')

   /**
 	 * @class knalledgeMap
 	 * @memberof knalledge.knalledgeMap.knalledgeMapDirectives
 	 */
 	.directive('knalledgeMap', ['$injector', '$rootScope', '$compile', '$route', '$routeParams', '$timeout', '$location', '$window',
 			'KnalledgeMapViewService',
 			'KnAllEdgeSelectItemService', 'KnalledgeMapPolicyService',
 			'CollaboPluginsService', 'injector', 'Plugins',
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
 				KnalledgeMapViewService,
 				KnAllEdgeSelectItemService, KnalledgeMapPolicyService,
 				CollaboPluginsService, injector, Plugins) {

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
 					controller: function($scope, $element) {
 						// getting services dinamicaly by injecting
 						try {
 							var KnalledgeNodeService = $injector.get('KnalledgeNodeService');
 						} catch (err) {
 							console.warn("[knalledgeMapDirectives:knalledgeMap] Error while trying to retrieve the KnalledgeNodeService service:", err);
 						}
 						try {
 							var KnalledgeEdgeService = $injector.get('KnalledgeEdgeService');
 						} catch (err) {
 							console.warn("[knalledgeMapDirectives:knalledgeMap] Error while trying to retrieve the KnalledgeEdgeService service:", err);
 						}
 						try {
 							var KnalledgeMapVOsService = $injector.get('KnalledgeMapVOsService');
 						} catch (err) {
 							console.warn("[knalledgeMapDirectives:knalledgeMap] Error while trying to retrieve the KnalledgeMapVOsService service:", err);
 						}
 						try {
 							var KnalledgeMapService = $injector.get('KnalledgeMapService');
 						} catch (err) {
 							console.warn("[knalledgeMapDirectives:knalledgeMap] Error while trying to retrieve the KnalledgeMapService service:", err);
 						}
 						try {
 							var SyncingService = $injector.get('SyncingService');
 						} catch (err) {
 							console.warn("[knalledgeMapDirectives:knalledgeMap] Error while trying to retrieve the SyncingService service:", err);
 						}

 						// TODO: here we can inject config object/service
 						// that will pull/provide services across the system
 						// depending on available (which is configurabe) components/plugins
 						// and services
 						try {
 							// * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService} KnAllEdgeRealTimeService
 							var IbisTypesService = $injector.get('IbisTypesService');
 						} catch (err) {
 							console.warn("Error while trying to retrieve the IbisTypesService service:", err);
 						}
 						try {
 							// * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService} KnAllEdgeRealTimeService
 							var NotifyService = $injector.get('NotifyService');
 						} catch (err) {
 							console.warn("Error while trying to retrieve the NotifyService service:", err);
 						}
 						var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');

 						try {
 							// * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService} KnAllEdgeRealTimeService
 							var KnAllEdgeRealTimeService = Plugins.puzzles.knalledgeMap.config.knAllEdgeRealTimeService.available ?
 								$injector.get('KnAllEdgeRealTimeService') : null;
 						} catch (err) {
 							console.warn("Error while trying to retrieve the KnAllEdgeRealTimeService service:", err);
 						}
 						try {
 							// * @param  {rima.rimaServices.RimaService}  RimaService
 							var RimaService = Plugins.puzzles.rima.config.rimaService.available ?
 								$injector.get('RimaService') : null;
 						} catch (err) {
 							console.warn(err);
 						}

 						try {
 							// * @param {knalledge.collaboPluginsServices.CollaboGrammarService} CollaboGrammarService
 							var CollaboGrammarService = Plugins.puzzles.collaboGrammar.config.collaboGrammarService.available ?
 								$injector.get('CollaboGrammarService') : null;
 						} catch (err) {
 							console.warn(err);
 						}

 						injector.addPath("collaboPlugins.CollaboGrammarService", CollaboGrammarService);

 						//duplikat: var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');
 						var changeKnalledgePropertyEvent = "changeKnalledgePropertyEvent";
 						GlobalEmitterServicesArray.register(changeKnalledgePropertyEvent);
 						var knalledgeMapUpdateEvent = "knalledgeMapUpdateEvent";
 						GlobalEmitterServicesArray.register(knalledgeMapUpdateEvent);
 						var mapEntitySelectedEvent = "mapEntitySelectedEvent";
 						GlobalEmitterServicesArray.register(mapEntitySelectedEvent);
 						var changeKnalledgeRimaEvent = "changeKnalledgeRimaEvent";
 						GlobalEmitterServicesArray.register(changeKnalledgeRimaEvent);
 						var changeSelectedNodeEvent = "changeSelectedNodeEvent";
 						GlobalEmitterServicesArray.register(changeSelectedNodeEvent);
 						var selectedNodeChangedEvent = "selectedNodeChangedEvent";
 						GlobalEmitterServicesArray.register(selectedNodeChangedEvent);

 						var KnRealTimeNodeCreatedEvent = "node-created-to-visual";
 						GlobalEmitterServicesArray.register(KnRealTimeNodeCreatedEvent);
 						var KnRealTimeNodeDeletedEvent = "node-deleted-to-visual";
 						GlobalEmitterServicesArray.register(KnRealTimeNodeDeletedEvent);
 						var KnRealTimeNodeUpdatedEvent = "node-updated-to-visual";
 						GlobalEmitterServicesArray.register(KnRealTimeNodeUpdatedEvent);

 						var KnRealTimeEdgeCreatedEvent = "edge-created-to-visual";
 						GlobalEmitterServicesArray.register(KnRealTimeEdgeCreatedEvent);
 						var KnRealTimeEdgeUpdatedEvent = "edge-updated-to-visual";
 						GlobalEmitterServicesArray.register(KnRealTimeEdgeUpdatedEvent);
 						var KnRealTimeEdgeDeletedEvent = "edge-deleted-to-visual";
 						GlobalEmitterServicesArray.register(KnRealTimeEdgeDeletedEvent);

 						var modelLoadedEvent = "modelLoadedEvent";
 						GlobalEmitterServicesArray.register(modelLoadedEvent);

 						var knalledgePropertyChangedEvent = "knalledgePropertyChangedEvent";
 						GlobalEmitterServicesArray.register(knalledgePropertyChangedEvent);

 						var knalledgePropertyChangedFinishedEvent = "knalledgePropertyChangedFinishedEvent";
 						GlobalEmitterServicesArray.register(knalledgePropertyChangedFinishedEvent);

 						var behaviourChangedEvent = "behaviourChangedEvent";
 						GlobalEmitterServicesArray.register(behaviourChangedEvent);

 						var nodeMediaClickedEvent = "nodeMediaClickedEvent";
 						GlobalEmitterServicesArray.register(nodeMediaClickedEvent);

 						var PRESENTER_CHANGED = "PRESENTER_CHANGED";
 						GlobalEmitterServicesArray.register(PRESENTER_CHANGED);

 						// http://docs.angularjs.org/guide/directive

 						$scope.subscriptions = [];

 						$scope.$on('$destroy', function() {
 							// alert("knalledge.knalledgeMap directive is about to be destroyed!");
 							for (var i in $scope.subscriptions) {
 								// http://stackoverflow.com/questions/36494509/how-to-unsubscribe-from-eventemitter-in-angular-2
 								$scope.subscriptions[i].unsubscribe();
 							}
 							$scope.knalledgeMap.destroy();
 						})

 						if ($routeParams.route) {
 							$scope.route = decodeRoute($routeParams.route);
 						}

 						var model = null;
 						// var knalledgeMap = new mcm.Map(ConfigMap, knalledgeMapClientInterface, entityStyles);
 						// $scope.knalledgeMap.init();

 						var knalledgeMap = null;
 						var config = null;
 						var init = function() {
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
 										opacity: 0.5,
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

 							function overwriteConfig(sourceObj, destinationObj) {
 								for (var i in destinationObj) {
 									if (i in sourceObj) {
 										if (typeof destinationObj[i] === 'object') {
 											overwriteConfig(sourceObj[i], destinationObj[i]);
 										} else {
 											destinationObj[i] = sourceObj[i];
 										}
 									}
 								}
 							}

 							if ($scope.mapConfig) overwriteConfig($scope.mapConfig, config);

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
 								nodeClicked: function(vkNode, dom, commingFromAngular) {
 									if (vkNode) kMapClientInterface.nodeSelected(vkNode, dom, commingFromAngular);
 									else kMapClientInterface.nodeUnselected(vkNode, dom, commingFromAngular);
 								},
 								/**
 								 * Reacts to clicking media content inside the node
 								 * @function nodeMediaClicked
 								 * @name kMapClientInterface#nodeMediaClicked
 								 * @param  {knalledge.VKNode} vkNode - clicked node
 								 */
 								nodeMediaClicked: function(vkNode) {
 									if (vkNode) {
 										GlobalEmitterServicesArray.get(nodeMediaClickedEvent).broadcast('knalledgeMap', vkNode);
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
 								nodeSelected: function(vkNode, dom, selectionSource, commingFromAngular) {
 									if (selectionSource === knalledge.Map.INTERNAL_SOURCE && !KnalledgeMapPolicyService.mustFollowPresenter()) {
 										KnalledgeMapPolicyService.provider.config.broadcasting.receiveNavigation = false;
 									}

 									var processNodeSelected = function() {
 										// Referencing DOM nodes in Angular expressions is disallowed!
 										dom = null;

 										// here we call a parent directive listener interested
 										// in clicking the node
 										// This is mostly used in the case when top directive provides map data and listens for response from the this (knalledgeMap) directive
 										$scope.nodeSelected({
 											"vkNode": vkNode,
 											"dom": dom
 										});
 										var property = undefined;
 										var propertyType = undefined;

 										// get property and broadcast it
 										// at the moment `knalledgeMapList` directive listens for this event
 										// and presents the property inside the editor
 										if (vkNode) {
 											if ($routeParams.node_id !== vkNode.kNode._id) {
 												$routeParams.node_id = vkNode.kNode._id;
 												$route.updateParams($routeParams);
 											}
 											// http://www.historyrundown.com/did-galileo-really-say-and-yet-it-moves/
 											if (vkNode.kNode.dataContent){
 												property = vkNode.kNode.dataContent.property;
 												propertyType = vkNode.kNode.dataContent.propertyType;
 											}
 											console.log("[knalledgeMap::kMapClientInterface::nodeClicked'] vkNode[%s](%s): property: %s", vkNode.id, vkNode.kNode._id, property);
 										} else {
 											console.log("[knalledgeMap::kMapClientInterface::nodeClicked'] node is not provided. property: %s", property);
 										}

 										var nodeContent = {
 											node: vkNode,
 											property: property,
 											propertyType: propertyType
 										};

 										GlobalEmitterServicesArray.get(changeKnalledgePropertyEvent).broadcast('knalledgeMap', nodeContent);
 										GlobalEmitterServicesArray.get(selectedNodeChangedEvent).broadcast('knalledgeMap', vkNode);
 									}

 									if (commingFromAngular) processNodeSelected();
 									else {
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
 								nodeUnselected: function(vkNode, dom, selectionSource, commingFromAngular) {
 									var processNodeUnselected = function() {
 										// Referencing DOM nodes in Angular expressions is disallowed!
 										dom = null;

 										// here we call a parent directive listener interested
 										// in clicking the node
 										// This is mostly used in the case when top directive provides map data and listens for response from the this (knalledgeMap) directive
 										$scope.nodeSelected({
 											"vkNode": null,
 											"dom": dom
 										});
 										var property = "";

 										// get property and broadcast it
 										// at the moment `knalledgeMapList` directive listens for this event
 										// and presents the property inside the editor
 										var nodeContent = {
 											node: null,
 											property: undefined,
 											propertyType: undefined
 										};

 										GlobalEmitterServicesArray.get(changeKnalledgePropertyEvent).broadcast('knalledgeMap', nodeContent);
 									}

 									if (commingFromAngular) processNodeUnselected();
 									else {
 										$scope.$apply(processNodeUnselected);
 									}
 								},
 								searchNodeByName: function() {
 									$scope.$apply(function() {
 										var labels = {
 											itemName: "Node",
 											itemNames: "Nodes"
 										};

 										var itemType = "vkNode";

 										var selectionOfItemFinished = function(item) {
 											var vkNode = item;
 											if (itemType == 'kNode') {
 												$scope.knalledgeMap.mapStructure.getVKNodeByKId(item._id);
 											}
 											$scope.knalledgeMap.nodeSelected(vkNode);
 										};

 										// var items = KnalledgeMapVOsService.getNodesList();
 										var items = $scope.knalledgeMap.mapStructure.getNodesList();

 										KnAllEdgeSelectItemService.openSelectItem(items, labels, selectionOfItemFinished, itemType);
 									});
 								},

 								toggleModerator: function() {
 									$scope.$apply(function() {
 										KnalledgeMapPolicyService.provider.config.moderating.enabled = !KnalledgeMapPolicyService.provider.config.moderating.enabled;
 										if (KnalledgeMapPolicyService.provider.config.moderating.enabled){
 											if(window.confirm('Do you want to create a new session?')) {
 												//TODO: this code is probably temporary, so even registration is put here:
 												var SETUP_SESSION_REQUEST_EVENT = "SETUP_SESSION_REQUEST_EVENT";
 												GlobalEmitterServicesArray.register(SETUP_SESSION_REQUEST_EVENT);
 												GlobalEmitterServicesArray.get(SETUP_SESSION_REQUEST_EVENT).broadcast('KnalledgeMap');
 											}
 										}else{
 											RimaService.setActiveUser(RimaService.getWhoAmI());
 										}
 									});
 								},

 								togglePresenter: function() {
 									$scope.$apply(function() {
 						        GlobalEmitterServicesArray.get(PRESENTER_CHANGED)
 						        .broadcast('KnalledgeMapMain', {'user': RimaService.getWhoAmIid(), 'value': !KnalledgeMapPolicyService.provider.config.broadcasting.enabled});
 									});
 								},

 								mapEntityClicked: function(mapEntity /*, mapEntityDom*/ ) {
 									$scope.$apply(function() {
 										//var mapEntityClicked = mapEntity;
 										GlobalEmitterServicesArray.get(mapEntitySelectedEvent).broadcast('knalledgeMap', mapEntity);
 									});
 								},
 								addImage: function(vkNode, callback) {
 									$scope.$apply(function() {
 										if (vkNode) {
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

 											directiveScope.addedImage = function(image) {
 												console.log("Adding image");
 												if (!vkNode.kNode.dataContent) {
 													vkNode.kNode.dataContent = {};
 												}
 												// http://localhost:8888/knodes/one/5526855ac4f4db29446bd183.json
 												vkNode.kNode.dataContent.image = {
 													url: image.url,
 													width: image.width,
 													height: image.height
 												};
 												var updated = function(kNodeFromServer) {
 													console.log("[knalledgeMap::kMapClientInterface::addImage::addedImage::updated'] updateKNode: " + kNodeFromServer);
 													if (callback) {
 														callback(vkNode);
 													}
 													$scope.knalledgeMap.update(vkNode);
 												};
 												KnalledgeMapVOsService.updateNode(vkNode.kNode, knalledge.KNode.UPDATE_TYPE_IMAGE).$promise
 													.then(updated);
 											}.bind(this);

 										}
 									});
 								}
 							};


 							// loading component plugins
 							// plugins that we care for inside the directive
 							var pluginsOfInterest = {
 								mapVisualizePlugins: true,
 								mapVisualizeHaloPlugins: true,
 								mapInteractionPlugins: true,
 								keboardPlugins: true
 							};
 							var PluginsPreloader = injector.get("puzzles.collaboPlugins.PluginsPreloader");
 							/**
 				       * Plugins that are provided to the knalledge.Map
 				       * @type {Object}
 				       */
 							var mapPlugins = {};
 							// populate in all plugins of interest
 							PluginsPreloader.populateInPluginsOfInterest(
 								pluginsOfInterest, $injector, injector, mapPlugins);


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

 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeNodeCreatedEvent).subscribe('knalledgeMap', $scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));
 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeNodeUpdatedEvent).subscribe('knalledgeMap', $scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));
 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeNodeDeletedEvent).subscribe('knalledgeMap', $scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));

 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeEdgeCreatedEvent).subscribe('knalledgeMap', $scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));
 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeEdgeUpdatedEvent).subscribe('knalledgeMap', $scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));
 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(KnRealTimeEdgeDeletedEvent).subscribe('knalledgeMap', $scope.knalledgeMap.processExternalChangesInMap.bind($scope.knalledgeMap)));
 						};

 						/**
 						 * This is necessary since ng2 injects some object into $scope.mapData
 						 * even if parent directive do not provide any mapData
 						 * Returns true if data exist and are healthy (structurarly) map data
 						 * @function checkData
 						 * @param  {knalledge.knalledgeMap.knalledgeMapServices.MapData} data - map data
 						 * @return {boolean}
 						 */
 						var checkData = function(data) {
 							if (!data) return false;
 							if (!('map' in data)) {
 								console.warn("[directive:knalledgeMap:checkData] strange data: ", data);
 								return false;
 							};
 							return true;
 						}

 						var setData = function(data) {
 							if (!checkData(data)) return;
 							var selectedKNodeId = null;
 							if ($routeParams.node_id) selectedKNodeId = $routeParams.node_id;
 							if ($scope.mapData && $scope.mapData.selectedNode) {
 								selectedKNodeId = $scope.mapData.selectedNode._id;
 							}

 							$scope.knalledgeMap.processData(data, selectedKNodeId, function() {
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

 						$timeout(function() {
 							delayedFunc();
 						}, 500);

 						/**
 						 * Loads map with specific map id
 						 * @param  {string} mapId the id of the map to be loaded
 						 */
 						var loadMapWithId = function(mapId) {
 							/**
 							 * Callback after loading map object from the KnalledgeMapService
 							 * @param  {knalledge.KMap} map - map object
 							 */
 							var gotMap = function(kMap) {
 								console.log('gotMap:' + JSON.stringify(kMap));
 								console.log('KnalledgeMapService.map:', KnalledgeMapService.map);
 								// this method broadcasts the 'modelLoadedEvent' event after loading and processing kMap
 								// this event is subscribed bellow for
 								KnalledgeMapVOsService.loadAndProcessData(kMap, function() {
 									if ($scope.route) {
 										// alert("redirecting to: " + $scope.route);
 										if ($scope.route.indexOf("http") < 0) {
 											$location.path($scope.route);
 										} else {
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

 						var delayedFunc = function() {
 							init();
 							if (checkData($scope.mapData)) {
 								// console.warn('have $scope.mapData:' + JSON.stringify($scope.mapData));
 								setData($scope.mapData);
 							} else {
 								loadMapWithId($routeParams.id);
 							}

 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(modelLoadedEvent).subscribe('knalledgeMap', function(eventModel) {
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

 							$scope.$watch(function() {
 									return $scope.mapData;
 								},
 								function(newValue) {
 									//alert("RimaService.howAmIs changed: " + JSON.stringify(newValue));
 									if (newValue) setData(newValue);
 								}, true);

 							function knalledgePropertyCallback(nodeContentChanged, isFinal){
 								// 	var vkNode = $scope.knalledgeMap.mapStructure.getSelectedNode();
								var vkNode = nodeContentChanged.node;

 								var knalledgePropertyBefore = undefined;
 								var knalledgeProperty = nodeContentChanged.property;
 								var knalledgePropertyTypeBefore = undefined;
 								var knalledgePropertyType = nodeContentChanged.propertyType;
 								if (vkNode) {
 									console.log("[knalledgeMap.controller::$on:%s] vkNode[%s](%s): (old knalledgeProperty: %s), knalledgeProperty: %s", knalledgePropertyChangedEvent, vkNode.id, vkNode.kNode._id,
 										(vkNode.kNode.dataContent ? vkNode.kNode.dataContent.property : null),
 										knalledgeProperty);

 									if (!vkNode.kNode.dataContent) vkNode.kNode.dataContent = {};
 									if (vkNode.kNode.dataContent.property) knalledgePropertyBefore = vkNode.kNode.dataContent.property;
 									if (vkNode.kNode.dataContent.propertyType) knalledgePropertyTypeBefore = vkNode.kNode.dataContent.propertyType;

 									var updateType = knalledge.MapStructure.UPDATE_DATA_CONTENT;
 									if(!isFinal){
 										if (knalledgePropertyBefore === knalledgeProperty && knalledgeProperty === knalledgePropertyTypeBefore) return;
 										if (!knalledgePropertyBefore && !knalledgeProperty) return;
 									}else{
 										updateType = knalledge.MapStructure.UPDATE_DATA_CONTENT_FINAL;
 									}

 									vkNode.kNode.dataContent.property = knalledgeProperty;
 									vkNode.kNode.dataContent.propertyType = knalledgePropertyType;

 									$scope.knalledgeMap.mapStructure.updateNode(vkNode, updateType);
 								} else {
 									console.log("[knalledgeMap.controller::$on:%s] node not selected. knalledgeProperty: %s", knalledgePropertyChangedEvent, knalledgeProperty, knalledgePropertyType);
 								}
 							}

 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(knalledgePropertyChangedEvent).subscribe('knalledgeMap', function(nodeContentChanged) {
 								knalledgePropertyCallback(nodeContentChanged, false);
 							}));

 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(knalledgePropertyChangedFinishedEvent).subscribe('knalledgeMap', function(nodeContentChanged) {
 								knalledgePropertyCallback(nodeContentChanged, true);
 							}));

 							var viewConfigChanged = function(msg) {
 								//setData(model);
 								console.log("[knalledgeMap.controller::$on] event: %s", viewConfigChangedEvent);
 								if (msg.path == 'config.visualization.viewspec') {
 									config.tree.viewspec = msg.value;
 									KnalledgeMapViewService.provider.config.tree.viewspec = msg.value;
 								}
 								if (msg.path == 'config.edges.orderBy') {
 									config.edges.orderBy = msg.value;
 									KnalledgeMapViewService.provider.config.edges.orderBy = msg.value;
 								}
 								toolsChange(KnRealTimeviewConfigChangedEvent, msg);
 							};

 							function knalledgeMapUpdate() {
 								$scope.knalledgeMap.update();
 							}

 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(knalledgeMapUpdateEvent).subscribe('knalledgeMap', knalledgeMapUpdate));

 							var viewConfigChangedEvent = "viewConfigChangedEvent";
 							GlobalEmitterServicesArray.register(viewConfigChangedEvent);
 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(viewConfigChangedEvent).subscribe('knalledgeMap', viewConfigChanged));

 							var toolsChange = function(eventName, msg) {
 								$scope.knalledgeMap.update();
 								// realtime distribution
 								if (KnAllEdgeRealTimeService) {
 									KnAllEdgeRealTimeService.emit(eventName, msg);
 								}
 							};

 							var behaviourChanged = function(msg) {
 								//setData(model);
 								console.log("[knalledgeMap.controller::$on] event: %s", behaviourChangedEvent);
 								toolsChange(KnRealTimeBehaviourChangedEvent, msg);
 								updateState(msg.value);
 							};
 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(behaviourChangedEvent).subscribe('knalledgeMap', behaviourChanged));

 							var realTimeBehaviourChanged = function(eventName, msg) {
 								console.log('realTimeBehaviourChanged:', eventName, 'msg:', msg);

 								switch (msg.path) {
 									// case 'policyConfig.behaviour.brainstorming':
 									// 	KnalledgeMapPolicyService.provider.config.behaviour.brainstorming = msg.value;
 									// 	break;
 								}
 								updateState(msg.value);
 								$scope.knalledgeMap.update();
 							}

 							var updateState = function(value) {
 								if (value === 0) {
 									KnalledgeMapPolicyService.provider.config.state = {
 										id: 0,
 										name: ''
 									};
 								} else {
 									KnalledgeMapPolicyService.provider.config.state = {
 										id: value,
 										name: 'Brainstorming (' + value + ')'
 									};
 								}
 							}


 							// realtime listener registration
 							if (KnAllEdgeRealTimeService) {
 								/**
 								 * registered to event `KnRealTimeviewConfigChangedEvent`, to be called by `KnAllEdgeRealTimeService` from `mapStructure.service `
 								 * @param  {string} eventName [description]
 								 * @param  {Object} msg       [description]
 								 * @return {[type]}           [description]
 								 */
 								var realTimeviewConfigChanged = function(eventName, msg) {

 									//TODO: this should not be treated as viewConfig change but as other type
 									if (msg.path == 'policyConfig.broadcasting.enabled' && msg.value) { // Highlander: There can be only one!
 										KnalledgeMapPolicyService.provider.config.broadcasting.enabled = false;
 									}

 									if (!KnalledgeMapPolicyService.provider.config.broadcasting.receiveVisualization) {
 										return;
 									}
 									switch (msg.path) {
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
 											KnalledgeMapViewService.provider.config.visualization.viewspec = config.visualization.viewspec = msg.value;
 											break;
 										case 'config.edges.orderBy':
 											KnalledgeMapViewService.provider.config.edges.orderBy = config.edges.orderBy = msg.value;
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
 									events: {}
 								};

 								mapViewPluginOptions.events[KnRealTimeBroadcastUpdateMaps] = $scope.knalledgeMap.update.bind(knalledgeMap);

 								mapViewPluginOptions.events[KnRealTimeBroadcastReloadMaps] = loadMapWithId.bind(null, $routeParams.id);

 								mapViewPluginOptions.events[KnRealTimeviewConfigChangedEvent] = realTimeviewConfigChanged.bind(this);

 								mapViewPluginOptions.events[KnRealTimeBehaviourChangedEvent] = realTimeBehaviourChanged.bind(this);

 								KnAllEdgeRealTimeService.registerPlugin(mapViewPluginOptions);
 							}

 							var broadcastingChangedEvent = "broadcastingChangedEvent"
 								// $scope.subscriptions.push(GlobalEmitterServicesArray.get(broadcastingChangedEvent).subscribe('knalledgeMap', function() {
 								// 	console.log("[knalledgeMap.controller::$on] event: %s", broadcastingChangedEvent);
 								// 	// $scope.knalledgeMap.syncingChanged(); NOT USED ANY MORE
 								// }));

 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(changeKnalledgeRimaEvent).subscribe('knalledgeMap',
 								function(msg) {
 									console.log("[knalledgeMap.controller::$on] event: %s", changeKnalledgeRimaEvent);
 									//msg is of type: {actionType:'what_deleted',node:$scope.node,what:whatId}
 									$scope.knalledgeMap.mapStructure.nodeWhatsManagement(msg);
 									$scope.knalledgeMap.update();
 								}));

 							$scope.subscriptions.push(GlobalEmitterServicesArray.get(changeSelectedNodeEvent).subscribe('knalledgeMap', function(vkNode) {
 								console.log("[knalledgeMap.controller::$on] event: %s", changeSelectedNodeEvent);
 								$scope.knalledgeMap.nodeSelected(vkNode);
 							}));

 							if (RimaService) {
 								$scope.$watch(function() {
 										return RimaService.howAmIs;
 									},
 									function(newValue) {
 										//alert("RimaService.howAmIs changed: " + JSON.stringify(newValue));
 										if (knalledgeMap) $scope.knalledgeMap.update();
 									}, true);
 							}
 						};
 					}
 				};
 			}
 		])


   }()); // end of 'use strict';
