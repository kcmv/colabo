(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapStructure =  knalledge.MapStructure = function(rimaService){
	this.rootNode = null;
	this.selectedNode = null;
	this.mapService = null;
	this.nodesById = {};
	this.edgesById = {};
	this.properties = {};

	this.rimaService = rimaService;
};

MapStructure.UPDATE_NODE_NAME = "UPDATE_NODE_NAME";
MapStructure.UPDATE_DATA_CONTENT = "UPDATE_DATA_CONTENT";
MapStructure.UPDATE_NODE_DIMENSIONS = "UPDATE_NODE_DIMENSIONS";
MapStructure.UPDATE_NODE_APPEARENCE = "UPDATE_NODE_APPEARENCE";
MapStructure.UPDATE_NODE_IBIS_VOTING = "UPDATE_NODE_IBIS_VOTING";

MapStructure.prototype.init = function(mapService){
	this.mapService = mapService;
};

MapStructure.prototype.removeImage = function(vkNode){
	if(!this.mapService) return;

	if(vkNode){
		if(!vkNode.kNode.dataContent){
			vkNode.kNode.dataContent = {};
		}
		// http://localhost:8888/knodes/one/5526855ac4f4db29446bd183.json
		delete vkNode.kNode.dataContent.image;
		this.mapService.updateNode(vkNode.kNode);
	}
};

MapStructure.prototype.unsetSelectedNode = function(){
	this.selectedNode = null;
};

MapStructure.prototype.setSelectedNode = function(selectedNode){
	this.selectedNode = selectedNode;
//	try {
//		throw new Error('DebugStack');
//	}
//	catch(e) {
//	// console.warn((new Error).lineNumber)
//		nsDebug.d.cnTb('selectedNode: \n' + e.stack);
//		if(selectedNode && selectedNode.kNode){
//			nsDebug.d.cnTb('selectedNode.kNode.name: ' + selectedNode.kNode.name);
//		}
//	}
};

MapStructure.prototype.getSelectedNode = function(){
	return this.selectedNode;
};

MapStructure.prototype.hasChildren = function(d){
	for(var i in this.edgesById){
		if(this.edgesById[i].kEdge.sourceId == d.kNode._id){
			return true;
		}
	}
	return false;
};

/*
 * @returns Array - their may be several edges connecting 2 nodes:
 */
MapStructure.prototype.getEdgesBetweenNodes = function(source, target){ //TODO: improve this for Big data by 2-dimensional array
	var edges = [];
	for(var i in this.edgesById){
		var vkEdge = this.edgesById[i];
		if(source._id == vkEdge.kEdge.sourceId && target._id == vkEdge.kEdge.targetId){
			edges.push(vkEdge);
		}
	}
	return edges;
};

MapStructure.prototype.getEdge = function(sourceId, targetId){
	var sourceKId = this.nodesById[sourceId].kNode._id;
	var targetKId = this.nodesById[targetId].kNode._id;
	for(var i in this.edgesById){
		if(this.edgesById[i].kEdge.sourceId == sourceKId && this.edgesById[i].kEdge.targetId == targetKId){
			return this.edgesById[i];
		}
	}
	return null;
};

MapStructure.prototype.getChildrenEdgeTypes = function(vkNode){
	var childrenEdgeTypes = {};
	for(var i in this.edgesById){
		var vkEdge = this.edgesById[i];
		if(vkEdge.kEdge.sourceId == vkNode.kNode._id){
			if(vkEdge.kEdge.type in childrenEdgeTypes){
				childrenEdgeTypes[vkEdge.kEdge.type] += 1;
			}else{
				childrenEdgeTypes[vkEdge.kEdge.type] = 1;
			}
		}
	}
	return childrenEdgeTypes;
};

MapStructure.prototype.getChildrenEdges = function(vkNode, edgeType){
	var children = [];
	for(var i in this.edgesById){
		var vkEdge = this.edgesById[i];
		if(vkEdge.kEdge.sourceId == vkNode.kNode._id && ((typeof edgeType === 'undefined') || vkEdge.kEdge.type == edgeType)){
			children.push(vkEdge);
		}
	}
	return children;
};

MapStructure.prototype.getChildrenNodes = function(vkNode, edgeType){
	var children = [];
	for(var i in this.edgesById){
		var vkEdge = this.edgesById[i];
		if(vkEdge.kEdge.sourceId == vkNode.kNode._id && ((typeof edgeType === 'undefined') || vkEdge.kEdge.type == edgeType)){
			for(var j in this.nodesById){
				var vkNodeChild = this.nodesById[j];
				if(vkNodeChild.kNode._id == vkEdge.kEdge.targetId){
					children.push(vkNodeChild);
				}
			}
		}
	}
	return children;
};

MapStructure.prototype.getParentNodes = function(vkNode, edgeType){
	var parents = [];
	for(var i in this.edgesById){
		var vkEdge = this.edgesById[i];
		if(vkEdge.kEdge.targetId == vkNode.kNode._id && ((typeof edgeType === 'undefined') || vkEdge.kEdge.type == edgeType)){
			for(var j in this.nodesById){
				var vkNodeParent = this.nodesById[j];
				if(vkNodeParent.kNode._id == vkEdge.kEdge.sourceId){
					parents.push(vkNodeParent);
				}
			}
		}
	}
	return parents;
};

MapStructure.prototype.getMaxNodeId = function(){
	var maxId = -1;
	for(var i in this.nodesById){
		if(this.nodesById[i].id > maxId) maxId = this.nodesById[i].id;
	}
	return maxId;
};

MapStructure.prototype.getMaxEdgeId = function(){
	var id = -1;
	for(var i in this.edgesById){
		if(this.edgesById[i].id > id) id = this.edgesById[i].id;
	}	
};

// TODO
Map.prototype.addChildNode = function(nodeParent, nodeChild, edge){
	nodeChild.id = this.getMaxNodeId() + 1;
	nodeChild.mapId = 1;

	edge.id = this.getMaxEdgeId() + 1;
	edge.sourceId = nodeParent.id;
	edge.targetId = nodeChild.id;
	edge.mapId = 1;

	this.nodesById.push(nodeChild);
	this.edgesById.push(edge);
};

// collapses children of the provided node
MapStructure.prototype.collapse = function(vkNode) {
	vkNode.isOpen = false;
	this.updateNode(vkNode, MapStructure.UPDATE_NODE_APPEARENCE);
};

// collapses children of the provided node
MapStructure.prototype.expandNode = function(vkNode) {
	vkNode.isOpen = true;
	this.updateNode(vkNode, MapStructure.UPDATE_NODE_APPEARENCE);
};

// toggle children of the provided node
MapStructure.prototype.toggle = function(vkNode) {
	vkNode.isOpen = !vkNode.isOpen;	
	this.updateNode(vkNode, MapStructure.UPDATE_NODE_APPEARENCE);
};

//should be migrated to some util .js file:
MapStructure.prototype.cloneObject = function(obj){
	return (JSON.parse(JSON.stringify(obj)));
};

MapStructure.prototype.createNode = function(vkNode, nodeType) {
	if(!this.mapService) return null;
	
	// var nodeCreated = function(nodeFromServer) {
	// 	console.log("[MapStructure.createNode] nodeCreated" + JSON.stringify(nodeFromServer));
	// };
	
	console.log("[MapStructure.createNode] createNode");
	var newVKNode = vkNode;
	if(!newVKNode) newVKNode = new knalledge.VKNode();
	if(!newVKNode.kNode) newVKNode.kNode = new knalledge.KNode();
	newVKNode.kNode.iAmId = this.rimaService.getActiveUserId();

	newVKNode.kNode = this.mapService.createNode(newVKNode.kNode, nodeType);
	newVKNode.kNode.$promise.then(function(nodeCreated){
		console.log("MapStructure.prototype.createNode - promised");//TODO:remove this test
	});
	this.nodesById[newVKNode.id] = newVKNode;
	return newVKNode;
};


MapStructure.prototype.createEdge = function(vkEdge) {
	if(!this.mapService) return null;

	vkEdge.kEdge = this.mapService.createEdge(vkEdge.kEdge);

	this.edgesById[vkEdge.id] = vkEdge;
	return vkEdge;
};

MapStructure.prototype.createEdgeBetweenNodes = function(sourceNode, targetNode, edgeType) {
	if(!this.mapService) return null;

	var newKEdge = this.mapService.createEdgeBetweenNodes(sourceNode.kNode, targetNode.kNode, null, edgeType);
	var newVKEdge = new knalledge.VKEdge();
	newVKEdge.kEdge = newKEdge;

	this.edgesById[newVKEdge.id] = newVKEdge;
	return newVKEdge;
};

MapStructure.prototype.createNodeWithEdge = function(sourceVKNode, vkEdge, targetVKNode, callback) {
	if(!(sourceVKNode.id in this.nodesById)){
		this.createNode(sourceVKNode);
	}
	if(!(targetVKNode.id in this.nodesById)){
		this.createNode(targetVKNode);
	}
	vkEdge.kEdge.sourceId = sourceVKNode.kNode._id;
	vkEdge.kEdge.targetId = targetVKNode.kNode._id;
	vkEdge = this.createEdge(vkEdge);

	return vkEdge;
};

MapStructure.prototype.updateName = function(vkNode, newName){
	if(!this.mapService) return;

	vkNode.kNode.name = newName;
	this.mapService.updateNode(vkNode.kNode, MapStructure.UPDATE_NODE_NAME);
};

MapStructure.prototype.updateNode = function(vkNode, updateType) {
	if(!this.mapService) return;

	switch(updateType){
		case MapStructure.UPDATE_NODE_DIMENSIONS:
			if(! vkNode.kNode.visual) vkNode.kNode.visual = {};
			if('xM' in vkNode) vkNode.kNode.visual.xM = vkNode.xM;
			if('yM' in vkNode) vkNode.kNode.visual.yM = vkNode.yM;
			if('widthM' in vkNode) vkNode.kNode.visual.widthM = vkNode.widthM;
			if('heightM' in vkNode) vkNode.kNode.visual.heightM = vkNode.heightM;
			break;
		case MapStructure.UPDATE_NODE_APPEARENCE:
			if(! vkNode.kNode.visual) vkNode.kNode.visual = {};
			if('isOpen' in vkNode) vkNode.kNode.visual.isOpen = vkNode.isOpen;
			break;
		case MapStructure.UPDATE_NODE_IBIS_VOTING:
			break;
		case MapStructure.UPDATE_DATA_CONTENT:
			break;
	}
	this.mapService.updateNode(vkNode.kNode, updateType); //updating on server service
};

MapStructure.prototype.deleteNode = function(vnode) {
	if(!this.mapService) return;

	this.deleteEdgesConnectedTo(vnode); // first we delete edges, so that the D3 don't reach unexisting node over them
	this.mapService.deleteNode(vnode.kNode);
	delete this.nodesById[vnode.id]; //TODO: see if we should do it only upon server deleting success
};

MapStructure.prototype.deleteEdgesConnectedTo = function(vnode) {
	if(!this.mapService) return;

	this.mapService.deleteEdgesConnectedTo(vnode.kNode);
	
	//deleting from edgesById:
	for(var i in this.edgesById){
		var edge = this.edgesById[i];
		if(edge.kEdge.sourceId == vnode.kNode._id || edge.kEdge.targetId == vnode.kNode._id){
			delete this.edgesById[i]; 
		}
	}
};

MapStructure.prototype.getVKNodeByKId = function(kId) {
	for(var i in this.nodesById){
		var vkNode = this.nodesById[i];
		if(vkNode.kNode._id == kId) {
			return vkNode;
		}
	}
	try {
		throw new Error('myError');
	}
	catch(e) {
	// console.warn((new Error).lineNumber)
		console.warn('getVKNodeByKId found kNode.'+kId+' without parent vkNode: \n' + e.stack);
		return null;
	}
};

MapStructure.prototype.getVKEdgeByKIds = function(sourceKId, targetKId) {
	for(var i in this.edgesById){
		if(this.edgesById[i].kEdge.sourceId == sourceKId, this.edgesById[i].kEdge.targetKId == targetKId) return this.edgesById[i];
	}

	return null;
};

MapStructure.prototype.processData = function(kMapData, rootNodeX, rootNodeY) {
	this.properties = kMapData.properties;
	var i=0;
	var kNode = null;
	var kEdge = null;
	MapStructure.id = 0;

	// deleting all previous data
	// TODO: FIX: what about incremental updates
	this.nodesById = {};
	this.nodesById = {};

	var id;
	for(i=0; i<kMapData.map.nodes.length; i++){
		kNode = kMapData.map.nodes[i];
		if(!("isOpen" in kNode.visual)){
			kNode.visual.isOpen = false;
		}

		var vkNode = new knalledge.VKNode();
		vkNode.kNode = kNode;
		vkNode.isOpen = kNode.visual.isOpen;
		vkNode.xM = kNode.visual.xM;
		vkNode.yM = kNode.visual.yM;
		vkNode.widthM = kNode.visual.widthM;
		vkNode.heightM = kNode.visual.heightM;

		this.nodesById[vkNode.id] = vkNode;
	}

	for(i=0; i<kMapData.map.edges.length; i++){
		kEdge = kMapData.map.edges[i];
		var vkEdge = new knalledge.VKEdge();
		vkEdge.kEdge = kEdge;
		this.edgesById[vkEdge.id] = vkEdge;
	}

	// this.rootNode = this.nodesById[this.properties.rootNodeId];
	this.rootNode = this.getVKNodeByKId(
		this.mapService ? this.mapService.rootNodeId :
			(kMapData.properties ? kMapData.properties.rootNodeId : null)
	);
	if(typeof rootNodeX !== 'undefined') this.rootNode.x0 = rootNodeX;
	if(typeof rootNodeY !== 'undefined') this.rootNode.y0 = rootNodeY;

	this.selectedNode = this.rootNode;

	// this.clickNode(this.rootNode);
	// this.update(this.rootNode);
};

}()); // end of 'use strict';