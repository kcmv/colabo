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
	this.dom = null;

	this.collaboPluginsService.provideApi("mapLayout", {
		/* distribute() */
		distribute: this.distribute.bind(this)
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

MapLayout.prototype.getAllNodesHtml = function(){
	return this.dom.divMapHtml ? this.dom.divMapHtml.selectAll("div.node_html") : null;
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
		this.mapStructure.setSelectedNode(d);

		// realtime distribution
		if(this.knAllEdgeRealTimeService && !doNotBroadcast){ 	// do not broadcast back :)
			this.knAllEdgeRealTimeService.emit(MapLayout.KnRealTimeNodeSelectedEventName, d.kNode._id);
		}

		this.clientApi.positionToDatum(d);
		if(this.knalledgeState.addingLinkFrom !== null){
			this.mapStructure.createEdgeBetweenNodes(this.knalledgeState.addingLinkFrom, d);
			this.knalledgeState.addingLinkFrom = null;
			this.clientApi.update(this.mapStructure.rootNode); //TODO: should we move it into this.mapStructure.createEdge?
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
MapLayout.prototype.clickLinkLabel = function() {
	// console.log("Label clicked: " + JSON.stringify(d.target.name));

	// just as a click indicator
	if(d3.select(this).style("opacity") < 0.75){
		d3.select(this).style("opacity", 1.0);
	}else{
		d3.select(this).style("opacity", 0.5);
	}
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