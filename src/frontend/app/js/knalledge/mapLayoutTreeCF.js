(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapLayoutTreeCF =  knalledge.MapLayoutTreeCF = function(mapStructure, collaboPluginsService, configNodes, configTree, upperApi, knalledgeState, knAllEdgeRealTimeService){
	this.construct('MapLayoutTree', mapStructure, collaboPluginsService, configNodes, configTree, upperApi, knalledgeState, knAllEdgeRealTimeService);
	this.tree = null;
	this.nodesPerDepth = [];
};

MapLayoutTreeCF.LAYOUT_ORIENTATION_HORIZONTAL = 0;
MapLayoutTreeCF.LAYOUT_ORIENTATION_VERTICAL = 1;

// TODO: the quickest solution until find the best and the most performance optimal solution
// Set up MapLayoutTreeCF to inherit from MapLayout
MapLayoutTreeCF.prototype = Object.create(knalledge.MapLayout.prototype);

MapLayoutTreeCF.prototype._super = function(){
	var thisP = Object.getPrototypeOf(this);
	var parentP = Object.getPrototypeOf(thisP);
	return parentP;
};

MapLayoutTreeCF.prototype.init = function(mapSize, scales){
	this.scales = scales;

	this.tree = d3.layout.tree();
		// we invert x and y since tree grows to the right
	if(this.configTree.sizing.setNodeSize){
		this.tree.nodeSize([
			this.configTree.sizing.nodeSize[1],
			this.configTree.sizing.nodeSize[0]
		]);
	}else{
		this.tree.size([mapSize[1], mapSize[0]]);
	}

	this.tree.children(this.getChildren.bind(this));
};

MapLayoutTreeCF.prototype.getChildren = function(d){ //TODO: improve probably, not to compute array each time, but to update it upon changes
	var children = [];
	if(d.isOpen === false) return children;

	// if(this.mapStructure.getSelectedNode() == d){
	// 	return children;
	// }

	for(var i in this.mapStructure.edgesById){
		var vkEdge = this.mapStructure.edgesById[i];
		// if defined and set to false the vkEdge and its vkNode should not be presented
		if(vkEdge.visible === false) continue;
		if(vkEdge.kEdge.sourceId === d.kNode._id){
			if(this.systemEdgeTypes.indexOf(vkEdge.kEdge.type) >= 0) continue;
			if(!this.showUnknownEdges && this.knownEdgeTypes.indexOf(vkEdge.kEdge.type) < 0) continue;

			var vkNode = this.mapStructure.getVKNodeByKId(vkEdge.kEdge.targetId);
			if(vkNode){ //vkNode can be null - e.g. when deleting node (e.g. when deleted from other client 'Presenter') and edge is still not deleted
				// if defined and set to false the vkNode should not be presented
				if(vkNode.visible === false) continue;
				if(this.mapStructure.isNodeVisible(vkNode)){
					children.push(vkNode);
				}
			}
			// else{
			// 	console.warn('getChildren reached by edge.targetId a node that cannot be found');
			// }
		}
	}
	return children;
};

/**
* Processes children position of a parent node that is already processed
* and it has a reference to its children, etc
*/
MapLayoutTreeCF.prototype.calculateChildrenPosition = function(parent){
	parent.children;
}

/* Initializes a specified depth (if not already initialized)
* of nodesPerDepth and populates it with initial children
*/
MapLayoutTreeCF.prototype.initNodesPerDepth = function(depth, children){
	if(this.nodesPerDepth.length <= depth){
		if(typeof children === 'undefined') children = [];
		this.nodesPerDepth[depth] = {
			nodes: children,
			childrenGroupsInfo: [],
			height: 0,
			width: 0
		};
	}
	return this.nodesPerDepth[depth];
}

/* Initializes a children group (if not already initialized)
* for the provided parent node and its children
*/
MapLayoutTreeCF.prototype.initParentsChildren = function(parent, children, depth){
	if(!parent || !parent.childrenInfo){
		if(typeof children === 'undefined') children = [];

		if(typeof depth === 'undefined' && parent) depth = parent.depth+1;

		var childrenInfo = {
			nodes: children,
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			parent: parent,
			depth: depth
		};
		if(parent){
			parent.children = children;
			parent.childrenInfo = childrenInfo;
			if(typeof depth === 'undefined') depth = parent.depth;
		}

		// we do not need to check if children group is already inside
		// since we are adding it only once when parent is initialized
		// with its initial children
		if(typeof depth !== 'undefined') this.nodesPerDepth[depth].childrenGroupsInfo.push(childrenInfo);
	}

	return childrenInfo;
}

// shifts down (down spread dimension, orthogonal to depth) by delta
// childrenGroupInfo and all children groups bellow it (at spread dimension)
MapLayoutTreeCF.prototype.shiftLaterSiblingGroups = function(childrenGroupInfo, delta){
	var childrenGroupsInfo = this.nodesPerDepth[childrenGroupInfo.depth].childrenGroupsInfo;
	var found = false;
	for(var cgI=0; cgI<childrenGroupsInfo.length; cgI++){
		var cg = childrenGroupsInfo[cgI];
		if(cg === childrenGroupInfo) found = true;
		if(found){
			if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_HORIZONTAL){
				cg.y += delta;
			}else if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_VERTICAL){
				cg.x += delta;
			}			
		}
	}
}

