(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
@classdesc Deals with layout of the KnAllEdge map
@class MapLayout
@memberof knalledge
*/

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
// TODO: distinguish click, select, unselect events
MapLayout.KnRealTimeNodeSelectedEventName = "node-selected";

MapLayout.prototype.realTimeNodeSelected = function(eventName, msg){
	var kId = msg;
	// alert("[MapLayout:realTimeNodeSelected] (clientId:"+this.knAllEdgeRealTimeService.getClientInfo().clientId+") eventName: "+eventName+", msg: "+JSON.stringify(kId));
	console.log("[MapLayout:realTimeNodeSelected] (clientId:%s) eventName: %s, msg: %s",
		this.knAllEdgeRealTimeService.getClientInfo().clientId, eventName, JSON.stringify(kId));
	var kNode = this.mapStructure.getVKNodeByKId(kId);
	// do not broadcast back :)
	// TODO: distinguish click, select, unselect events
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

/**
 * Sets the coordinates of the rootNode and select the root node.
 * It calls update method of the clientApi interface (currently it is the `update()` method of the `knalledge.MapVisualization` specialized class)
 * @param  {number}   rootNodeX - X coordinate of the root node
 * @param  {number}   rootNodeY - Y coordinate of the root node
 * @param  {Function} callback - called after the map data are processed
 * @return {knalledge.MapLayout}
 */
MapLayout.prototype.processData = function(rootNodeX, rootNodeY, callback) {
	if(typeof rootNodeX !== 'undefined' && typeof rootNodeX !== 'function' &&
		typeof rootNodeY !== 'undefined' && typeof rootNodeY !== 'function'){
		if(this.mapStructure.rootNode){
			this.mapStructure.rootNode.x0 = rootNodeX;
			this.mapStructure.rootNode.y0 = rootNodeY;
		}
	}
	if(this.mapStructure.rootNode){
		this.selectNode(this.mapStructure.rootNode, null, true, true, true);
	}
	// TODO: (mprinc) I think we should get this out of here and handle it
	// inside the callback of the invoker
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
	this.clickNode(this.mapStructure.getSelectedNode(), null, true, undefined, true);
	//TODO bilo je valjda sasino: this.selectNode(this.mapStructure.getSelectedNode(), null, true);
	this.clientApi.update(this.mapStructure.getSelectedNode(),
		(typeof callback === 'function') ? callback : undefined);
};

MapLayout.prototype.viewspecChanged = function(target){
	if (target.value === "viewspec_tree") this.configTree.viewspec = "viewspec_tree";
	else if (target.value === "viewspec_manual") this.configTree.viewspec = "viewspec_manual";
	this.clientApi.update(this.mapStructure.rootNode);
};


/**
 * @function clickNode
 * @memberof knalledge.MapLayout#
 * @param  {knalledge.VKNode} d - clicked node
 * @param  {DOM} dom - dom of the node
 * @param  {boolean}   commingFromAngular - if the call is comming from the ng1 world or wildness
 * @param  {boolean}   doNotBubleUp - should we avoid bubbling up the event
 * @param  {boolean}   doNotBroadcast     [description]
 * @return {knalledge.MapLayout}
 */
MapLayout.prototype.clickNode = function(d, dom, commingFromAngular, doNotBubleUp, doNotBroadcast) {
	if(!this.nodes || d == null) return;

	var isSelected = d.isSelected; //nodes previous state

	if(isSelected){
		this.unselectNode(d, dom, commingFromAngular, doNotBubleUp, doNotBroadcast);
	}else{
		this.selectNode(d, dom, commingFromAngular, doNotBubleUp, doNotBroadcast);
	}
	return this;
};

/**
 * Selects node in the map
* @function selectNode
* @memberof knalledge.MapLayout#
* @param  {knalledge.VKNode} d - selecting node
* @param  {DOM} dom - dom of the node
* @param  {boolean}   commingFromAngular - if the call is comming from the ng1 world or wildness
* @param  {boolean}   doNotBubleUp - should we avoid bubbling up the event
* @param  {boolean}   doNotBroadcast     [description]
 */
MapLayout.prototype.selectNode = function(d, dom, commingFromAngular, doNotBubleUp, doNotBroadcast) {
	if(!this.nodes) return;

	// select clicked
	var isSelected = d.isSelected; //nodes previous state. THIS is NOT related (same as) `this.clientApi.selectNode(d)`
	// we want it idempotent, and even if it is isSelected === true,
	// still the visual representation of the node might represent unselected state
	// due to rerendering, etc
	// if(isSelected) return;
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
		this.knAllEdgeRealTimeService.emit(knalledge.MapLayout.KnRealTimeNodeSelectedEventName, d.kNode._id);
	}

	this.clientApi.positionToDatum(d);

	if(this.knalledgeState.addingLinkFrom !== null){
		this.mapStructure.createEdgeBetweenNodes(this.knalledgeState.addingLinkFrom, d); //this is called when we add new parent to the node
		this.knalledgeState.addingLinkFrom = null;
		//TODO: UPDATE SHOUL BE CALLED IN THE CALLBACK
		this.clientApi.update(this.mapStructure.rootNode); //TODO: should we move it into this.mapStructure.createEdge?
	}

	if(this.knalledgeState.relinkingFrom !== null){ //this is called when we relink this node from old to new parent
		var that = this;
		this.mapStructure.relinkNode(this.knalledgeState.relinkingFrom, d, function(result, error){
			that.knalledgeState.relinkingFrom = null;
			d.isOpen = true;
			that.clientApi.update(that.mapStructure.rootNode); //TODO: should we move it into this.mapStructure.relinkNode?
		}
		);
	}

	if(!doNotBubleUp) this.clientApi.nodeSelected(this.mapStructure.getSelectedNode(), dom, commingFromAngular);
	//this.clientApi.update(this.mapStructure.rootNode);
};

/**
 * Unselects selected node on the map
* @function selectNode
* @memberof knalledge.MapLayout#
* @param  {knalledge.VKNode} d - unselecting node
* @param  {DOM} dom - dom of the node
* @param  {boolean}   commingFromAngular - if the call is comming from the ng1 world or wildness
* @param  {boolean}   doNotBubleUp - should we avoid bubbling up the event
* @param  {boolean}   doNotBroadcast     [description]
 */
MapLayout.prototype.unselectNode = function(d, dom, commingFromAngular, doNotBubleUp, doNotBroadcast) {
	if(!this.nodes) return;

	// select clicked
	var isSelected = d.isSelected; //nodes previous state
	// if(!isSelected) return;
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

	d.isSelected = false;
	this.mapStructure.unsetSelectedNode();

	if(!doNotBubleUp) this.clientApi.nodeUnselected(this.mapStructure.getSelectedNode(), dom, commingFromAngular);
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
