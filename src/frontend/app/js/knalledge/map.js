(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var Map =  knalledge.Map = function(parentDom, config, clientApi, entityStyles, mapService){
	this.config = config;
	this.clientApi = clientApi;
	this.entityStyles = entityStyles;
	this.parentDom = parentDom;
	this.mapService = mapService;

	this.state = new knalledge.State();
	this.mapStructure = new knalledge.MapStructure();
	this.mapVisualization = new knalledge.MapVisualization(this.parentDom, this.mapStructure, this.config.transitions, this.config.nodes, this.config.edges);
	var mapLayoutApi = {
		update: this.mapVisualization.update.bind(this.mapVisualization),
		getDom: this.mapVisualization.getDom.bind(this.mapVisualization)
	};
	this.mapLayout = new knalledge.MapLayout(this.mapStructure, this.config.nodes, this.config.tree, mapLayoutApi, this.state);

	this.keyboardInteraction = null;

};

Map.prototype.init = function() {
	this.mapStructure.init(this.mapService);
	// http://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element
	var mapSize = [this.parentDom.node().getBoundingClientRect().height, this.parentDom.node().getBoundingClientRect().width];
	// inverted since tree is rotated to be horizontal
	// related posts
	//	http://stackoverflow.com/questions/17847131/generate-multilevel-flare-json-data-format-from-flat-json
	//	http://stackoverflow.com/questions/20940854/how-to-load-data-from-an-internal-json-array-rather-than-from-an-external-resour
	this.mapVisualization.init(this.mapLayout);
	this.mapLayout.init(mapSize);
	this.initializeKeyboard();
	this.initializeManipulation();
};

Map.prototype.update = function(node) {
	this.mapVisualization.update(node);
};

Map.prototype.processData = function(mapData) {
	this.mapStructure.processData(mapData, 0, this.parentDom.attr("height") / 2);
	this.mapLayout.processData();
};

Map.prototype.initializeKeyboard = function() {
	// var that = this;

	var keyboardClientInterface = {
		updateNode: this.mapStructure.updateNode.bind(this.mapStructure),
		getDomFromDatum: this.mapLayout.getDomFromDatum.bind(this.mapLayout),
		clickNode: this.mapLayout.clickNode.bind(this.mapLayout),
		update: this.mapVisualization.update.bind(this.mapVisualization),
		createNode: this.mapStructure.createNode.bind(this.mapStructure),
		createEdge: this.mapStructure.createEdge.bind(this.mapStructure),
		knalledgeState: this.state,
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
		}.bind(this)
	};

	this.keyboardInteraction = new interaction.Keyboard(keyboardClientInterface);
	this.keyboardInteraction.init();
};

// http://interactjs.io/
// http://interactjs.io/docs/#interactables
Map.prototype.initializeManipulation = function() {
	var that = this;

	var manipulationEnded = function(targetD3){
		var d = targetD3 ? targetD3.datum() : null;
		//TODO: finish saving after nodes dragging:
		d.visual.xM = d.x;
		d.visual.yM = d.y;
		that.mapStructure.updateNode(d);

		console.log("knalledge_map:manipulationEnded [%s]", d ? d.name : null);
		that.mapVisualization.update(that.mapStructure.rootNode);
		//that.mapVisualization.update(that.model.nodes[0]);
	};

	this.draggingConfig = {
		draggTargetElement: true,
		target: {
			refCategory: '.draggable',
			opacity:  0.5,
			zIndex: 10,
			cloningContainer: that.mapVisualization.dom.divMapHtml.node(), // getting native dom element from D3 selector
			leaveAtDraggedPosition: false,
			callbacks: {
				onend: manipulationEnded
			}
		},
		debug: {
			origVsClone: false
		}
	};

	interaction.MoveAndDrag.InitializeDragging(this.draggingConfig);
};

}()); // end of 'use strict';