// shifts down (down spread dimension, orthogonal to depth) subtree of children group by delta
// it recursively shift all ancestors
// it also shift 
MapLayoutTreeCF.prototype.shiftSubtree = function(parentChildrenGroupInfo, delta){

	var childrenGroupsInfo = [parentChildrenGroupInfo];
	var childrenGroupsInfoNext = [];

	while(childrenGroupsInfo.length>0){
		this.shiftLaterSiblingGroups(childrenGroupsInfo[0], delta);

		for(var cgI=0; cgI<childrenGroupsInfo.length; cgI++){
			var childrenGroupInfo = childrenGroupsInfo[cgI];
			// finding all sub-groups
			for(var vkI=0; vkI<childrenGroupInfo.nodes.length; vkI++){
				var vkNode = childrenGroupInfo.nodes[vkI];
				if(vkNode.childrenInfo) childrenGroupsInfoNext.push(vkNode.childrenInfo);
			}
		}

		childrenGroupsInfo = childrenGroupsInfoNext;
		childrenGroupsInfoNext = [];
	}
}

MapLayoutTreeCF.prototype.balanceTree = function(parentChildrenGroup){

	// 1. shift parentChildrenGroup
	// var childrenGroupsSpread = 0;
	// var childrenGroupsPosition = undefined;
	// for(var cI=0; cI<parentChildrenGroup.nodes.length; cI++){
	// 	var parentVkNode = parentChildrenGroup.nodes[cI];
	// 	if(parentVkNode.childrenInfo){
	// 		this.balanceTree(parentVkNode.childrenInfo);
	// 		if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_HORIZONTAL){
	// 			if(typeof childrenGroupsPosition === 'undefined') childrenGroupsPosition = parentVkNode.childrenInfo.y;
	// 			childrenGroupsSpread += parentVkNode.childrenInfo.height + this.configTree.childrenGroup.padding;
	// 		}else if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_VERTICAL){
	// 			if(typeof childrenGroupsPosition === 'undefined') childrenGroupsPosition = parentVkNode.childrenInfo.x;
	// 			childrenGroupsSpread += parentVkNode.childrenInfo.width + this.configTree.childrenGroup.padding;
	// 		}
	// 	}
	// }

	// // calculate parent shift
	// var delta;
	// if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_HORIZONTAL){
	// 	delta = childrenGroupsPosition + (childrenGroupsSpread - parentChildrenGroup.height)/2 // new position
	// 		- parentChildrenGroup.y; // current position
	// }else if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_VERTICAL){
	// 	delta = childrenGroupsPosition + (childrenGroupsSpread - parentChildrenGroup.width)/2 // new position
	// 		- parentChildrenGroup.x; // current position
	// }

	// if(delta>0) this.shiftLaterSiblingGroups(parentChildrenGroup, delta);


	// 2. shift children subtrees
	// for(var cI=0; cI<parentChildrenGroup.nodes.length; cI++){
	// 	var parentVkNode = parentChildrenGroup.nodes[cI];
	// 	if(parentVkNode.childrenInfo){
	// 		if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_HORIZONTAL){
	// 			delta = parentVkNode.y - (parentVkNode.childrenInfo.height - parentVkNode.height)/2 // new position
	// 				- parentVkNode.childrenInfo.y; // current position
	// 		}else if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_VERTICAL){
	// 			delta = parentVkNode.x - (parentVkNode.childrenInfo.width - parentVkNode.width)/2 // new position
	// 				- parentVkNode.childrenInfo.x; // current position
	// 		}
	// 		if(delta>0){
	// 			this.shiftSubtree(parentVkNode.childrenInfo, delta);
	// 		}
	// 	}
	// }
}

