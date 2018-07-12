(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapLayoutGraph =  knalledge.MapLayoutGraph = function(mapStructure, collaboPluginsService, configNodes, configTree, upperApi, knalledgeState, knAllEdgeRealTimeService, knalledgeMapViewService, rimaService){
	this.construct("MapLayoutGraph", mapStructure, collaboPluginsService, configNodes, configTree, upperApi, knalledgeState, knAllEdgeRealTimeService, knalledgeMapViewService, rimaService);
	this.graph = null;
};

// TODO: the quickest solution until find the best and the most performance optimal solution
// Set up MapLayoutGraph to inherit from MapLayout
MapLayoutGraph.prototype = Object.create(knalledge.MapLayout.prototype);

MapLayoutGraph.prototype._super = function(){
	var thisP = Object.getPrototypeOf(this);
	var parentP = Object.getPrototypeOf(thisP);
	return parentP;
};

// MapLayoutGraph.prototype.getChildren = function(d){ //TODO: improve probably, not to compute array each time, but to update it upon changes
// 	var children = [];
// 	if(!d.isOpen) return children;

// 	for(var i in this.mapStructure.edgesById){
// 		var vkEdge = this.mapStructure.edgesById[i];
// 		if(vkEdge.kEdge.sourceId == d.kNode._id){
// 			var vkNode = this.mapStructure.getVKNodeByKId(vkEdge.kEdge.targetId);
// 			if(vkNode){
// 				children.push(vkNode);
// 			}
// 			else{
// 				console.warn('getChildren reached by edge.targetId a node that cannot be found');
// 			}
// 		}
// 	}
// 	return children;
// };

MapLayoutGraph.prototype.init = function(mapSize, scales){
	// this.dom = this.upperApi.getDom();
	this.scales = scales;
	this.scaleNodeSizes = null;
	this.scaleEdgeDistances = null;

	//this.tree = d3.layout.tree();
		// we invert x and y since tree grows to the right
	// if(this.configTree.sizing.setNodeSize){
	// 	this.tree.nodeSize([
	// 		this.configTree.sizing.nodeSize[1],
	// 		this.configTree.sizing.nodeSize[0]
	// 	]);
	// }else{
	// 	this.tree.size([mapSize[1], mapSize[0]]);
	// }

	//this.tree.children(this.getChildren.bind(this));

	// realtime listener registration
	/*
	var mapLayoutPluginOptions = {
		name: "mapLayout",
		events: {
		}
	};
	mapLayoutPluginOptions.events[MapLayout.KnRealTimeNodeSelectedEventName] = this.realTimeNodeSelected.bind(this);
	this.knAllEdgeRealTimeService.registerPlugin(mapLayoutPluginOptions);
	*/
};

// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal
// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal_projection
// https://www.dashingd3js.com/svg-paths-and-d3js
MapLayoutGraph.prototype.diagonal = function(that){
	var diagonalSource = function(d){
		//return d.source;
		// here we are creating object with just necessary parameters (x, y)
		var point = {x: d.source.x, y: d.source.y};

		point.x = that.scales.x(point.x);
		point.y = that.scales.y(point.y);
		if(!that.configNodes.punctual){
			// since our node is not just a punctual entity, but it has width, we need to adjust diagonals' source and target points
			// by shifting points from the center of node to the edges of node
			// we deal here with y-coordinates, because our final tree is rotated to propagete across the x-axis, instead of y-axis
			// (you can see that in .project() function
			if(d.source.y < d.target.y){
				var width = (d.source.kNode.dataContent && d.source.kNode.dataContent.image && d.source.kNode.dataContent.image.width) ?
					d.source.kNode.dataContent.image.width/2 : that.configNodes.html.dimensions.sizes.width/2;
				point.y += that.scales.width(width) + 0;
			}
		}
		return point;
	}.bind(that);

	var diagonalTarget = function(d){
		//return d.target;
		var point = {x: d.target.x, y: d.target.y};
		point.x = that.scales.x(point.x);
		point.y = that.scales.y(point.y);
		if(!that.configNodes.punctual){
			if(d.target.y > d.source.y){
				var width = (d.target.kNode.dataContent && d.target.kNode.dataContent.image && d.target.kNode.dataContent.image.width) ?
					d.target.kNode.dataContent.image.width/2 : that.configNodes.html.dimensions.sizes.width/2;
				point.y -= that.scales.width(width) + 0;
			}
		}
		return point;
	}.bind(that);
	var diagonal = d3.svg.diagonal()
	.source(diagonalSource)
	.target(diagonalTarget)
	// our final tree is rotated to propagete across the x-axis, instead of y-axis
	// therefor we are swapping x and y coordinates here
	.projection(function(d) {
		return [d.y, d.x];
	});
	return diagonal;
};

// MapLayoutGraph.prototype.getAllNodesHtml = function(){
// 	return this.dom.divMapHtml ? this.dom.divMapHtml.selectAll("div.node_graph_html") : null;
// };

// It calculates node size across all node edges (both visible and hidden)
// and updates node sizes
MapLayoutGraph.prototype.calculateNodeWeights = function(){
	var newighbourlinks, weightSum;

	if(!this.nodes || this.nodes.length<=0) return;

	this.nodeWeightSumMin = Number.MAX_VALUE;
	this.nodeWeightSumMax = Number.MIN_VALUE;
	for(var i=0; i<this.nodes.length; i++){
		var node = this.nodes[i];
		newighbourlinks = this.mapStructure.getChildrenEdges(node);
		weightSum = 0;
		for(var j=0; j<newighbourlinks.length; j++){
			weightSum += newighbourlinks[j].kEdge.value;
		}
		node.weightSum = weightSum;
		if(this.nodeWeightSumMin > weightSum) this.nodeWeightSumMin = weightSum;
		if(this.nodeWeightSumMax < weightSum) this.nodeWeightSumMax = weightSum;
	}

	this.updateNodeSizes();

};

// It finds the edge weights across all edges (both visible and hidden)
// and updates node sizes
MapLayoutGraph.prototype.findEdgeWeightsRange = function(){
	var newighbourlinks, weightSum;

	if(!this.links || this.links.length<=0) return;

	this.edgeWeightMin = Number.MAX_VALUE;
	this.edgeWeightMax = Number.MIN_VALUE;
	for(var i=0; i<this.links.length; i++){
		var edge = this.links[i].kEdge;
		if(this.edgeWeightMin > edge.value) this.edgeWeightMin = edge.value;
		if(this.edgeWeightMax < edge.value) this.edgeWeightMax = edge.value;
	}
};

// updates scale scaleNodeSizes in accordance to this.nodeWeightSumMin, this.nodeWeightSumMax
MapLayoutGraph.prototype.updateScaleNodeSizes = function(){
	var minSize = 5;
	var maxSize = 50;
	this.scaleNodeSizes = d3.scale.linear()
		.domain([this.nodeWeightSumMin, this.nodeWeightSumMax])
		.range([minSize, maxSize]);
};

// updates scale scaleEdgeDistances in accordance to this.edgeWeightMin, this.edgeWeightMax
MapLayoutGraph.prototype.updateScaleEdgeDistances = function(){
	this.findEdgeWeightsRange();
	var minDistance = 100;
	var maxDistance = 300;
	this.scaleEdgeDistances = d3.scale.linear()
		.domain([this.edgeWeightMin, this.edgeWeightMax])
		.range([maxDistance, minDistance]);
};

// It sets node size for all nodes (both visible and hidden)
// the smallest node will be set to minSize and biggest will be set to maxSize
MapLayoutGraph.prototype.updateNodeSizes = function(){
	this.updateScaleNodeSizes();

	for(var i=0; i<this.nodes.length; i++){
		var node = this.nodes[i];
		node.size = this.scaleNodeSizes(node.weightSum);
	}
};

// It sets edge distances for all edges (both visible and hidden)
// the most weighted edge will be set to minDistance and least distances will be set to maxDistance
MapLayoutGraph.prototype.updateEdgeDistances = function(){
	this.updateScaleEdgeDistances();

	for(var i=0; i<this.links.length; i++){
		var link = this.links[i];
		var edge = link.kEdge;
		link.distance = this.scaleEdgeDistances(edge.value);
	}
};

MapLayoutGraph.prototype.filterGraph = function(options){
	this._super().filterGraph.call(this, options);

	var nodesNew = [];
	var linksNew = [];

	switch(options.type){
	case "seeNode1Neighborhood":
		this.nodes = this.mapStructure.getNodesList(); //nodesById;
		this.links = this.mapStructure.getEdgesList(); //edgesById;

		/* filtering only nodes that are neighbours of the node. filtering only links that connect the node */
		var node1 = options.nodes[0];

		nodesNew = this.mapStructure.getChildrenNodes(node1);
		nodesNew.push(node1);

		linksNew = this.mapStructure.getChildrenEdges(node1);

		this.nodes = nodesNew;
		this.links = linksNew;

		var avoidOptions = {
			type: "cleanOutAvoidedNodesAndLinks"
		};
		this._super().filterGraph.call(this, avoidOptions);
		break;

	case "seeNode1Node2Neighborhood":
		this.nodes = this.mapStructure.getNodesList(); //nodesById;
		this.links = this.mapStructure.getEdgesList(); //edgesById;

		/* filtering only nodes that are mutual neighbours of 2 selected nodes. filtering only links that connect them */
		var node1 = options.nodes[0];
		var node2 = options.nodes[1];
		nodesNew.push(node1);
		nodesNew.push(node2);

		for (var i = 0; i < this.nodes.length; i++) {
			var neighbour = this.nodes[i];
			var neighbourPut = false;
			for (var k = 0; k < this.links.length; k++) {
				var link1 = this.links[k];
				var link1Put = false;
				if((link1.source == node2  && link1.target == node1) || (link1.target == node2 && link1.source == node1)){
					linksNew.push(link1); //connecting node1 & node2
				}
				if((link1.source == neighbour  && link1.target == node1) || (link1.target == neighbour && link1.source == node1)){
					for (var j = 0; j < this.links.length; j++) {
						var link2 = this.links[j];
						if((link2.source == neighbour  && link2.target == node2) || (link2.target == neighbour && link2.source == node2)){
							if(!neighbourPut){ //neighbour could be connected to node1 by multiple 'link1' links so we just want to put it once
								nodesNew.push(neighbour);
								neighbourPut = true;
							}
							if(!link1Put){ //node2 and neighbour could be connected by multiple 'link2' links so we just want to put it once
								linksNew.push(link1);
								link1Put = true;
							}
							linksNew.push(link2);
						}
					}
				}
			}
		}

		this.nodes = nodesNew;
		this.links = linksNew;

		var avoidOptions = {
			type: "cleanOutAvoidedNodesAndLinks"
		};
		this._super().filterGraph.call(this, avoidOptions);
		break;
	}
};

/**
 * @func generateGraph
 * - destroying structure of the old tree
- setting up VkNode
position and dimension
 */
MapLayoutGraph.prototype.generateGraph = function(source){
	this.nodes = this.mapStructure.getNodesList(); //nodesById;
	this.links = this.mapStructure.getEdgesList(); //edgesById;
	if(this.links === null || this.nodes == null){return;} //TODO: because of adding above two lines, it cannot be null

	var that = this;

	if(this.nodes.length==0){return;}

	// positions node
	for(var i =0; i<this.nodes.length; i++){
		var vkNode = this.nodes[i];
		if(!("x" in vkNode) || vkNode.x == undefined) vkNode.x = 0;
		if(!("y" in vkNode) || vkNode.y == undefined) vkNode.y = 0;
		if(!("x0" in vkNode) || vkNode.x0 == undefined) vkNode.x0 = 0;
		if(!("y0" in vkNode) || vkNode.y0 == undefined) vkNode.y0 = 0;
		if(!("px" in vkNode) || vkNode.px == undefined) vkNode.px = 0;
		if(!("py" in vkNode) || vkNode.py == undefined) vkNode.py = 0;
	}

	for(var i =0;i < this.links.length;i++){
		var vkEdge = this.links[i];
		vkEdge.source = this.mapStructure.getVKNodeByKId(vkEdge.kEdge.sourceId);
		vkEdge.target = this.mapStructure.getVKNodeByKId(vkEdge.kEdge.targetId);
	}

	var viewspec = this.configTree.viewspec;
	var sizes = this.configNodes.html.dimensions.sizes;

	// calculating node boundaries
	if(this.configTree.sizing.setNodeSize){
		this.MoveNodesToPositiveSpace(this.nodes);
	}

	// this.printTree(this.nodes);
};

// force graph for nodes and links in the graph
MapLayoutGraph.prototype.distribute = function() {
	var that = this;

	//this.links = []; //TODO remove
	var width = 960, height = 600; //TODO: set somewhere

	this.updateEdgeDistances();

	this.graph = d3.layout.force()
		.nodes(this.nodes) //.nodes(d3.values(this.nodes))
		.links(this.links)//.links(this.links)
		.size([width, height])
		// .linkDistance(300)
		.linkDistance(function(link, i){
			return link.distance;
		})
		.charge(-100);


	var tick = function () {
		// TODO: add updating nodes/edges positions
	};

	var ended = function() {
		that.upperApi.update();
	};

	this.graph
		.on("tick", tick)
		.on("end", ended)
		.start();

	// calculating node boundaries
	if(this.configTree.sizing.setNodeSize){
		this.MoveNodesToPositiveSpace(this.nodes);
	}
};

// stops force graph
MapLayoutGraph.prototype.stopDistribution = function() {
	if(this.graph) this.graph.stop();
}

MapLayoutGraph.prototype.printTree = function(nodes) {
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
			console.log("\tnode [%d] \"%s\": x:%s, y:%s, width:%s, height: %s)", i, name, node.x, node.y, node.width, node.height);
			if(node.x - height/2 < minX) minX = node.x - height/2;
			if(node.x + height/2 > maxX) maxX = node.x + height/2;
			if(node.y - width/2 < minY) minY = node.y - width/2;
			if(node.y + width/2 > maxY) maxY = node.y + width/2;
		}
		console.log("Dimensions: (minX: %s, maxX: %s, minY: %s, maxY: %s)", minX, maxX, minY, maxY);
	}
};

// ind maximal negative positions across all nodes and shift all nodes by that amount
MapLayoutGraph.prototype.MoveNodesToPositiveSpace = function(nodes) {
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
	this.upperApi.setDomSize(maxY, maxX);
};

}()); // end of 'use strict';
