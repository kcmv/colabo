(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var Map =  knalledge.Map = function(parentDom, config, clientApi, entityStyles, mapService, mapStructureExternal, collaboPluginsService,
	rimaService, ibisTypesService, notifyService, mapPlugins, knalledgeMapViewService, syncingService, knAllEdgeRealTimeService, knalledgeMapPolicyService){
	this.config = config;
	this.clientApi = clientApi;
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

	this.knalledgeState = new knalledge.State();
	this.mapStructure = this.mapStructureExternal ? this.mapStructureExternal : new knalledge.MapStructure(rimaService, knalledgeMapViewService, knalledgeMapPolicyService);

	this.clientApi.selectNode	= this.selectNode.bind(this);
	this.mapManager = new knalledge.MapManager(this.clientApi, this.parentDom, this.mapStructure, this.collaboPluginsService, this.config.transitions, this.config.tree, this.config.nodes, this.config.edges, rimaService, this.knalledgeState, this.notifyService, mapPlugins, this.knalledgeMapViewService, this.knAllEdgeRealTimeService);

	this.mapVisualization = this.mapManager.getActiveVisualization();
	this.mapLayout = this.mapManager.getActiveLayout();

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
	this.mapVisualization.init(this.mapLayout, this.mapSize);
	this.scales = this.mapVisualization.scales;
	this.mapLayout.init(this.mapSize, this.scales);
	this.initializeKeyboard();
	this.initializeManipulation();

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
};


Map.prototype.processExternalChangesInMap = function(e, changes) {
	var syncedDataProcessedAndVisualized = function(){
		this.update(this.mapStructure.getSelectedNode());
		if(this.mapStructure.getSelectedNode()){
			var vkNode = this.mapStructure.getSelectedNode();
			this.mapLayout.clickNode(vkNode);
		}
	};
	this.mapStructure.processSyncedData(changes);
	this.mapLayout.processSyncedData(syncedDataProcessedAndVisualized.bind(this));
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

Map.prototype.update = function(node, shouldGenerateGraph) {
	if(!node) node = this.mapStructure.rootNode;
	this.mapVisualization.update(node, null, shouldGenerateGraph);
};

Map.prototype.processData = function(mapData, callback, commingFromAngular, doNotBubleUp, doNotBroadcast) {
	// we do this only if we created an mapStructure in our class
	if(!this.mapStructureExternal) this.mapStructure.processData(mapData);
	this.mapLayout.processData(0, this.parentDom.attr("height") / 2, callback, commingFromAngular, doNotBubleUp, doNotBroadcast);

	//this.syncingChanged();
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

	var keyboardClientInterface = {
		updateNode: this.mapStructure.updateNode.bind(this.mapStructure),
		getDomFromDatum: this.mapLayout.getDomFromDatum.bind(this.mapLayout),
		clickNode: this.mapLayout.clickNode.bind(this.mapLayout),
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
		selectNode: function(selectedNode){
			this.selectNode(selectedNode);
		}.bind(this),
		updateName: function(nodeView){
			this.mapVisualization.updateName(nodeView);
		}.bind(this),
		addImage: function(node){
			this.clientApi.addImage(node);
		}.bind(this),
		searchNodeByName: function(){
			this.clientApi.searchNodeByName();
		}.bind(this),
		toggleModerator: function(){
			this.clientApi.toggleModerator();
		}.bind(this),
		togglePresenter: function(){
			this.clientApi.togglePresenter();
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

	this.keyboardInteraction = new interaction.Keyboard(keyboardClientInterface);
	this.keyboardInteraction.init();
};

// http://interactjs.io/
// http://interactjs.io/docs/#interactables
Map.prototype.initializeManipulation = function() {
	var that = this;

	if(!this.config.draggingConfig.enabled) return;

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

Map.prototype.selectNode = function(selectedNode){
	this.mapStructure.setSelectedNode(selectedNode);
	this.update();
}

}()); // end of 'use strict';