// We are generating VERTICAL-DOWN tree
MapLayoutTreeCF.prototype.generateNodes = function(source){
	var default_node_width = this.configNodes.html.dimensions.sizes.width;
	var default_node_space_width = this.configTree.sizing.nodeSize[0];
	var default_node_space_height = this.configTree.sizing.nodeSize[1];

	// each element of the array preset one depth containing an array of nodes
	// at that depth
	this.nodesPerDepth = [];
	this.initNodesPerDepth(0, [source]);
	var childrenInfo = this.initParentsChildren(undefined, [source], 0);

	// list of nodes that are returned as a set of nodes in the layout
	var nodes = [source];

	// an array of nodes that still have to be processed
	// (to avoid recursion)
	var nodesToProcess = [];
	source.x = 0;
	source.y = 0;
	source.processed = true;
	source.depth = 0;
	childrenInfo.x = 0;
	childrenInfo.y = 0;
	childrenInfo.width = default_node_space_width;
	childrenInfo.height = default_node_space_height;

	/*********************************************
	 * Building
	 * - tree layout
	 * - relationship between parent and children
	 * - relationship between children and their relative position
	 *	inside the children group
	 *********************************************/
	var xForNode = 0; // x position of the next processed node
	var yForNode = 0; // y position of the next processed node

	var parent = source;
	do{
		var nodesPerDepth = this.initNodesPerDepth(parent.depth + 1);
		if(typeof parent.width === 'undefined') parent.width = default_node_width;
		if(typeof parent.height === 'undefined') parent.height = default_node_space_height;


		var children = this.getChildren(parent);
		if(children && children.length>0){
			childrenInfo = this.initParentsChildren(parent, children);

			// we reset positions for each children group
			xForNode = 0;
			yForNode = 0;

			for(var cI=0; cI < children.length; cI++){
				var vkNode = children[cI];
				if(!vkNode.processed){
					vkNode.processed = true;

					vkNode.x = xForNode;
					vkNode.y = yForNode;
					vkNode.parent = parent;
					vkNode.depth = parent.depth + 1;

					nodes.push(vkNode);
					nodesToProcess.push(vkNode);
					this.nodesPerDepth[vkNode.depth].nodes.push(vkNode);

					if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_HORIZONTAL){
						// yForNode += vkNode.height ? vkNode.height : default_node_space_height;
						yForNode += default_node_space_height;
					}else if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_VERTICAL){
						// xForNode += vkNode.width ? vkNode.width : default_node_space_width;
						xForNode += default_node_space_width;
					}
				}
			}

			// set children group info
			childrenInfo.width = xForNode;
			childrenInfo.height = yForNode;

			if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_HORIZONTAL){
				// the whole column width is not calculated
				childrenInfo.width += default_node_space_width;
			}else if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_VERTICAL){
				// the whole row height is not calculated
				childrenInfo.height += default_node_space_height;
			}
		}
	}while(parent = nodesToProcess.shift());

	/*********************************************
	 * Positioning
	 * - nodes
	 * 
	 * We assume that nodes' widths and heights are already preset.
	 * If not we are taking default values
	 *********************************************/

	/* NOTE: It works with fixed (max-)width nodes only
	 * calculating absolute node positions
	 * propagating relative positions in the relationship to parent of parent, ...
	 */
	var xForGroup = 0; // x position of the next processed group of children (siblings)
	var yForGroup = 0; // y position of the next processed group of children (siblings)

	this.cleanNodeProcessing();

	// iterate through each level of depth
	for(var depth = 0; depth < this.nodesPerDepth.length; depth++){
		var nodesOnDepth = this.nodesPerDepth[depth];

		// iterate through each children group on a specific depth
		// and calculate total spread ("width") of all nodes at that depth

		// "width" of processing depth (it is width if tree is vertical, or height if tree is horizontal)
		var spreadAtDepth = 0;
		for(var cI = 0; cI < nodesOnDepth.childrenGroupsInfo.length; cI++){
			var childrenGroupInfo = nodesOnDepth.childrenGroupsInfo[cI];

			if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_HORIZONTAL){
				spreadAtDepth += childrenGroupInfo.height;
			}else if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_VERTICAL){
				// the whole row height is not calculated
				spreadAtDepth += childrenGroupInfo.width;
			}

			spreadAtDepth += this.configTree.childrenGroup.padding;
		}

		if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_HORIZONTAL){
			yForGroup = -spreadAtDepth/2;
		}else if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_VERTICAL){
			xForGroup = -spreadAtDepth/2;
		}

		// iterate through each children group on a specific depth
		// and position each group in relationship to other groups at the same level
		for(var cI = 0; cI < nodesOnDepth.childrenGroupsInfo.length; cI++){
			var childrenGroupInfo = nodesOnDepth.childrenGroupsInfo[cI];

			childrenGroupInfo.x = xForGroup;
			childrenGroupInfo.y = yForGroup;

			if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_HORIZONTAL){
				yForGroup += childrenGroupInfo.height + this.configTree.childrenGroup.padding;
			}else if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_VERTICAL){
				xForGroup += childrenGroupInfo.width + this.configTree.childrenGroup.padding;
			}
		}

		if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_HORIZONTAL){
			xForGroup += default_node_space_width + this.configTree.depth.padding;
		}else if(this.treeOrientation === MapLayoutTreeCF.LAYOUT_ORIENTATION_VERTICAL){
			yForGroup += default_node_space_height + this.configTree.depth.padding;
		}
	}

	this.balanceTree(this.nodesPerDepth[0].childrenGroupsInfo[0]);

	var xForGroupMax = Number.MIN_SAFE_INTEGER;
	var yForGroupMax = Number.MIN_SAFE_INTEGER;
	var xForGroupMin = Number.MAX_SAFE_INTEGER;
	var yForGroupMin = Number.MAX_SAFE_INTEGER;
	// iterate through each level of depth
	for(var depth = 0; depth < this.nodesPerDepth.length; depth++){
		var nodesOnDepth = this.nodesPerDepth[depth];


		// iterate through each children group on a specific depth
		// and position each node in the group at its absolute position
		for(var cI = 0; cI < nodesOnDepth.childrenGroupsInfo.length; cI++){
			var childrenGroupInfo = nodesOnDepth.childrenGroupsInfo[cI];

			for(var nI = 0; nI < childrenGroupInfo.nodes.length; nI++){
				var vkNode = childrenGroupInfo.nodes[nI];
				vkNode.x = childrenGroupInfo.x + vkNode.x;
				vkNode.y = childrenGroupInfo.y + vkNode.y;
			}
		}

		if(nodesOnDepth.childrenGroupsInfo && nodesOnDepth.childrenGroupsInfo.length>0){
			// finding minmax of the map at the specific depth
			var childrenGroupInfoFirst = nodesOnDepth.childrenGroupsInfo[0];
			var childrenGroupInfoLast = nodesOnDepth.childrenGroupsInfo[nodesOnDepth.childrenGroupsInfo.length-1];

			yForGroup += childrenGroupInfo.height + this.configTree.childrenGroup.padding;
			xForGroup += default_node_space_width + this.configTree.depth.padding;

			if(childrenGroupInfoFirst.x<xForGroupMin) xForGroupMin = childrenGroupInfoFirst.x;
			if(childrenGroupInfoFirst.y<yForGroupMin) yForGroupMin = childrenGroupInfoFirst.y;
			if(childrenGroupInfoLast.x+childrenGroupInfoLast.width > xForGroupMax)
				xForGroupMax = childrenGroupInfoLast.x+childrenGroupInfoLast.width;
			if(childrenGroupInfoLast.y+childrenGroupInfoLast.height > yForGroupMax)
				yForGroupMax = childrenGroupInfoLast.y+childrenGroupInfoLast.height;			
		}
	}

	// move nodes to positions >= 0
	var deltaX = -xForGroupMin;
	var deltaY = -yForGroupMin;
	this.shiftNodes(nodes, deltaX, deltaY);

	return nodes;

};

