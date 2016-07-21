(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
@classdesc Provides the interface for manipulating with the knalledge map structure,
it is used as a prerequisite for the map visualization.

**NOTE**: It handles VKNodes and VKEdges,
not KNodes nor KEdges
@class MapStructure
@memberof knalledge
*/

var MapStructure =  knalledge.MapStructure = function(rimaService, knalledgeMapViewService, knalledgeMapPolicyService, Plugins, CollaboGrammarService){

	CollaboGrammarService.puzzles.knalledgeMap.actions['nodeDecoration'] = MapStructure.prototype.nodeDecoration;
	this.rootNode = null;
	this.destroyed = false;

	/**
	 * Currently selected node in the map
	 * @type {knalledge.vkNode}
	 */
	this.selectedNode = null;

	/**
	 * Currently editing node in the map
	 * undefined/null if none is in the editing mode
	 * @type {knalledge.vkNode}
	 */
	this.editingNode = null;

	/**
	 * A top service responsible for managing KnAllEdge map
	 * @type {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService}
	 */
	this.mapService = null;

	/**
	 * Service that configures visual aspects of the KnAllEdge system
	 * @type {knalledge.knalledgeMap.KnalledgeMapViewService}
	 */
	this.knalledgeMapViewService = knalledgeMapViewService;
	/**
	 * Service that configures policy aspects of the KnAllEdge system
	 * @type {knalledge.knalledgeMap.KnalledgeMapPolicyService}
	 */
	this.knalledgeMapPolicyService = knalledgeMapPolicyService;

	/**
	 * Plugins configuration object
	 * @type {config.Plugins}
	 */
	 this.Plugins = Plugins;
	/**
	 * Set of nodes (VKNode) that exists in the map
	 *
	 * Key in the hash is the VKNode's id
	 * @type {Array<integer,knalledge.VKNode>}
	 */
	this.nodesById = {};
	/**
	 * Set of edges (VKEdge) that exists in the map
	 *
	 * Key in the hash is the VKEdge's id
	 * @type {Array<integer,knalledge.VKEdge>}
	 */
	this.edgesById = {};

	/**
	 * Map properties
	 * @type {Object}
	 */
	this.properties = {};

	// TODO: we need to remove that and move it into plugin
	this.rimaService = rimaService;
};

// Lists of constants that describes what type of updates are made on node
MapStructure.UPDATE_NODE_NAME = "UPDATE_NODE_NAME";
MapStructure.UPDATE_DATA_CONTENT = "UPDATE_DATA_CONTENT"; //depricated, should be more specialized
MapStructure.UPDATE_NODE_DIMENSIONS = "UPDATE_NODE_DIMENSIONS";
MapStructure.UPDATE_NODE_VISUAL_OPEN = "UPDATE_NODE_VISUAL_OPEN";
MapStructure.UPDATE_NODE_TYPE = "UPDATE_NODE_TYPE";
MapStructure.UPDATE_NODE_CREATOR = "UPDATE_NODE_CREATOR";

/**
* @var {debugPP} debug - namespaced debug for the class
* @memberof knalledge.MapStructure#
*/
MapStructure.debug = debugpp.debug('knalledge.MapStructure');

/**
 * Initializes MapStructure
 * @function init
 * @memberof knalledge.MapStructure#
 * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService} mapService - A top service
 *          responsible for managing KnAllEdge map
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.init = function(mapService){
	this.mapService = mapService;
	this.destroyed = false;
	return this;
};

/**
 * The function that is called when we are destroying parent.
 * It has to destroy, or at worst disable any subcomponent from working
 * @function destroy
 */
MapStructure.prototype.destroy = function(){
	this.destroyed = true;
};

MapStructure.prototype.isStructuralChange = function(actionType){
	return actionType === MapStructure.UPDATE_NODE_NAME || actionType === MapStructure.UPDATE_DATA_CONTENT;
}

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

/**
 * Unselects currently selected node
 * @function unsetSelectedNode
 * @memberof knalledge.MapStructure#
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.unsetSelectedNode = function(vkNode){
	this.selectedNode = null;
	return this;
};

MapStructure.prototype.debugNode = function(node){
	if(this.knalledgeMapPolicyService.provider.config.moderating.enabled){
		console.log("DEBUG-NODE:",node);
		for(var i in this.edgesById){
			if(this.edgesById[i].kEdge.targetId === node.kNode._id){
				console.log("DEBUG-PARENT-EDGE:",this.edgesById[i]);
				break;
			}
		}
	}
};

/**
 * Sets currently selected node
 * @param  {knalledge.VKNode} selectedNode - newly selected node
 * @function setSelectedNode
* @memberof knalledge.MapStructure#
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.setSelectedNode = function(selectedNode){
	this.debugNode(selectedNode);
	this.selectedNode = selectedNode;
	// sets what nodes are visible relatively to the currently selected node
	// TODO: it should be migrated into plugin
	this.setVisibility(); //TODO: should be called only setVisibilityByDistance(), but we would have problem in finding visibleAsAncestors if not calculating for all
//	try {
//		throw new Error('DebugStack');
//	}
//	catch(e) {
//	// console.warn((new Error).lineNumber)
//		MapStructure.debug.log('selectedNode: \n' + e.stack);
//		if(selectedNode && selectedNode.kNode){
//			MapStructure.debug.log('selectedNode.kNode.name: ' + selectedNode.kNode.name);
//		}
//	}
	return this;
};

/**
 * Returns currently selected node
 * @function getSelectedNode
* @memberof knalledge.MapStructure#
 * @return {knalledge.VKNode}
 */
MapStructure.prototype.getSelectedNode = function(){
	return this.selectedNode;
};

/**
 * Sets currently editing node
 * @function setEditingNode
* @memberof knalledge.MapStructure#
 * @param {knalledge.VKNode} vkNode
 */
MapStructure.prototype.setEditingNode = function(vkNode){
	this.editingNode = vkNode;
};

/**
 * Returns currently editing node
 * @function getEditingNode
* @memberof knalledge.MapStructure#
 * @return {knalledge.VKNode}
 */
MapStructure.prototype.getEditingNode = function(){
	return this.editingNode;
};

MapStructure.prototype.hasChildren = function(d){
	for(var i in this.edgesById){
		if(this.edgesById[i].kEdge.sourceId == d.kNode._id){
			return true;
		}
	}
	return false;
};

/**
* @function getEdgesBetweenNodes
* @memberof knalledge.MapStructure#
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

MapStructure.prototype.getNeighbours = function(sourceNode){
	var neighbours = {};
	if(this.edgesById != null && this.nodesById != null){
		for(var i in this.edgesById){
			var vkEdge = this.edgesById[i];
			if((vkEdge.kEdge.sourceId == sourceNode.kNode._id || vkEdge.kEdge.targetId == sourceNode.kNode._id) && ((typeof edgeType === 'undefined') || vkEdge.kEdge.type == edgeType)){
				for(var j in this.nodesById){
					var targetNode = this.nodesById[j];
					if((targetNode.kNode._id == vkEdge.kEdge.targetId || targetNode.kNode._id == vkEdge.kEdge.sourceId) && targetNode != sourceNode){
						neighbours[targetNode.kNode._id] = targetNode;
					}
				}
			}
		}
	}
	delete neighbours[sourceNode.kNode._id];
	console.log('getNeighbours - ' + sourceNode.kNode.name + '\'s neighbours: ' + getNodesNames(neighbours));
	return neighbours;
}

/**
 * Returns if the node is visible - returns true if it should be visible by itself or because it is on ancestors path to some other visible node
 *
 * It returns true if it should be visible by itself or because it is on ancestors path to some other visible node
 * @function isNodeVisible
 * @memberof knalledge.MapStructure#
 * @param  {knalledge.VKNode} node - node we are interested for
 * @return {boolean}
 */
MapStructure.prototype.isNodeVisible = function(node){
	 var result =
	 this.isNodeVisibleWOAncestory(node) ||
	 node.presentation.visibleAsAncestor;

	 return result;
}
/**
 * Returns if the node is visible - returns true if it should be visible
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
MapStructure.prototype.isNodeVisibleWOAncestory = function(node){
	var visibleIBIS = true;
	var activeUserId = this.rimaService ?
		this.rimaService.getActiveUserId() :
		this.Plugins.puzzles.rima.config.rimaService.ANONYMOUS_USER_ID;

	if(node.kNode.isIbis()){
		var parents = this.getParentNodes(node);
		var parentIsKn = false;
		for(var i=0;i<parents.length;i++){
			if(parents[0].kNode.type == knalledge.KNode.TYPE_KNOWLEDGE){
				parentIsKn = true;
			}
		}
		visibleIBIS = this.knalledgeMapViewService.provider.config.filtering.visbileTypes.ibis || parentIsKn;
	}

	var visibleBrainstorming = true;
	// if((node.kNode.decorations.brainstorming != undefined || node.kNode.decorations.brainstorming >=1) &&
	// (this.CollaboGrammarService.provider.config.state.brainstorming.phase == puzzles.brainstormings.BrainstormingPhase.IDEAS_GENERATION)
	//  && node.kNode.iAmId != activeUserId){ // brainstorming node && in brainstorming state / phase puzzles.brainstormings.BrainstormingPhase.IDEAS_GENERATION
	// 	visibleBrainstorming = false;
	// }

	var result = node.presentation.visibleByDistance && visibleIBIS && visibleBrainstorming;
 	//TODO: ADD for isPublic, but MIGRATE TO mapStructure FUNC CALL (vkNode.kNode.isPublic || vkNode.kNode.iAmId == this.rimaService.getActiveUserId())
	return result;
}

/**
 * calculate/sets visibility of all nodes based on different visibility switches (like `limit Range`) or by publicity/autorship of node
 * (like `limit Range`) or by publicity/autorship of node
 * @function setVisibility
 * @memberof knalledge.MapStructure#
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.setVisibility = function(){ //TODO: PERFORMANCE-IMPROVEMENT: make not to be called all specific sub-functions every time
	//hiding all nodes:
	for(var j in this.nodesById){
		this.nodesById[j].presentation.visibleAsAncestor = false;
	}

	//calling functions for all the types of visibility:
	this.setVisibilityByDistance(this.selectedNode, this.knalledgeMapViewService.provider.config.filtering.displayDistance);
	//setVisibilityByAuthor();
	//..

	for(var j in this.nodesById){ //TODO: this should be improved so that some nodes that are already covered are not treated again:
		var node = this.nodesById[j];
		if(this.isNodeVisibleWOAncestory(node)){
			this.setAncestorsVisibile(node);
		}
	}

	this.openAncestors(this.selectedNode); //we have to do this if some of the selected node's ancestors is not opened and sel_node is found by example by searching for that node
	return this;
}

/**
 * [function description]
 * @function setAncestorsVisibile
 * @memberof knalledge.MapStructure#
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.setAncestorsVisibile = function(node){
	var ancestors = this.getAncestorsPath(node);
	for(var j in ancestors){
		ancestors[j].presentation.visibleAsAncestor = true;
	}
	// console.log('setVisibility - getAncestorsPath: ' + getNodesNames(ancestors));

	return this;
}

/**
 * [function description]
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
MapStructure.prototype.openAncestors = function(node){
	if(node == null){return;}
	var ancestors = this.getAncestorsPath(node);
	for(var j in ancestors){
		if(ancestors[j] != node){ // becasue getAncestorsPath returns the `node` too
			ancestors[j].isOpen = true;
		}
	}
	//console.log('setVisibility - openAncestors: ' + getNodesNames(ancestors));
	return this;
}

/**
 * [function description]
 * @function setVisibilityByAuthor
 * @memberof knalledge.MapStructure#
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.setVisibilityByAuthor = function(sourceNode, distance){
	return this;
}

/**
 * set nodes visibility based on their distance (length of path) from source node
 * @function setVisibilityByDistance
 * @memberof knalledge.MapStructure#
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.setVisibilityByDistance = function(sourceNode, distance){
	if(sourceNode!=null){
		//console.log('setVisibilityByDistance(sourceNode, distance): ' + sourceNode.kNode.name + ', ' + distance);
		if(distance != -1){ //all should be visible
			for(var j in this.nodesById){
				this.nodesById[j].presentation.visibleByDistance = false;
			}
			var visibleNodes = this.getNeghboursInDistance(sourceNode, distance);
			for(var j in visibleNodes){
				visibleNodes[j].presentation.visibleByDistance = true;
			}
		}
		else{
			for(var j in this.nodesById){
				this.nodesById[j].presentation.visibleByDistance = true;
			}
		}
	}
	return this;
}

/**
 * [function description]
 */
MapStructure.prototype.getNeghboursInDistance = function(sourceNode, distance){
	//algorythm is parallel, walk in widenes, not in depth (recursive)
	console.log('getNeghboursInDistance(sourceNode, distance): ' + sourceNode.kNode.name + ', ' + distance);
	var passedNodes = {};
	var currentDistance = 0;
	passedNodes[sourceNode.kNode._id] = sourceNode;
	if(distance > 0){
		var reachedNodes = this.getNeighbours(sourceNode);
		//console.log('getNeghboursInDistance - neighbours - first: ' + getNodesNames(reachedNodes));
		var neighbours = {};
		var neighbourNode = null;
		do{ //
			currentDistance++;
			console.log('getNeghboursInDistance - neighbours in ' + currentDistance + ' distance from ' + sourceNode.kNode.name + ': ' + getNodesNames(reachedNodes));
			var neighboursOfReachedNodes = {};
			for(var i in reachedNodes){ // going through all neighbours of current source node
				var node = reachedNodes[i];
				neighbours = this.getNeighbours(node);
				console.log('getNeghboursInDistance - neighbours of ' + node.kNode.name + ': ' + getNodesNames(neighbours));
				//TODO: this could be improved by a function of adding elements to object-hash
				for(var i in neighbours){ //adding neighbours of current neighbours of actual source node.
					neighbourNode = neighbours[i];
					if(!(neighbourNode.kNode._id in passedNodes)){
						neighboursOfReachedNodes[neighbourNode.kNode._id] = neighbourNode; // filling the array of neighbours of current neighbours of actual source node. If we come to the same node from different reachedNodes, we will just override it, not duplicate it
					}
				}
				passedNodes[node.kNode._id] = node; //we have passed now the actual node
			}
			reachedNodes = neighboursOfReachedNodes;
			console.log('getNeghboursInDistance: distance:' + distance + ', reachedNodes: ' + getNodesNames(reachedNodes));
		}while(currentDistance < distance && Object.keys(reachedNodes).length > 0);
	}
	console.log('getNeghboursInDistance - passedNodes: ' + getNodesNames(passedNodes));
	return passedNodes;
};

function getNodesNames(nodesHash){
	var names = "";
	for(var i in nodesHash){
		names = names + '; ' + nodesHash[i].kNode.name;
	}
	return names;
}

/*
	get all nodes that are children (immediate descendant) of @vkNode
*/
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

/*
	get all nodes that are parent (immediate ancestors) of @vkNode
	we are looking at map as an graph and not a tree, thus meaning a node
*/
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

/*
	returns all nodes that are ancestors of @node, INCLUDING the node
*/
MapStructure.prototype.getAncestorsPath = function(node){
	//TODO: we display now all parent paths. OK?
	//TODO: other concerns regarding this algorythm are elaborated at photo of WHiteBoard@UiO prior DHN 2016
	var ancestors = {};
	ancestors[node.kNode._id] = node;
	var parents = this.getParentNodes(node);
	var ancestorsNew ={};
	for (var i = 0; i < parents.length; i++) {
		ancestorsNew = this.getAncestorsPath(parents[i]);
		for(var ancestors_i in ancestorsNew){
			ancestors[ancestors_i] = ancestorsNew[ancestors_i]; //IMPORTANT: by this algorythm the same ancestor can be found and added if he is on multiple paths (by using hash-object we override it, but by using array we should duplicate it)
		}
	}
	return ancestors;
}

/**
 * Returns max id among all vknodes in the map
 * @function getMaxNodeId
 * @memberof knalledge.MapStructure#
 * @return {integer}
 */
MapStructure.prototype.getMaxNodeId = function(){
	var maxId = -1;
	for(var i in this.nodesById){
		if(this.nodesById[i].id > maxId) maxId = this.nodesById[i].id;
	}
	return maxId;
};

/**
 * Returns max id among all vkedges in the map
 * @function getMaxEdgeId
 * @memberof knalledge.MapStructure#
 * @return {integer}
 */
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


/**
 * collapses the provided node (sets node's isOpen to false)
 * @function collapse
 * @memberof knalledge.MapStructure#
 * @param {knalledge.VKNode} vkNode - node to collapse
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.collapse = function(vkNode) {
	vkNode.isOpen = false;
	this.updateNode(vkNode, MapStructure.UPDATE_NODE_VISUAL_OPEN, false);
};

/**
 * Expands the provided node (sets node's isOpen to true)
 * @function expandNode
 * @memberof knalledge.MapStructure#
 * @param {knalledge.VKNode} vkNode - node to expand
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.expandNode = function(vkNode) {
	vkNode.isOpen = true;
	this.updateNode(vkNode, MapStructure.UPDATE_NODE_VISUAL_OPEN, true);
};

/**
 * Toggles expansion of the provided node (sets node's isOpen to !isOpen)
 * @function toggle
 * @memberof knalledge.MapStructure#
 * @param {knalledge.VKNode} vkNode - node to toggle
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.toggle = function(vkNode) {
	vkNode.isOpen = !vkNode.isOpen;
	this.updateNode(vkNode, MapStructure.UPDATE_NODE_VISUAL_OPEN, vkNode.isOpen);
};

// TODO: should be migrated to some util .js file:
MapStructure.prototype.cloneObject = function(obj){
	return (JSON.parse(JSON.stringify(obj)));
};

MapStructure.prototype.createNode = function(vkNode, nodeType) {
	var activeUserId = this.rimaService ?
		this.rimaService.getActiveUserId() :
		this.Plugins.puzzles.rima.config.rimaService.ANONYMOUS_USER_ID;

	if(!this.mapService) return null;

	// var nodeCreated = function(nodeFromServer) {
	// 	console.log("[MapStructure.createNode] nodeCreated" + JSON.stringify(nodeFromServer));
	// };

	console.log("[MapStructure.createNode] createNode");
	var newVKNode = vkNode;
	if(!newVKNode) newVKNode = new knalledge.VKNode();
	if(!newVKNode.kNode) newVKNode.kNode = new knalledge.KNode();
	newVKNode.kNode.iAmId = activeUserId;

	newVKNode = this.nodeDecoration(newVKNode);
	newVKNode.kNode = this.mapService.createNode(newVKNode.kNode, nodeType);
	newVKNode.kNode.$promise.then(function(nodeCreated){
		//console.log("MapStructure.prototype.createNode - promised");
	});
	this.nodesById[newVKNode.id] = newVKNode;
	return newVKNode;
};

MapStructure.prototype.nodeDecoration = function(node) {
	if(this.knalledgeMapPolicyService.provider.config.state.brainstorming){// && this.knalledgeMapPolicyService.provider.config.state.brainstorming.phase >= puzzles.brainstormings.BrainstormingPhase.IDEAS_GENERATION){//we are in Brainstorming mode:
		node.kNode.decorations.brainstorming = this.knalledgeMapPolicyService.provider.config.state.brainstorming.phase;
	}
	return node;
};

MapStructure.prototype.createEdge = function(vkEdge, callback) {
	if(!this.mapService) return null;

	vkEdge.kEdge = this.mapService.createEdge(vkEdge.kEdge, callback);

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

/**
 * [isOnAncestorsPath description]
 * @param  {[type]}  nodeDescendant [description]
 * @param  {[type]}  nodeAncestor   [description]
 * @return {Boolean}                [description]
 */
MapStructure.prototype.isOnAncestorsPath = function(nodDescendant, nodeAncestor){
	var ancestors = this.getAncestorsPath(nodDescendant);
	//var is_ancestor = false;
	for(var ancestors_i in ancestors){
		if(ancestors[ancestors_i] == nodeAncestor){ //TODO: later when we support multiple parents we will have to extend this
			//is_ancestor = true;
			return true;
		}
	}
	return false;
};

MapStructure.prototype.relinkNode = function(sourceNode, newParent, callback) {
	var that = this;
	if(!this.mapService) {callback(false); return null;}
	if(this.isOnAncestorsPath(newParent,sourceNode)){
		callback(false, 'DISRUPTING_PATH');
	} else {
		this.mapService.relinkNode(sourceNode.kNode, newParent.kNode,
			function(){
				that.updateNode(newParent, MapStructure.UPDATE_NODE_VISUAL_OPEN, true, function(){
						if(callback){callback();}
				});
		});
	}
};

MapStructure.prototype.sendRequest = function(request, callback) {
	if(!this.mapService) {callback(false, 'SERVICE_UNAVAILABLE'); return null;}
	this.mapService.sendRequest(request, callback);
}

MapStructure.prototype.createNodeWithEdge = function(sourceVKNode, vkEdge, targetVKNode, callback) {
	if(!(sourceVKNode.id in this.nodesById)){
		this.createNode(sourceVKNode);
	}
	if(!(targetVKNode.id in this.nodesById)){
		this.createNode(targetVKNode, targetVKNode.kNode ? targetVKNode.kNode.type : undefined);
	}
	vkEdge.kEdge.sourceId = sourceVKNode.kNode._id;
	vkEdge.kEdge.targetId = targetVKNode.kNode._id;
	vkEdge = this.createEdge(vkEdge, callback);

	return vkEdge;
};

MapStructure.prototype.updateName = function(vkNode, newName){
	if(!this.mapService) return;

	vkNode.kNode.name = newName;
	var patch = {name:newName};
	this.updateNode(vkNode, MapStructure.UPDATE_NODE_NAME, patch);
};

/**
 * Updates node and propagates changes to the server
 *
 * **NOTE**: Since currently VKNode doesn't exist in a permanent sturage,
 * we need to migrate all relevant VKNode changes into KNode structure
 *
 * **NOTE**: Take care that this method updates the node on server too!
 * So be careful if it is called upon on SYNCING with a node already created
 * on other client (presenter)
 *
 * @function updateNode
 * @memberof knalledge.MapStructure#
 * @param {knalledge.VKNode} vkNode - node to update
 * @param {string} updateType - type of the update
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.updateNode = function(vkNode, updateType, change, callback) {
	var activeUserId = this.rimaService ?
		this.rimaService.getActiveUserId() :
		this.Plugins.puzzles.rima.config.rimaService.ANONYMOUS_USER_ID;

	if(!this.mapService) return;
	var patch = null;
	switch(updateType){
		case MapStructure.UPDATE_NODE_DIMENSIONS:
			if(! vkNode.kNode.visual) vkNode.kNode.visual = {};
			if('xM' in vkNode) vkNode.kNode.visual.xM = vkNode.xM;
			if('yM' in vkNode) vkNode.kNode.visual.yM = vkNode.yM;
			if('widthM' in vkNode) vkNode.kNode.visual.widthM = vkNode.widthM;
			if('heightM' in vkNode) vkNode.kNode.visual.heightM = vkNode.heightM;
			break;
		case MapStructure.UPDATE_NODE_VISUAL_OPEN:
			patch = {'visual':{'isOpen':change}};
			break;
		case knalledge.KNode.UPDATE_TYPE_VOTE:
			var iAmId = activeUserId;
			if(iAmId === undefined){return this;}

			if(vkNode.kNode.dataContent && vkNode.kNode.dataContent.ibis &&
				vkNode.kNode.dataContent.ibis.votes && iAmId in vkNode.kNode.dataContent.ibis.votes){
				//this user already had a vote so we're patching node with accumulated vote
				change += vkNode.kNode.dataContent.ibis.votes[iAmId];
			}
			patch = {dataContent:{ibis:{votes:{}}}};
			patch.dataContent.ibis.votes[iAmId] = change;
		break;
		case MapStructure.UPDATE_NODE_TYPE:
			patch = {type:change};
		break;
		case MapStructure.UPDATE_NODE_CREATOR:
			patch = {iAmId:change};
		break;
		case knalledge.KNode.DATA_CONTENT_RIMA_WHATS_DELETING:
			patch = {dataContent:{rima:{whats:{'_id':change}}}};
			//'dataContent.rima.whats'
		break;
		case knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING:
			patch = {dataContent:{rima:{whats:[change]}}};
		break;
		case MapStructure.UPDATE_DATA_CONTENT:
			break;
		case MapStructure.UPDATE_NODE_NAME:
		default:
			//everything is done already
			//or we have an unknown event, i.e. from a plugin, which has done already everything so we have just to forward the update call to mapService
			patch = change;
			break;
	}
	// calling the KnalledgeMapVOsService service
	// to update the node on the server
	// if patch === null, then we're doing complete update and not an differential one (patching)
	this.mapService.updateNode(vkNode.kNode, updateType, patch, callback);

	return this;
};

//TODO: should this be in the RIMA component or here?
/**
 * [function description]
 * @param  {[type]} vnode [description]
 * @return {[type]}       [description]
 */
MapStructure.prototype.nodeWhatsManagement = function(msg) {
	//{actionType:'what_deleted',node:$scope.node,what:whatId}
	//var actionType = '';
	switch (msg.actionType) {
		case 'what_deleted':
				this.updateNode(msg.node, knalledge.KNode.DATA_CONTENT_RIMA_WHATS_DELETING, msg.what);
		break;
		case 'what_added':
			this.updateNode(msg.node, knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING, msg.what);
		break;
	}
}

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

MapStructure.prototype.getVKNodeByVKId = function(id) {
	return this.nodesById[i];
};

MapStructure.prototype.getVKNodeByKId = function(kId) {
	if(kId === null){return null;}
	for(var i in this.nodesById){
		var vkNode = this.nodesById[i];
		if(vkNode.kNode._id == kId) {
			return vkNode;
		}
	}
	// TODO: This is now also a regular case when we check for pooling syncing updates from server
	// then we often get missing hit when the node is a new node
	try {
		throw new Error('myError');
	}
	catch(e) {
	// console.warn((new Error).lineNumber)
		console.warn('getVKNodeByKId found kNode.'+kId+' without encapsulating vkNode: \n' + e.stack);
		return null;
	}
};

MapStructure.prototype.getVKEdgeByKId = function(kId) {
	for(var i in this.edgesById){
		var vkEdge = this.edgesById[i];
		if(vkEdge.kEdge._id == kId) {
			return vkEdge;
		}
	}
	// TODO: This is now also a regular case when we check for pooling syncing updates from server
	// then we often get missing hit when the edge is a new edge
	try {
		throw new Error('myError');
	}
	catch(e) {
	// console.warn((new Error).lineNumber)
		console.warn('getVKEdgeByKId found kEdge.'+kId+' without encapsulating vkEdge: \n' + e.stack);
		return null;
	}
};

MapStructure.prototype.getVKEdgeByKIds = function(sourceKId, targetKId) {
	for(var i in this.edgesById){
		if(this.edgesById[i].kEdge.sourceId == sourceKId, this.edgesById[i].kEdge.targetKId == targetKId) return this.edgesById[i];
	}

	return null;
};

/**
 * Returns the list of nodes in the map
 *
 * @function getNodesList
 * @memberof knalledge.MapStructure#
 * @return {Array.<knalledge.VKNode>}
 */
MapStructure.prototype.getNodesList = function() {
	var nodes = [];
	for(var i in this.nodesById){
		nodes.push(this.nodesById[i]);
	}
	return nodes;
};

/**
 * Returns the list of edges in the map
 *
 * @function getEdgesList
 * @memberof knalledge.MapStructure#
 * @return {Array.<knalledge.VKEdge>}
 */
MapStructure.prototype.getEdgesList = function() {
	var edges = [];
	for(var i in this.edgesById){
		edges.push(this.edgesById[i]);
	}
	return edges;
};

/**
 * Process map data and populates internal structures (`nodesById`, `edgesById`, ...)
 *
 * @function processData
 * @memberof knalledge.MapStructure#
 * @param  {knalledge.knalledgeMap.knalledgeMapServices.MapData} kMapData - map data
 * @param  {number} [rootNodeX] - X coordinate of the root node
 * @param  {number} [rootNodeY] - Y coordinate of the root node
 * @param  {string} selectedKNodeId - default selected node
 * @return {knalledge.MapStructure}
 */
MapStructure.prototype.processData = function(kMapData, rootNodeX, rootNodeY, selectedKNodeId) {
	this.properties = kMapData.properties;
	var i=0;
	var kNode = null;
	var kEdge = null;
	// TODO: This doesn't smell well!?
	MapStructure.id = 0;

	// deleting all previous data
	// TODO: FIX: what about incremental updates
	this.nodesById = {};
	this.edgesById = {};

	// Iterates through all kNodes in the map data
	// and creates corresponding vkNodes
	// pulling vkNodes' parameters from kNode.visual
	// it puts vkNodes into this.nodesById
	for(var i=0; i<kMapData.map.nodes.length; i++){
		kNode = kMapData.map.nodes[i];
		if(!("isOpen" in kNode.visual)){
			kNode.visual.isOpen = false;
		}

		var vkNode = new knalledge.VKNode();
		vkNode.kNode = kNode;
		vkNode.isOpen = kNode.visual.isOpen;
		vkNode.size = kNode.visual.size;
		vkNode.xM = kNode.visual.xM;
		vkNode.yM = kNode.visual.yM;
		vkNode.widthM = kNode.visual.widthM;
		vkNode.heightM = kNode.visual.heightM;

		this.nodesById[vkNode.id] = vkNode;
	}

	// Iterates through all kEdges in the map data
	// and creates corresponding vkEdges
	// it puts vkNodes into this.edgesById
	for(i=0; i<kMapData.map.edges.length; i++){
		kEdge = kMapData.map.edges[i];
		var vkEdge = new knalledge.VKEdge();
		vkEdge.kEdge = kEdge;
		this.edgesById[vkEdge.id] = vkEdge;
	}

	// this.rootNode = this.nodesById[this.properties.rootNodeId];
	this.rootNode = this.getVKNodeByKId(
		kMapData.properties ? kMapData.properties.rootNodeId : null
	);
	if(this.rootNode !== null){
		if(typeof rootNodeX !== 'undefined') this.rootNode.x0 = rootNodeX;
		if(typeof rootNodeY !== 'undefined') this.rootNode.y0 = rootNodeY;
	}

	var selectedVKNode = null;
	if(selectedKNodeId){
		selectedVKNode = this.getVKNodeByKId(selectedKNodeId);
	}
	// sets the selectedNode to either selectedVKNode (if provided) or to the root node
	if(!selectedVKNode) selectedVKNode = this.rootNode;
	this.setSelectedNode(selectedVKNode);

	// this.clickNode(this.rootNode);
	// this.update(this.rootNode);

	return this;
};


MapStructure.prototype.getSubChildren = function(vkNode, depth, list) {
	if(typeof list === 'undefined'){
		list = [];
	}
	// this crashes uglification
	getSubChildren(vkNode, depth, list);
	return list;
};

/**
 * Processes synced data broadcasted from other the KnAllEdge client
 *
 * Based on the changes received it updates internal structures. For example in the case of deleting the node (`changes.event == 'node-deleted-to-visual'`), it deletes the node from the internal list of nodes.
 *
 * @function processSyncedData
 * @memberof knalledge.MapStructure#
 * @param {knalledge.knalledgeMap.knalledgeMapServices.MapChangesWithEvent} changes - changes that are received
 * @return {knalledge.MapStructure}
 */

// [21.05.15 11:40:07] Sinisa (лични): MapStructure.prototype.processSyncedData to radi, ona kreira novi node
// pa samo proveri da li vec ga imamo preko kNode._id
// [21.05.15 11:40:10] Sinisa (лични): i onda osvezi samo
MapStructure.prototype.processSyncedData = function(changes) {
	if(changes !== undefined){
		var i=0;
		var kNode = null;
		var kEdge = null;
		var syncedData = changes.changes;

		//var newestNode = this.selectedNode; //the node that has be changed the last (so that we can focus on it - as selectedNode)
		for(i=0; i<syncedData.nodes.length; i++){
			kNode = syncedData.nodes[i].node;
			// TODO: not necessart since we do it on the level of kNode already
			// resource.getChangesFromServer
			//		...
			// 		kNode.fill(changesKNode);
			// if(!("isOpen" in kNode.visual)){
			// 	kNode.visual.isOpen = false;
			// }

			var vkNode = this.getVKNodeByKId(kNode._id);
			if(changes.event == "node-deleted-to-visual"){
				/* this is delegated to broadcaster to send navigation message upon delete:
				//  var parent = this.getParentNodes(vkNode)[0]; //TODO see later when we have more parents, which to chose
				// if(parent){
				// 	newestNode = parent;
				// }
				*/

				if(vkNode){
					delete this.nodesById[vkNode.id];
				}
			}
			else{
				if(!vkNode){ // it is a new node not an updated one
					vkNode = new knalledge.VKNode();
					vkNode.fillWithKNode(kNode, true);
					this.nodesById[vkNode.id] = vkNode;
				}else{
					vkNode.fillWithKNode(kNode);
				}

				// if(newestNode === null || kNode.updatedAt > newestNode.kNode.updatedAt){
				// 	newestNode = vkNode;
				// }
			}
		}

		for(i=0; i<syncedData.edges.length; i++){
			kEdge = syncedData.edges[i].edge;
			var vkEdge = this.getVKEdgeByKId(kEdge._id);
			if(changes.event == "edge-deleted-to-visual"){
				if(vkEdge){
					delete this.edgesById[vkEdge.id];
				}
			}
			else{
				if(!vkEdge){ // it is a new edge not an updated one
					vkEdge = new knalledge.VKEdge();
					vkEdge.fillWithKEdge(kEdge, true);
					this.edgesById[vkEdge.id] = vkEdge;
				}else{
					vkEdge.fillWithKEdge(kEdge);
				}
			}
		}
		/* this is delegated to broadcaster to send navigation message upon delete:
		//we focus on the last changed node. It is used for next functions in calls. This is executed even when changes
		// are only upon edges, but is idempotent then, because of setting 'var newestNode = this.selectedNode'
		// if(this.knalledgeMapPolicyService.provider.config.broadcasting.receiveNavigation){
		// 	this.setSelectedNode(newestNode);
		// }
		// this.selectedNode = newestNode;
		*/
	}

	return this;
};

}()); // end of 'use strict';
