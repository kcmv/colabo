(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapLayout =  knalledge.MapLayout = function(){
}

MapLayout.prototype.construct = function(mapStructure, collaboPluginsService, configNodes, configTree, clientApi, knalledgeState, knAllEdgeRealTimeService){
	this.mapStructure = mapStructure;
	this.collaboPluginsService = collaboPluginsService;
	this.configNodes = configNodes;
	this.configTree = configTree;
	this.clientApi = clientApi;
	this.knalledgeState = knalledgeState;
	this.knAllEdgeRealTimeService = knAllEdgeRealTimeService;
	this.nodes = null;
	this.links = null;
	this.nodeWeightSumMin = 0;
	this.nodeWeightSumMax = 0;
	this.nodesToAvoid = [];

	this.dom = null;

	this.collaboPluginsService.provideApi("mapLayout", {
		name: "mapLayout",
		items: {
			/* distribute() */
			distribute: this.distribute.bind(this),
			/* filterGraph(options) */
			filterGraph: this.filterGraph.bind(this),
			/* getNodes() */
			getNodes: this.getNodes.bind(this),
			/* getLinks() */
			getLinks: this.getLinks.bind(this),
			/* calculateNodeWeights() */
			calculateNodeWeights: this.calculateNodeWeights.bind(this),
			/* updateNodeSizes() */
			updateNodeSizes: this.updateNodeSizes.bind(this),
			// updateNodesToAvoid(nodesToAvoid)
			updateNodesToAvoid: this.updateNodesToAvoid.bind(this)
		}
	});
};

// realtime distribution
MapLayout.KnRealTimeNodeSelectedEventName = "node-selected";

MapLayout.prototype.realTimeNodeSelected = function(eventName, msg){
	var kId = msg;
	// alert("[MapLayout:realTimeNodeSelected] (clientId:"+this.knAllEdgeRealTimeService.getClientInfo().clientId+") eventName: "+eventName+", msg: "+JSON.stringify(kId));
	console.log("[MapLayout:realTimeNodeSelected] (clientId:%s) eventName: %s, msg: %s",
		this.knAllEdgeRealTimeService.getClientInfo().clientId, eventName, JSON.stringify(kId));
	var kNode = this.mapStructure.getVKNodeByKId(kId);
	// do not broadcast back :)
	this.clickNode(kNode, null, true, false, true);
};

MapLayout.prototype.getNodes = function(){
	return this.nodes;
};

MapLayout.prototype.getLinks = function(){
	return this.links;
};

MapLayout.prototype.calculateNodeWeights = function(){
};

MapLayout.prototype.updateNodeSizes = function(){
};

MapLayout.prototype.updateNodesToAvoid = function(nodesToAvoidNonParsed){
	this.nodesToAvoid.length = 0;

	for(var i=0; i<nodesToAvoidNonParsed.length; i++){
		var nodeIdName = nodesToAvoidNonParsed[i];
		var kNodeId = nodeIdName;
		if(kNodeId.indexOf(":") >= 0) kNodeId = kNodeId.substring(0, kNodeId.indexOf(":"));
		var vkNode = this.mapStructure.getVKNodeByKId(parseInt(kNodeId));
		this.nodesToAvoid.push(vkNode);
	}
};

MapLayout.prototype.getAllNodesHtml = function(){
	var result = this.dom.divMapHtml ? this.dom.divMapHtml.selectAll("div.node_html") : null;
	return result;
};

// Returns view representation (dom) from datum d
MapLayout.prototype.getDomFromDatum = function(d) {
	var htmlNodes = this.getAllNodesHtml();
	if(!htmlNodes) return null;
	var dom = htmlNodes
		.data([d], function(d){return d.id;});
	if(dom.size() != 1) return null;
	else return dom;
};

MapLayout.prototype.processData = function(rootNodeX, rootNodeY, callback, commingFromAngular, doNotBubleUp, doNotBroadcast) {
	if(typeof rootNodeX !== 'undefined' && typeof rootNodeX !== 'function' &&
		typeof rootNodeY !== 'undefined' && typeof rootNodeY !== 'function'){
		if(this.mapStructure.rootNode){
			this.mapStructure.rootNode.x0 = rootNodeX;
			this.mapStructure.rootNode.y0 = rootNodeY;
		}
	}
	if(this.mapStructure.rootNode){
		this.clickNode(this.mapStructure.rootNode, null, commingFromAngular, doNotBubleUp, doNotBroadcast);
	}
	this.clientApi.update(this.mapStructure.rootNode,
		(typeof callback === 'function') ? callback : undefined);
};

MapLayout.prototype.filterGraph = function(options){
	switch(options.type){
	case "seeWholeGraph":
		this.nodes = this.mapStructure.getNodesList(); //nodesById;
		this.links = this.mapStructure.getEdgesList(); //edgesById;
		break;
	case "cleanOutAvoidedNodesAndLinks":
		for(var i=this.nodes.length-1; i>=0; i--){
			var node = this.nodes[i];
			var index = this.nodesToAvoid.indexOf(node);
			if(index>=0) this.nodes.splice(i, 1);
		}
		for(i=this.links.length-1; i>=0; i--){
			var link = this.links[i];
			var index1 = this.nodesToAvoid.indexOf(link.source);
			var index2 = this.nodesToAvoid.indexOf(link.target);
			if(index1>=0 || index2>=0) this.links.splice(i, 1);
		}
		break;
	}
};

MapLayout.prototype.distribute = function() {
};

MapLayout.prototype.processSyncedData = function(callback) {
	this.clickNode(this.mapStructure.getSelectedNode(), null, true);
	this.clientApi.update(this.mapStructure.getSelectedNode(),
		(typeof callback === 'function') ? callback : undefined);
};

MapLayout.prototype.viewspecChanged = function(target){
	if (target.value === "viewspec_tree") this.configTree.viewspec = "viewspec_tree";
	else if (target.value === "viewspec_manual") this.configTree.viewspec = "viewspec_manual";
	this.clientApi.update(this.mapStructure.rootNode);
};


// Select node on node click
MapLayout.prototype.clickNode = function(d, dom, commingFromAngular, doNotBubleUp, doNotBroadcast) {
	if(!this.nodes) return;

	// select clicked
	var isSelected = d.isSelected; //nodes previous state
	if(this.configTree.selectableEnabled && d.kNode.visual && !d.kNode.visual.selectable){
		return;
	}
	var nodesHtmlSelected = this.getDomFromDatum(d);

	// unselect all nodes
	var nodesHtml = this.getAllNodesHtml();
	if(nodesHtml){
		nodesHtml.classed({
			"node_selected": false,
			"node_unselected": true
		});
	}
	this.nodes.forEach(function(d){d.isSelected = false;});

	if(isSelected){//it was selected, and with this click it becomes unselected:
		d.isSelected = false;
		this.mapStructure.unsetSelectedNode();
	}else{//it was unselected, and with this click it becomes selected:
		// var nodeHtml = nodesHtml[0];
		if(nodesHtmlSelected){
			nodesHtmlSelected.classed({
				"node_selected": true,
				"node_unselected": false
			});
		}
		d.isSelected = true;
		// this.mapStructure.setSelectedNode(d);
		this.clientApi.selectNode(d);

		// realtime distribution
		if(this.knAllEdgeRealTimeService && !doNotBroadcast){ 	// do not broadcast back :)
			this.knAllEdgeRealTimeService.emit(MapLayout.KnRealTimeNodeSelectedEventName, d.kNode._id);
		}

		this.clientApi.positionToDatum(d);

		if(this.knalledgeState.addingLinkFrom !== null){
			this.mapStructure.createEdgeBetweenNodes(this.knalledgeState.addingLinkFrom, d);
			this.knalledgeState.addingLinkFrom = null;
			//TODO: UPDATE SHOUL BE CALLED IN THE CALLBACK
			this.clientApi.update(this.mapStructure.rootNode); //TODO: should we move it into this.mapStructure.createEdge?
		}

		if(this.knalledgeState.relinkingFrom !== null){
			var that = this;
			this.mapStructure.relinkNode(this.knalledgeState.relinkingFrom, d, function(result, error){
				that.knalledgeState.relinkingFrom = null;
				d.isOpen = true;
				that.clientApi.update(that.mapStructure.rootNode); //TODO: should we move it into this.mapStructure.relinkNode?
			}
			);
		}
	}
	if(!doNotBubleUp) this.clientApi.nodeClicked(this.mapStructure.getSelectedNode(), dom, commingFromAngular);
	//this.clientApi.update(this.mapStructure.rootNode);
};

// Toggle children on node double-click
MapLayout.prototype.clickDoubleNode = function(d) {
	this.mapStructure.toggle(d);
	this.clientApi.update(d);
};

// react on label click.
MapLayout.prototype.clickLinkLabel = function(d) {
	// console.log("Label clicked: " + JSON.stringify(d.target.name));

	// just as a click indicator
	console.log('link clicked:'+d);

	// TODO: This code causes error:
	//if(d3.select(this).style("opacity") < 0.75){
	// 	d3.select(this).style("opacity", 1.0);
	// }else{
	// 	d3.select(this).style("opacity", 0.5);
	// }

};

MapLayout.prototype.getHtmlNodePosition = function(d) {
	var x = null;
	if(this.configNodes.html.show){
		x = d.x - d.height/2;
	}else{
		x = d.x;
	}

	if (isNaN(x) || x === null){
		x = d.x;
	}
	return x;
};

}()); // end of 'use strict';
