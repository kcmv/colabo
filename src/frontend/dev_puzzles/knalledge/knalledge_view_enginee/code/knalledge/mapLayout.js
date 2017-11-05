(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
@classdesc Deals with layout of the KnAllEdge map
@class MapLayout
@memberof knalledge
*/

var MapLayout =  knalledge.MapLayout = function(){
}

var ID=0;
MapLayout.prototype.construct = function(className, mapStructure, collaboPluginsService, configNodes, configTree, upperApi, knalledgeState, knAllEdgeRealTimeService, knalledgeMapViewService, rimaService){
	this.destroyed = false;
	this.className = className;
	this.id = ID++;
	console.log("[MapLayout] instance-id: ", this.id);

	this.mapStructure = mapStructure;
	this.collaboPluginsService = collaboPluginsService;
	this.configNodes = configNodes;
	this.configTree = configTree;
	this.upperApi = upperApi;
	this.knalledgeState = knalledgeState;
	this.knAllEdgeRealTimeService = knAllEdgeRealTimeService;
	this.knalledgeMapViewService = knalledgeMapViewService;
	this.rimaService = rimaService;
	this.nodes = null;
	this.links = null;
	this.nodeWeightSumMin = 0;
	this.nodeWeightSumMax = 0;

	this.nodesToAvoid = [];
	this.knownEdgeTypes = [knalledge.KEdge.TYPE_KNOWLEDGE];
	this.systemEdgeTypes = [];
	this.knownNodeTypes = [knalledge.KNode.TYPE_KNOWLEDGE];
	this.systemNodeTypes = [];

	this.collaboPluginsService.provideApi(className, {
		name: className,
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
			updateNodesToAvoid: this.updateNodesToAvoid.bind(this),
			addKnownEdgeTypes: this.addKnownEdgeTypes.bind(this),
			removeKnownEdgeTypes: this.removeKnownEdgeTypes.bind(this),
			addSystemEdgeTypes: this.addSystemEdgeTypes.bind(this),
			removeSystemEdgeTypes: this.removeSystemEdgeTypes.bind(this)
		}
	});
};

/**
 * The function that is called when we are destroying parent.
 * It has to destroy, or at worst disable any subcomponent from working
 * @function destroy
 * @memberof knalledge.MapLayout#
 */
MapLayout.prototype.destroy = function(){
	if(this.destroyed){
		console.log("[MapLayout] skipping 2nd destruction of instance-id: ", this.id);
		return;
	}
	console.log("[MapLayout] destroying instance-id: ", this.id);
	this.destroyed = true;
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

MapLayout.prototype.addKnownEdgeTypes = function(edgeTypes){
	for(var i=0; i<edgeTypes.length; i++){
		var edgeType = edgeTypes[i];
		this.knownEdgeTypes.push(edgeType);
	}
};
MapLayout.prototype.removeKnownEdgeTypes = function(edgeTypes){
	for(var i=0; i<edgeTypes.length; i++){
		var edgeType = edgeTypes[i];
		var rI = this.knownEdgeTypes.indexOf(edgeType);
		if (rI > -1) {
			this.knownEdgeTypes.splice(rI, 1);
		}
	}
};

MapLayout.prototype.addSystemEdgeTypes = function(edgeTypes){
	for(var i=0; i<edgeTypes.length; i++){
		var edgeType = edgeTypes[i];
		this.systemEdgeTypes.push(edgeType);
	}
};
MapLayout.prototype.removeSystemEdgeTypes = function(edgeTypes){
	for(var i=0; i<edgeTypes.length; i++){
		var edgeType = edgeTypes[i];
		var rI = this.systemEdgeTypes.indexOf(edgeType);
		if (rI > -1) {
			this.systemEdgeTypes.splice(rI, 1);
		}
	}
};

/**
 * Sets the coordinates of the rootNode and select the root node.
 * It calls update method of the upperApi interface (currently it is the `update()` method of the `knalledge.MapVisualization` specialized class)
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
	if(typeof callback === 'function') callback();
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

// MapLayout.prototype.processSyncedData = function(callback) {
// 	this.upperApi.nodeSelected(this.mapStructure.getSelectedNode(), null, true, undefined, true);
// 	this.upperApi.update(this.mapStructure.getSelectedNode(),
// 		(typeof callback === 'function') ? callback : undefined);
// };
//
MapLayout.prototype.viewspecChanged = function(target){
	if (target.value === "viewspec_tree") this.configTree.viewspec = "viewspec_tree";
	else if (target.value === "viewspec_manual") this.configTree.viewspec = "viewspec_manual";
	this.upperApi.update(this.mapStructure.rootNode);
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
