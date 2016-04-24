(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
@classdesc Top class for dealing with visualizing and interacting knalledge maps

@class Map
@memberof knalledge
*/

/**
* @memberof knalledge.knalledgeMap.knalledgeMapDirectives.knalledgeMap#
* @constructor
* @param  {DOM}  parentDom - parent dom where map should be created
* @param  {Object}  config - config object
* @param  {knalledge.knalledgeMap.knalledgeMapDirectives.knalledgeMap.kMapClientInterface}  upperApi
* @param  {Object}  entityStyles - entity styles (not used?)
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService}  mapService
* @param  {knalledge.MapStructure}  [mapStructureExternal=null] - map structure containing map data
* @param  {knalledge.collaboPluginsServices.CollaboPluginsService}  collaboPluginsService
* @param  {rima.rimaServices.RimaService}  rimaService
* @param  {knalledge.knalledgeMap.knalledgeMapServices.IbisTypesService} ibisTypesService
* @param  {knalledge.notify.notifyServices.NotifyService}  notifyService
* @param  {Object}  mapPlugins - set of plugins (with subplugins `mapVisualizePlugins`, etc)
* TODO: This needs to be migrated to plugin space
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapViewService}  knalledgeMapViewService
* @param  {knalledge.knalledgeMap.knalledgeMapServices.SyncingService}  syncingService
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService}  knAllEdgeRealTimeService
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapPolicyService}  knalledgeMapPolicyService
* @param  {utils.Injector}  injector
*/
var Map =  knalledge.Map = function(parentDom, config, upperApi, entityStyles, mapService, mapStructureExternal, collaboPluginsService,
	rimaService, ibisTypesService, notifyService, mapPlugins, knalledgeMapViewService, syncingService, knAllEdgeRealTimeService, knalledgeMapPolicyService, injector){
	this.config = config;
	this.upperApi = upperApi;
	this.entityStyles = entityStyles;
	this.parentDom = parentDom;
	this.mapService = mapService;
	this.scales = null;
	this.mapSize = null;
	this.mapStructureExternal = mapStructureExternal;
	this.collaboPluginsService = collaboPluginsService;
	this.rimaService = rimaService;
	this.ibisTypesService = ibisTypesService;
	this.notifyService = notifyService;
	this.knalledgeMapViewService = knalledgeMapViewService;
	this.mapPlugins = mapPlugins;
	this.syncingService = syncingService;
	this.knAllEdgeRealTimeService = knAllEdgeRealTimeService;
	this.injector = injector;

	this.knalledgeState = new knalledge.State();
	this.mapStructure = this.mapStructureExternal ? this.mapStructureExternal : new knalledge.MapStructure(rimaService, knalledgeMapViewService, knalledgeMapPolicyService);

	this.mapManagerApi = {};
	this.mapManagerApi.nodeSelected	= this.nodeSelected.bind(this);
	this.mapManagerApi.nodeUnselected = this.nodeUnselected.bind(this);
	this.mapManagerApi.nodeClicked = this.nodeClicked.bind(this);
	this.mapManagerApi.nodeDblClicked = this.nodeDblClicked.bind(this);
	this.mapManagerApi.edgeClicked	= this.edgeClicked.bind(this);

	this.mapManager = new knalledge.MapManager(this.mapManagerApi, this.parentDom, this.mapStructure, this.collaboPluginsService, this.config.transitions, this.config.tree, this.config.nodes, this.config.edges, rimaService, this.knalledgeState, this.notifyService, mapPlugins, this.knalledgeMapViewService, this.knAllEdgeRealTimeService, this.injector);

	this.mapVisualization = this.mapManager.getActiveVisualization();
	this.mapLayout = this.mapManager.getActiveLayout();

	var mapInterface = {
		updateNode: this.mapStructure.updateNode.bind(this.mapStructure),
		getDomFromDatum: this.mapVisualization.getDomFromDatum.bind(this.mapVisualization),
		getCoordinatesFromDatum: this.mapVisualization.getCoordinatesFromDatum.bind(this.mapVisualization),
		nodeSelected: this.nodeSelected.bind(this),
		update: this.mapVisualization.update.bind(this.mapVisualization),
		createNode: this.mapStructure.createNode.bind(this.mapStructure),
		deleteNode: this.mapStructure.deleteNode.bind(this.mapStructure),
		createEdgeBetweenNodes: this.mapStructure.createEdgeBetweenNodes.bind(this.mapStructure),
		expandNode: this.mapStructure.expandNode.bind(this.mapStructure),
		knalledgeState: this.knalledgeState,
		getParentNodes: this.mapStructure.getParentNodes.bind(this.mapStructure),
		getSelectedNode: function(){
			return this.mapStructure.getSelectedNode();
		}.bind(this),
		updateName: function(nodeView){
			this.mapVisualization.updateName(nodeView);
		}.bind(this),
		addImage: function(node){
			this.upperApi.addImage(node);
		}.bind(this),
		searchNodeByName: function(){
			this.upperApi.searchNodeByName();
		}.bind(this),
		toggleModerator: function(){
			this.upperApi.toggleModerator();
		}.bind(this),
		togglePresenter: function(){
			this.upperApi.togglePresenter();
		}.bind(this),
		removeImage: function(){
			var vkNode = this.mapStructure.getSelectedNode();
			this.mapStructure.removeImage(vkNode);
			this.update(vkNode);
		}.bind(this),
		positionToDatum: this.mapVisualization.positionToDatum.bind(this.mapVisualization),
		getActiveIbisType: function(){
			return this.ibisTypesService.getActiveType().type;
		}.bind(this)
	};

	var MapInteraction = this.injector.get("interaction.MapInteraction");
	//this.GlobalEmitterServicesArray = this.injector.get('collaboPlugins.globalEmitterServicesArray');
	this.mapInteraction = new MapInteraction(mapInterface);
	this.mapInteraction.init();
	this.injector.addPath("mapInteraction", this.mapInteraction);

	this.keyboardInteraction = null;
	// this.syncingInterval = 1000;
	// this.syncingTimerId = null;
};

Map.prototype.init = function() {
	//var that = this;
	this.mapSize = [
		this.parentDom.node().getBoundingClientRect().width - this.config.tree.margin.right - this.config.tree.margin.left,
		this.parentDom.node().getBoundingClientRect().height - this.config.tree.margin.bottom - this.config.tree.margin.top
	];

	// we do this only if we created an mapStructure in our class
	if(!this.mapStructureExternal) this.mapStructure.init(this.mapService);
	// http://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element

	// inverted since tree is rotated to be horizontal
	// related posts
	//	http://stackoverflow.com/questions/17847131/generate-multilevel-flare-json-data-format-from-flat-json
	//	http://stackoverflow.com/questions/20940854/how-to-load-data-from-an-internal-json-array-rather-than-from-an-external-resour
	this.mapVisualization.init(this.mapLayout, this.mapSize, this.injector);
	this.scales = this.mapVisualization.scales;
	this.mapLayout.init(this.mapSize, this.scales);
	this.initializeKeyboard();
	this.initializeManipulation();

	// providing references and api to collabo plugins
	this.collaboPluginsService.provideReferences("map", {
		name: "map",
		items: {
			config: this.config,
			mapStructure: this.mapStructure
		}
	});
	this.collaboPluginsService.provideApi("map", {
		name: "map",
		items: {
			/* update(source, callback) */
			update: this.mapVisualization.update.bind(this.mapVisualization)
		}
	});

//this.GlobalEmitterServicesArray.get(BroadcastManagerService.KnRealTimeNodeSelectedEventName).subscribe('knalledgeMap', this.realTimeNodeSelected.bind(this));


	// realtime listener registration
	var NodeChangedPluginOptions = {
		name: "nodeChangedPlugin",
		events: {
		}
	};

	NodeChangedPluginOptions.events[Map.KnRealTimeNodeSelectedEventName] = this.realTimeNodeSelected.bind(this);
	NodeChangedPluginOptions.events[Map.KnRealTimeNodeUnselectedEventName] = this.realTimeNodeUnselected.bind(this);
	NodeChangedPluginOptions.events[Map.KnRealTimeNodeClickedEventName] = this.realTimeNodeClicked.bind(this);
	this.knAllEdgeRealTimeService.registerPlugin(NodeChangedPluginOptions);
};

// realtime distribution
Map.KnRealTimeNodeSelectedEventName = "node-selected";
Map.KnRealTimeNodeUnselectedEventName = "node-unselected";
// NOTE: no good reason to use it, not idempotent neither safe
Map.KnRealTimeNodeClickedEventName = "node-clicked";

Map.prototype.realTimeNodeSelected = function(eventName, msg){
	var kId = msg;
	// alert("[Map:realTimeNodeSelected] (clientId:"+this.knAllEdgeRealTimeService.getClientInfo().clientId+") eventName: "+eventName+", msg: "+JSON.stringify(kId));
	console.log("[Map:realTimeNodeSelected] (clientId:%s) eventName: %s, msg: %s",
	this.knAllEdgeRealTimeService.getClientInfo().clientId, eventName, JSON.stringify(kId));
	//TODO: if(!KnalledgeMapPolicyService.provider.config.broadcasting.receiveNavigation){
	// 	return;
	// }
	var kNode = this.mapStructure.getVKNodeByKId(kId);
	this.nodeSelected_WithoutRTBroadcasting(kNode);
};

Map.prototype.realTimeNodeUnselected = function(eventName, msg){
	var kId = msg;
	console.log("[Map:realTimeNodeUnselected] (clientId:%s) eventName: %s, msg: %s",
	this.knAllEdgeRealTimeService.getClientInfo().clientId, eventName, JSON.stringify(kId));
	var kNode = this.mapStructure.getVKNodeByKId(kId);
	this.nodeUnselected_WithoutRTBroadcasting(kNode);
};

Map.prototype.realTimeNodeClicked = function(eventName, msg){
	var kId = msg;
	console.log("[Map:realTimeNodeClicked] (clientId:%s) eventName: %s, msg: %s",
	this.knAllEdgeRealTimeService.getClientInfo().clientId, eventName, JSON.stringify(kId));
	var kNode = this.mapStructure.getVKNodeByKId(kId);
	this.nodeClicked_WithoutRTBroadcasting(kNode);
};

Map.prototype.nodeSelected = function(vkNode) {
	this.nodeSelected_WithoutRTBroadcasting(vkNode);

	// realtime distribution
	//  && !doNotBroadcast 	// do not broadcast back :)
	if(this.knAllEdgeRealTimeService){
		this.knAllEdgeRealTimeService.emit(knalledge.Map.KnRealTimeNodeSelectedEventName, vkNode.kNode._id);
	}
};

Map.prototype.nodeSelected_WithoutRTBroadcasting = function(vkNode) {
	var that = this;

	if(this.config.tree.selectableEnabled && vkNode.kNode.visual && !vkNode.kNode.visual.selectable){
		return;
	}

	this.mapStructure.setSelectedNode(vkNode);

	// adding additional link between 2 nodes
	// not in use
	if(this.knalledgeState.addingLinkFrom !== null){
		//this is called when we add new parent to the node
		this.mapStructure.createEdgeBetweenNodes(this.knalledgeState.addingLinkFrom, vkNode);
		this.knalledgeState.addingLinkFrom = null;
		//TODO: UPDATE SHOUL BE CALLED IN THE CALLBACK
		//TODO: should we move it into this.mapStructure.createEdge?
		this.update(this.mapStructure.rootNode);
	}

	// changing parent node
	// assuming that there is only one parent
	if(this.knalledgeState.relinkingFrom !== null){ //this is called when we relink this node from old to new parent
		this.mapStructure.relinkNode(this.knalledgeState.relinkingFrom, vkNode, function(result, error){
			that.knalledgeState.relinkingFrom = null;
			if(result){
				vkNode.isOpen = true;
				//TODO: should we move it into this.mapStructure.relinkNode?
				that.update(that.mapStructure.rootNode);
			}
			else{
				switch(error){
					case 'TARGET_EQ_SOURCE':
						window.alert('You tried to relink the node to itself');
					break;
					case 'DISRUPTING_PATH':
						window.alert('You tried disconnect the path by relinking a node to its descendant');
					break;
				}
			}
		});
	}

	this.update(vkNode, function(){
		that.mapVisualization.nodeSelected(vkNode);
	});

	// TODO: add broadcasting for upper layers instead of this:
	this.upperApi.nodeSelected(vkNode, undefined, false);
};

Map.prototype.nodeUnselected = function(vkNode) {
	this.nodeUnselected_WithoutRTBroadcasting(vkNode);

	// realtime distribution
	//  && !doNotBroadcast 	// do not broadcast back :)
	if(this.knAllEdgeRealTimeService){
		this.knAllEdgeRealTimeService.emit(knalledge.Map.KnRealTimeNodeUnselectedEventName, vkNode.kNode._id);
	}
};

Map.prototype.nodeUnselected_WithoutRTBroadcasting = function(vkNode) {
	var that = this;

	this.mapStructure.unsetSelectedNode(vkNode);

	this.update(vkNode, function(){
		that.mapVisualization.nodeUnselected(vkNode);
	});

	// TODO: add broadcasting for upper layers instead of this:
	this.upperApi.nodeUnselected(vkNode, undefined, false);
};

Map.prototype.nodeClicked = function(vkNode) {
	// node is not provided or node is same as previousely clicked node
	if(!vkNode || (this.mapStructure.getSelectedNode() == vkNode)){
		this.nodeUnselected(vkNode);
	}else{
		this.nodeSelected(vkNode);
	}
};

Map.prototype.nodeClicked_WithoutRTBroadcasting = function(vkNode) {
	// node is not provided or node is same as previousely clicked node
	if(!vkNode || (this.mapStructure.getSelectedNode() == vkNode)){
		this.nodeUnselected_WithoutRTBroadcasting(vkNode);
	}else{
		this.nodeSelected_WithoutRTBroadcasting(vkNode);
	}
};

// Toggle children on node double-click
// TODO: Should we broadcast here?
// + this.mapStructure.toggle will broadcast node change anyway (right?)
// + but we still might need to broadcast node-selected or similar?
Map.prototype.nodeDblClicked = function(vkNode) {
	this.mapStructure.toggle(vkNode);
	this.update(vkNode);
};

// react on label click.
Map.prototype.edgeClicked = function(vkEdge) {
	console.log('link clicked:', vkEdge);
};

/**
called by service when any change comes from broadcasting client:
*/
Map.prototype.processExternalChangesInMap = function(changes) {
//Map.prototype.processExternalChangesInMap = function(e, changes) {
	// var syncedDataProcessedAndVisualized = function(){
	// 	this.update(this.mapStructure.getSelectedNode());
	// };
	this.mapStructure.processSyncedData(changes);
	var selectedVKNode = this.mapStructure.getSelectedNode();
	// TODO: @mprinc: @sinisarudan, is this the best solution?
	if(this.knAllEdgeRealTimeService.filterBroadcasting('in', 'node-selected')){
		if(selectedVKNode){
			this.nodeSelected_WithoutRTBroadcasting(selectedVKNode);
		}
	}else{
		this.update(selectedVKNode);
	}
	// this.mapLayout.processSyncedData(syncedDataProcessedAndVisualized.bind(this));
};

// Map.prototype.processSyncedData = function(changes) {
// 	var syncedDataProcessedAndVisualized = function(){
// 		this.update(this.mapStructure.getSelectedNode());
// 		if(this.mapStructure.getSelectedNode()){
// 			var vkNode = this.mapStructure.getVKNodeByKId(this.mapStructure.getSelectedNode()._id);
// 			this.mapLayout.clickNode(vkNode);
// 		}
// 	};
// 	this.mapStructure.processSyncedData(changes);
// 	this.mapLayout.processSyncedData(syncedDataProcessedAndVisualized.bind(this));
// };

/**
 * Updates map visualization
 * It is just a proxy to the `knalledge.MapVisualization.update()` method
 * @param  {knalledge.VKNode} [node=this.mapStructure.rootNode] - node that will be used as a source of animation
 * @param  {Function} callback - called when map visualization finished updating
 * @param  {boolean} [shouldGenerateGraph] [description]
 * @return {knalledge.Map}
 */
Map.prototype.update = function(node, callback, shouldGenerateGraph) {
	if(!node) node = this.mapStructure.rootNode;
	this.mapVisualization.update(node, callback, shouldGenerateGraph);

	return this;
};

/**
 * [function description]
 * @param  {knalledge.knalledgeMap.knalledgeMapServices.MapData}   mapData - map data
 * @param  {string} selectedKNodeId - default selected node id
 * @param  {Function} callback - called after map data are processed
 * @return {knalledge.Map}
 */
Map.prototype.processData = function(mapData, selectedKNodeId, callback) {
	var that = this;

	var selectedVKNode = null;
	if(selectedKNodeId){
		selectedVKNode = this.mapStructure.getVKNodeByKId(selectedKNodeId);
	}else{
		selectedVKNode = this.mapStructure.rootNode;
	}
	// we do this only if we created an mapStructure in our class
	if(!this.mapStructureExternal) this.mapStructure.processData(mapData, selectedKNodeId);
	else{
		// set default selected node
		if(selectedVKNode){
			this.mapStructure.setSelectedNode(selectedVKNode);
		}
	}
	this.mapLayout.processData(0, this.parentDom.attr("height") / 2, function(){
		that.update(null, function(){
			if(selectedVKNode) that.mapVisualization.nodeSelected(selectedVKNode);
			if(typeof callback === 'function') callback();
		});
	});

	//this.syncingChanged();

	return this;
};

// Map.prototype.syncingChanged = function() {
// 	if(this.syncingTimerId){
// 		window.clearInterval(this.syncingTimerId);
// 	}
// 	if(this.knalledgeMapViewService.provider.config.syncing.poolChanges){
// 		this.syncingTimerId = window.setInterval(function(){
// 			this.syncingService.getChangesFromServer(this.processSyncedData.bind(this));
// 		}.bind(this), this.syncingInterval);
// 	}
// };

Map.prototype.initializeKeyboard = function() {
	// var that = this;

	if(!this.config.keyboardInteraction.enabled) return;

	this.keyboardInteraction = new interaction.Keyboard(this.mapInteraction);
	this.keyboardInteraction.init();
};

// http://interactjs.io/
// http://interactjs.io/docs/#interactables
Map.prototype.initializeManipulation = function() {
	var that = this;

	if(!this.config.draggingConfig.enabled) return;

/**
 * called after dragging a node
 * @param  {} targetD3 [description]
 * @return {}          [description]
 */
	var manipulationEnded = function(targetD3){
		var d = targetD3 ? targetD3.datum() : null;
		//TODO: finish saving after nodes dragging:
		// d.xM = d.x;
		// d.yM = d.y;
		that.mapStructure.updateNode(d, knalledge.MapStructure.UPDATE_NODE_DIMENSIONS);

		console.log("knalledge_map:manipulationEnded [%s]", d ? d.kNode.name : null);
		that.mapVisualization.update(that.mapStructure.rootNode);
		//that.mapVisualization.update(that.model.nodes[0]);
	};

	this.draggingConfig = this.config.draggingConfig;
	this.draggingConfig.target.cloningContainer = that.mapVisualization.dom.divMapHtml.node();
	this.draggingConfig.target.callbacks.onend = manipulationEnded;

	interaction.MoveAndDrag.InitializeDragging(this.draggingConfig);
};

}()); // end of 'use strict';
