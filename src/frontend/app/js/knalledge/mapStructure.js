(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapStructure =  knalledge.MapStructure = function(){
	this.rootNode = null;
	this.selectedNode = null;
	this.mapService = null;
	this.nodesById = {};
	this.edgesById = {};
	this.properties = {};
};

MapStructure.maxVKNodeId = 0;
MapStructure.maxVKEdgeId = 0;

MapStructure.UPDATE_NODE_NAME = "UPDATE_NODE_NAME";
MapStructure.UPDATE_NODE_DIMENSIONS = "UPDATE_NODE_DIMENSIONS";

MapStructure.prototype.init = function(mapService){
	this.mapService = mapService;
};

MapStructure.prototype.removeImage = function(vkNode){
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


MapStructure.prototype.getChildrenEdgeTypes = function(vkNode){
	var children = {};
	for(var i in this.edgesById){
		var vkEdge = this.edgesById[i];
		if(vkEdge.kEdge.sourceId == vkNode.kNode._id){
			if(vkEdge.kEdge.type in children){
				children[vkEdge.kEdge.type] += 1;
			}else{
				children[vkEdge.kEdge.type] = 1;
			}
		}
	}
	return children;
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

// collapses children of the provided node
MapStructure.prototype.collapse = function(d) {
	d.isOpen = false;
};

// toggle children of the provided node
MapStructure.prototype.toggle = function(d) {
	d.isOpen = !d.isOpen;
};

//should be migrated to some util .js file:
MapStructure.prototype.cloneObject = function(obj){
	return (JSON.parse(JSON.stringify(obj)));
};

MapStructure.prototype.createNode = function() {
	
	// var nodeCreated = function(nodeFromServer) {
	// 	console.log("[MapStructure.createNode] nodeCreated" + JSON.stringify(nodeFromServer));
	// };
	
	console.log("[MapStructure.createNode] createNode");

	var id = MapStructure.maxVKNodeId;
	var newKNode = this.mapService.createNode();
	var newVKNode = {
		id: id,
		kNode: newKNode
	};

	this.nodesById[id] = newVKNode;
	return newVKNode;
};

MapStructure.prototype.updateName = function(vkNode, newName){
	vkNode.kNode.name = newName;
	this.mapService.updateNode(vkNode.kNode, MapStructure.UPDATE_NODE_NAME);
};

MapStructure.prototype.updateNode = function(vkNode, updateType) {
	switch(updateType){
		case MapStructure.UPDATE_NODE_DIMENSIONS:
			if('xM' in vkNode) vkNode.kNode.visual.xM = vkNode.xM;
			if('yM' in vkNode) vkNode.kNode.visual.yM = vkNode.yM;
			if('widthM' in vkNode) vkNode.kNode.visual.widthM = vkNode.widthM;
			if('heightM' in vkNode) vkNode.kNode.visual.heightM = vkNode.heightM;
	}
	this.mapService.updateNode(vkNode.kNode, updateType); //updating on server service
};

MapStructure.prototype.deleteNode = function(vnode) {
	this.mapService.deleteNode(vnode.kNode);
	delete this.nodesById[vnode._id];
	this.mapService.deleteEdgesConnectedTo(vnode.kNode);
	
	//TODO: delete connected vkedges;
};

MapStructure.prototype.createEdge = function(sourceNode, targetNode) {

	// var edgeCreated = function(edgeFromServer) {
	// 	console.log("[MapStructure.createEdge] edgeCreated" + JSON.stringify(edgeFromServer));
	// };
	
	var id = MapStructure.maxVKEdgeId;
	var newKEdge = this.mapService.createEdge(sourceNode.kNode, targetNode.kNode);
	var newEdge = {
		id: id,
		kEdge: newKEdge
	};

	this.edgesById[id] = newEdge;
	return newEdge;
};

MapStructure.prototype.deleteEdgesConnectedTo = function(node) {
	this.mapService.deleteNode(node);
};

MapStructure.prototype.getVKNodeByKId = function(kId) {
	for(var i in this.nodesById){
		if(this.nodesById[i].kNode._id == kId) return this.nodesById[i];
	}

	return null;
};

MapStructure.prototype.getVKEdgeByKIds = function(sourceKId, targetKId) {
	for(var i in this.edgesById){
		if(this.edgesById[i].kEdge.sourceId == sourceKId, this.edgesById[i].kEdge.targetKId == targetKId) return this.edgesById[i];
	}

	return null;
};

MapStructure.prototype.processData = function(kMapData, rootNodeX, rootNodeY) {
	this.properties = kMapData.map.properties;
	var i=0;
	var kNode = null;
	var kEdge = null;
	MapStructure.id = 0;
	var id;
	for(i=0; i<kMapData.map.nodes.length; i++){
		kNode = kMapData.map.nodes[i];
		if(!("isOpen" in kNode.visual)){
			kNode.visual.isOpen = false;
		}
		id = MapStructure.maxVKNodeId++;
		this.nodesById[id] = {
			id: id,
			kNode: kNode,
			isOpen: kNode.visual.isOpen,
			xM: kNode.visual.xM,
			yM: kNode.visual.yM,
			widthM: kNode.visual.widthM,
			heightM: kNode.visual.heightM
		};
	}

	for(i=0; i<kMapData.map.edges.length; i++){
		kEdge = kMapData.map.edges[i];
		id = MapStructure.maxVKEdgeId++;
		this.edgesById[id] = {
			id: id,
			kEdge: kEdge
		};
	}

	// this.rootNode = this.nodesById[this.properties.rootNodeId];
	this.rootNode = this.getVKNodeByKId(this.mapService.rootNodeId);
	this.rootNode.x0 = rootNodeX;
	this.rootNode.y0 = rootNodeY;

	this.selectedNode = this.rootNode;

	// this.clickNode(this.rootNode);
	// this.update(this.rootNode);
};

}()); // end of 'use strict';