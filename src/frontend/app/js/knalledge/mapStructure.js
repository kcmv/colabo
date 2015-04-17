(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapStructure =  knalledge.MapStructure = function(){
	this.rootNode = null;
	this.selectedNode = null;
	this.nodesById = {};
	this.edgesById = {};
	this.properties = {};
};

MapStructure.maxVKNodeId = 0;
MapStructure.maxVKEdgeId = 0;

MapStructure.prototype.init = function(){
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
		if(this.edgesById[i].kEdge.sourceId == d.kEdge._id){
			return true;
		}
	}
	return false;
};

MapStructure.prototype.getEdge = function(sourceId, targetId){
	for(var i in this.edgesById){
		if(this.edgesById[i].kEdge.sourceId == sourceId && this.edgesById[i].kEdge.targetId == targetId){
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

MapStructure.prototype.getMaxNodeId = function(){
	var maxId = -1;
	for(var i in this.nodesById){
		if(maxId < this.nodesById[i].kNode._id){
			maxId = this.nodesById[i].kNode._id;
		}
	}

	return maxId;
};

MapStructure.prototype.getMaxEdgeId = function(){
	var maxId = -1;
	for(var i in this.edgesById){
		if(maxId < this.edgesById[i].kEdge._id){
			maxId = this.edgesById[i].kEdge._id;
		}
	}

	return maxId;
};

MapStructure.prototype.createNode = function() {
	
	var nodeCreated = function(nodeFromServer) {
		console.log("[MapStructure.createNode] nodeCreated" + JSON.stringify(nodeFromServer));
	};
	
	console.log("[MapStructure.createNode] createNode");

	var id = MapStructure.maxVKNodeId;
	var newKNode = this.mapService.createNode();
	var newNode = {
		id: id,
		kNode: newKNode
	};

	this.nodesById[id] = newNode;
	return newNode;
};

MapStructure.prototype.updateNode = function(node) {
	this.mapService.updateNode(node); //updating on server service
};

MapStructure.prototype.createEdge = function(sourceNode, targetNode) {

	var edgeCreated = function(edgeFromServer) {
		console.log("[MapStructure.createEdge] edgeCreated" + JSON.stringify(edgeFromServer));
		
		// updating all references to edge on fronted with server-created id:
		var oldId = newEdge.kEdge._id;
		delete this.edgesById[oldId];//		this.nodesById.splice(oldId, 1);
		this.edgesById[edgeFromServer.kEdge._id] = newEdge; //TODO: we should set it to 'edgeFromServer'?! But we should synchronize also local changes from 'newEdge' happen in meantime
		newEdge.kEdge._id = edgeFromServer.kEdge._id; //TODO: same as above
	};
	
	var id = MapStructure.maxVKEdgeId;
	var newKEdge = this.mapService.createEdge(sourceNode.kNode, targetNode.kNode);
	var newEdge = {
		id: id,
		kEdge: newKEdge
	};

	this.edgesById[id] = newEdge;
	return newEdge;
};

MapStructure.prototype.getKNodeByVKId = function(vkId) {
	var kNode = null;
	return kNode;
};

MapStructure.prototype.getVKNodeByKId = function(kId) {
	var vkNode = null;

	for(i in this.nodesById){
		if(this.nodesById[i].kNode._id == kId) return this.nodesById[i];
	}

	return null;
};

MapStructure.prototype.processData = function(kMapData, rootNodeX, rootNodeY) {
	//this.properties = kMapData.properties;
	var rootId = "55268521fb9a901e442172f9";
	var i=0;
	var node = null;
	var edge = null;
	MapStructure.id = 0;
	var = id;
	for(i=0; i<kMapData.nodes.length; i++){
		node = kMapData.nodes[i];
		if(!("isOpen" in node)){
			node.isOpen = false;
		}
		id = MapStructure.maxVKNodeId++;
		this.nodesById[id] = {
			id: id,
			kNode: node
		};
	}

	for(i=0; i<kMapData.edges.length; i++){
		edge = kMapData.edges[i];
		id = MapStructure.maxVKEdgeId++;
		this.edgesById[id] =  = {
			id: id,
			kEdge: edge
		};
	}

	// this.rootNode = this.nodesById[this.properties.rootNodeId];
	this.rootNode = this.nodesById[this.getVKNodeByKId[rootId]];
	this.rootNode.x0 = rootNodeY;
	this.rootNode.y0 = rootNodeX;

	this.selectedNode = this.rootNode;

	// this.clickNode(this.rootNode);
	// this.update(this.rootNode);
};

}()); // end of 'use strict';