MapLayoutTreeCF.prototype.shiftNodes = function(nodes, deltaX, deltaY){
	console.log("[MapLayoutTreeCF.shiftNodes] Shifting nodes for deltaX:%s, deltaY:%s", deltaX, deltaY);
	for(var nI = 0; nI < nodes.length; nI++){
		var vkNode = nodes[nI];
		vkNode.x += deltaX;
		vkNode.y += deltaY;
	}

	return nodes;
};


MapLayoutTreeCF.prototype.generateLinks = function(nodes){
	var links = this.tree.links(nodes);
	return links;
};

MapLayoutTreeCF.prototype.cleanNodeProcessing = function(nodes){
	if(this.nodes){
		for(var i=0; i<this.nodes.length; i++){
			delete this.nodes[i].processed;
		};
	}
}

/**
 * @func generateTree
 * - destroying structure of the old tree
- setting up VkNode
position and dimension
*/
MapLayoutTreeCF.prototype.generateTree = function(source){
	//this.mapStructure.setVisibilityByDistance(this.mapStructure.getSelectedNode(), 2);
	var that = this;
	if(this.nodes){
		// Normalize for fixed-depth.
		this.nodes.forEach(function(d) {
			// Stash the old positions for transition.
		    if('x' in d) d.x0 = d.x;
		    if('y' in d) d.y0 = d.y;
		    if('width' in d) d.width0 = d.width;
		    if('height' in d) d.height0 = d.height;

		    delete d.parent;
		    delete d.childrenInfo;
		    delete d.children;
		    delete d.depth;
			delete d.processed;
		});
	}

	if(source){
		// Compute the new tree layout.
		this.nodes = this.generateNodes(source);
		this.links = this.generateLinks(this.nodes);

		//links are D3.tree-generated objects of type Object: {source, target}
		for(var i in this.links){
			var link = this.links[i];
			var edges = this.mapStructure.getEdgesBetweenNodes(link.source.kNode, link.target.kNode);
			if(edges && edges[0]){
				link.vkEdge = edges[0]; //TODO: see what will happen when we have more links between two nodes
			}
		}

		// calculating node boundaries
		if(this.configTree.sizing.setNodeSize){
			this.MoveNodesToPositiveSpace(this.nodes);
		}

		var viewspec = this.configTree.viewspec;
		var sizes = this.configNodes.html.dimensions.sizes;
		this.nodes.forEach(function(d) {
			// Normalize for fixed-depth.
			if(that.configTree.fixedDepth.enabled){
				var levelDepth = 300;
				if(that.configTree.fixedDepth.levelDepth) levelDepth = that.configTree.fixedDepth.levelDepth;
				d.y = d.depth * levelDepth;
			}

			if(d.parent && d.parent == "null"){
				d.parent = null;
			}

			if(viewspec == "viewspec_manual"){
				// update x and y to manual coordinates if present
				if('xM' in d && typeof d.xM !== 'undefined' &&  !isNaN(d.xM)){
					d.x = d.xM;
				}
				if('yM' in d && typeof d.yM !== 'undefined' &&  !isNaN(d.yM)){
					d.y = d.yM;
				}

				// update width and height to manual values if present
				if('widthM' in d && typeof d.widthM !== 'undefined' &&  !isNaN(d.widthM)){
					d.width = d.widthM;
				}else{
					d.width = sizes.width;
				}
				if('heightM' in d && typeof d.heightM !== 'undefined' &&  !isNaN(d.heightM)){
					d.height = d.heightM;
				}else{
					d.height = sizes.height;
				}

				// make it sure that x0 and y0 exist for newly entered nodes
				if(!("x0" in d) || !("y0" in d)){
					d.x0 = d.x;
					d.y0 = d.y;
				}
				// make it sure that width0 and height0 exist for newly entered nodes
				if(!("width0" in d)){
					d.width0 = d.width;
				}
				if(!("height0" in d)){
					d.height0 = d.height;
				}
			}
		});
	}else{
		this.nodes = [];
		this.links = [];
	}
	// this.printTree(this.nodes);
};

// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal
// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal_projection
// https://www.dashingd3js.com/svg-paths-and-d3js
MapLayoutTreeCF.prototype.diagonal = function(that, isShowingFullSizeImage){
	var diagonalSource = function(d){
		//return d.source;
		// here we are creating object with just necessary parameters (x, y)
		var point = {x: d.source.x, y: d.source.y};

		point.x = that.scales.x(point.x);
		point.y = that.scales.y(point.y);
		if(!that.configNodes.punctual){
			// since our node is not just a punctual entity, but it has width, 
			// we need to adjust diagonals' source and target points
			// by shifting points from the center of node to the edges of node
			if(d.source.x < d.target.x){
				var width = (isShowingFullSizeImage(d)) ?
					d.source.kNode.dataContent.image.width/2 : 
					that.configNodes.html.dimensions.sizes.width/2;
				point.x += that.scales.width(width) + 0;
			}
		}
		// temporary inversion to make it visually nicer
		return {x: point.y, y: point.x};
		// return point;
	}.bind(that);

	var diagonalTarget = function(d){
		//return d.target;
		var point = {x: d.target.x, y: d.target.y};
		point.x = that.scales.x(point.x);
		point.y = that.scales.y(point.y);
		if(!that.configNodes.punctual){
			if(d.target.x > d.source.x){
				var width = (isShowingFullSizeImage(d)) ?
					d.target.kNode.dataContent.image.width/2 : 
					that.configNodes.html.dimensions.sizes.width/2;
				point.x -= that.scales.width(width) + 0;
			}
		}
		// temporary inversion to make it visually nicer
		return {x: point.y, y: point.x};
		// return point;
	}.bind(that);

	var diagonal = d3.svg.diagonal()
	.source(diagonalSource)
	.target(diagonalTarget)
	// temporary inversion to make it visually nicer
	.projection(function(d) {
		return [d.y, d.x];
	});
	return diagonal;
};

