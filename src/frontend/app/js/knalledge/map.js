(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var Map =  knalledge.Map = function(parentDom, config, clientApi, entityStyles, mapService){
	this.config = config;
	this.clientApi = clientApi;
	this.entityStyles = entityStyles;
	this.parentDom = parentDom;
	this.mapService = mapService;
	this.scales = null;
	this.mapSize = null;

	this.state = new knalledge.State();
	this.mapStructure = new knalledge.MapStructure();
	this.mapVisualization = new knalledge.MapVisualization(this.parentDom, this.mapStructure, this.config.transitions, this.config.tree, this.config.nodes, this.config.edges);
	var mapLayoutApi = {
		update: this.mapVisualization.update.bind(this.mapVisualization),
		getDom: this.mapVisualization.getDom.bind(this.mapVisualization),
		setDomSize: this.mapVisualization.setDomSize.bind(this.mapVisualization),
		positionToDatum: this.mapVisualization.positionToDatum.bind(this.mapVisualization),
		nodeClicked: this.clientApi.nodeClicked.bind(this.clientApi)
	};
	this.mapLayout = new knalledge.MapLayout(this.mapStructure, this.config.nodes, this.config.tree, mapLayoutApi, this.state);

	this.keyboardInteraction = null;

};

Map.prototype.init = function() {
	this.mapSize = [
		this.parentDom.node().getBoundingClientRect().width - this.config.tree.margin.right - this.config.tree.margin.left,
		this.parentDom.node().getBoundingClientRect().height - this.config.tree.margin.bottom - this.config.tree.margin.top 
	];

	this.mapStructure.init(this.mapService);
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
};

Map.prototype.update = function(node) {
	if(!node) node = this.mapStructure.rootNode;
	this.mapVisualization.update(node);
};

Map.prototype.processData = function(mapData, callback) {
	this.mapStructure.processData(mapData, 0, this.parentDom.attr("height") / 2);
	this.mapLayout.processData(callback);
};

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
		knalledgeState: this.state,
		getParentNodes: this.mapStructure.getParentNodes.bind(this.mapStructure),
		getSelectedNode: function(){
			return this.mapStructure.getSelectedNode();
		}.bind(this),
		setSelectedNode: function(selectedNode){
			this.mapStructure.setSelectedNode(selectedNode);
		}.bind(this),
		updateName: function(nodeView){
			this.mapVisualization.updateName(nodeView);
		}.bind(this),
		addImage: function(node){
			this.clientApi.addImage(node);
		}.bind(this),
		removeImage: function(){
			var vkNode = this.mapStructure.getSelectedNode();
			this.mapStructure.removeImage(vkNode);
		}.bind(this),
		positionToDatum: this.mapVisualization.positionToDatum.bind(this.mapVisualization)
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

}()); // end of 'use strict';