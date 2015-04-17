(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var Map =  knalledge.Map = function(parentDom, config, clientApi, entityStyles, structure){
	this.config = config;
	this.clientApi = clientApi;
	this.entityStyles = entityStyles;
	this.parentDom = parentDom;
	this.structure = structure;

	this.state = new knalledge.State();
	this.mapVisualization = new knalledge.MapVisualization(this.parentDom, this.structure, this.config.transitions, this.config.nodes, this.config.edges);
	var viewStructureApi = {
		update: this.mapVisualization.update.bind(this.mapVisualization),
		getDom: this.mapVisualization.getDom.bind(this.mapVisualization)
	};
	this.viewStructure = new knalledge.ViewStructure(this.structure, this.config.nodes, this.config.tree, viewStructureApi, this.state);

	this.keyboardInteraction = null;

};

Map.prototype.init = function() {
	// http://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element
	var mapSize = [this.parentDom.node().getBoundingClientRect().height, this.parentDom.node().getBoundingClientRect().width];
	// inverted since tree is rotated to be horizontal
	// related posts
	//	http://stackoverflow.com/questions/17847131/generate-multilevel-flare-json-data-format-from-flat-json
	//	http://stackoverflow.com/questions/20940854/how-to-load-data-from-an-internal-json-array-rather-than-from-an-external-resour
	this.mapVisualization.init(this.viewStructure);
	this.viewStructure.init(mapSize);
	this.initializeKeyboard();
	this.initializeManipulation();
};

Map.prototype.update = function(node) {
	this.mapVisualization.update(node);
};

Map.prototype.processData = function(treeData) {
	this.structure.processData(treeData, 0, this.parentDom.attr("height") / 2);
	this.viewStructure.processData();
};

Map.prototype.initializeKeyboard = function() {
	// var that = this;

	var keyboardClientInterface = {
		updateNode: this.structure.updateNode.bind(this.structure),
		getDomFromDatum: this.viewStructure.getDomFromDatum.bind(this.viewStructure),
		clickNode: this.viewStructure.clickNode.bind(this.viewStructure),
		update: this.mapVisualization.update.bind(this.mapVisualization),
		createNode: this.clientApi.storage.createNode,
		createEdge: this.clientApi.storage.createEdge,
		knalledgeState: this.state,
		getSelectedNode: function(){
			return this.structure.getSelectedNode();
		}.bind(this),
		setSelectedNode: function(selectedNode){
			this.structure.setSelectedNode(selectedNode);
		}.bind(this),
		addImage: function(node){
			this.clientApi.addImage(node);
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
		/*
		Save:
		d.visual.dimensions.sizes.x = d.x;
		d.visual.dimensions.sizes.y = d.y;
		*/
		d.visual.manualX = d.x;
		d.visual.manualY = d.y;
		that.structure.updateNode(d);

		console.log("knalledge_map:manipulationEnded [%s]", d ? d.name : null);
		that.mapVisualization.update(that.structure.rootNode);
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