MapLayoutTreeCF.prototype.printTree = function(nodes) {
	//TODO: should have print only in Debug mode (for performance reason)
	var minX = 0, maxX = 0, minY = 0, maxY = 0;
	if(nodes){
		console.log("%d nodes", nodes.length);
	}else{
		console.log("nodes are null");
	}

	if(nodes && nodes.length>0){
		for(var i=0; i<nodes.length; i++){
			var node = nodes[i];
			var height = ('height' in node) ? node.height : 0;
			var width = ('width' in node) ? node.width : 0;
			var name = node.kNode ? node.kNode.name : "(no name)";
			//console.log("\tnode [%d] \"%s\": x:%s, y:%s, width:%s, height: %s)", i, name, node.x, node.y, node.width, node.height);
			if(node.x - height/2 < minX) minX = node.x - height/2;
			if(node.x + height/2 > maxX) maxX = node.x + height/2;
			if(node.y - width/2 < minY) minY = node.y - width/2;
			if(node.y + width/2 > maxY) maxY = node.y + width/2;
		}
		console.log("Dimensions: (minX: %s, maxX: %s, minY: %s, maxY: %s)", minX, maxX, minY, maxY);
	}
};

MapLayoutTreeCF.prototype.MoveNodesToPositiveSpace = function(nodes) {
	var minX = 0, maxX = 0, minY = 0, maxY = 0;
	var node;
	for(var i in nodes){
		node = nodes[i];
		var height = ('height' in node) ? node.height : 0;
		var width = ('width' in node) ? node.width : 0;
		if(node.x - height/2 < minX) minX = node.x - height/2;
		if(node.x + height/2 > maxX) maxX = node.x + height/2;
		if(node.y - width/2 < minY) minY = node.y - width/2;
		if(node.y + width/2 > maxY) maxY = node.y + width/2;
	}
	console.log("Dimensions: (minX: %s, maxX: %s, minY: %s, maxY: %s)", minX, maxX, minY, maxY);
	for(i in nodes){
		node = nodes[i];
		node.x += -minX + this.configTree.margin.top;
		node.y += -minY + this.configTree.margin.left;
	}
	maxX += -minX + this.configTree.margin.bottom;
	maxY += -minY + this.configTree.margin.right;
	this.upperApi.setDomSize(maxX, maxY);
};

}()); // end of 'use strict';
