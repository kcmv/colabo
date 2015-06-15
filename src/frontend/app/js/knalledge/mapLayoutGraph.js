(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapLayoutGraph =  knalledge.MapLayoutGraph = function(mapStructure, configNodes, configTree, clientApi, knalledgeState, knAllEdgeRealTimeService){
	this.construct(mapStructure, configNodes, configTree, clientApi, knalledgeState, knAllEdgeRealTimeService);
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
	this.dom = this.clientApi.getDom();
	this.scales = scales;

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
	var mapLayoutPluginOptions = {
		name: "mapLayout",
		events: {
		}
	};
	mapLayoutPluginOptions.events[MapLayoutGraph.KnRealTimeNodeSelectedEventName] = this.realTimeNodeSelected.bind(this);
	this.knAllEdgeRealTimeService.registerPlugin(mapLayoutPluginOptions);
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

MapLayoutGraph.prototype.getAllNodesHtml = function(){
	return this.dom.divMapHtml.selectAll("div.node_graph_html");
};

/**
 * @func generateGraph
 * - destroying structure of the old tree
- setting up VkNode
position and dimension
 */
MapLayoutGraph.prototype.generateGraph = function(source){
	this.nodes = this.mapStructure.getNodesList(); //nodesById;
	this.links = this.mapStructure.getEdgesList();//edgesById;
	if(this.links === null || this.nodes == null){return;} //TODO: because of adding above two lines, it cannot be null

	var that = this;
	// if(this.nodes){
	// 	// Normalize for fixed-depth.
	// 	this.nodes.forEach(function(d) {
	// 		// Stash the old positions for transition.
	// 	    if('x' in d) d.x0 = d.x;
	// 	    if('y' in d) d.y0 = d.y;
	// 	    if('width' in d) d.width0 = d.width;
	// 	    if('height' in d) d.height0 = d.height;

	// 	    delete d.parent;
	// 	    delete d.children;
	// 	    delete d.depth;
	// 	});
	// }

	var width = 960, height = 600; //TODO: set somewhere

	if(this.nodes.length==0){return;}

	for(var i =0;i < this.links.length;i++){
		var vkEdge = this.links[i];
		vkEdge.source = this.mapStructure.getVKNodeByKId(vkEdge.kEdge.sourceId);
		vkEdge.target = this.mapStructure.getVKNodeByKId(vkEdge.kEdge.targetId);
	}


	//TODO: remove: just for test: 
	if(this.nodes.length<2){return;} var opions = {mutualNeghbours:[this.nodes[0],this.nodes[1]]};
	
	/* filtering only nodes that are mutual neighbours of 2 selected nodes. filtering only links that connect them */
	if((typeof opions !== "undefined" && opions !==null) && (opions.mutualNeghbours !== null && typeof opions.mutualNeghbours !== "undefined")){
		var node1 = opions.mutualNeghbours[0];
		var node2 = opions.mutualNeghbours[1];
		var nodesNew = [node1,node2];
		var linksNew = [];
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
			};
		}
		this.nodes = nodesNew;
		this.links = linksNew;
	}

	//this.links = []; //TODO remove
	this.graph = d3.layout.force()
		.nodes(this.nodes) //.nodes(d3.values(this.nodes))
		.links(this.links)//.links(this.links)
		.size([width, height])
		.linkDistance(300)
		.charge(-100);

	/*
	var svg = d3.select("div.users-graph").append("svg")
			.attr("width", width)
			.attr("height", height);

	var nodeSvg = svg.selectAll(".node")
		.data(this.nodes)
	  .enter().append("g")
		.attr("class", "node")
		.call(this.graph.drag);

	// add the nodes
	nodeSvg.append("circle")
		.attr("r", 5);

	// add the text 
	nodeSvg.append("text")
		.attr("x", 12)
		.attr("dy", ".35em")
		.text(function(d) { return d.name; });

	function tick(){
		console.log('tick');
		nodeSvg
			.attr("transform", function(d) { 
			return "translate(" + d.x + "," + d.y + ")"; });
	}
	*/

	this.graph
		//.on("tick", tick)
		.start();

	// nodeSvg = svg.selectAll(".node")
	// 	.data(force.nodes())
	//   .enter().append("g")
	// 	.attr("class", "node")
	// 	.call(force.drag);


	//if(source){
	// Compute the new tree layout.
	// this.nodes = this.tree.nodes(source).reverse();
	// this.links = this.tree.links(this.nodes);
	
	//links are D3.tree-generated objects of type Object: {source, target}

	// TODO: This is currently not supported with dr.layout.force() since it doesn't create links (with source/targer)
	// for(var i = 0;i<this.links.length; i++){
	// 	var link = this.links[i];
	// 	var edges = this.mapStructure.getEdgesBetweenNodes(link.source.kNode, link.target.kNode);
	// 	if(edges && edges[0]){
	// 		link.vkEdge = edges[0]; //TODO: see what will happen when we have more links between two nodes
	// 	}
	// }

	// calculating node boundaries
	if(this.configTree.sizing.setNodeSize){
		this.MoveNodesToPositiveSpace(this.nodes);
	}

	var viewspec = this.configTree.viewspec;
	var sizes = this.configNodes.html.dimensions.sizes;

	// 	this.nodes.forEach(function(d) {
	// 		// Normalize for fixed-depth.
	// 		if(that.configTree.fixedDepth.enabled){
	// 			var levelDepth = 300;
	// 			if(that.configTree.fixedDepth.levelDepth) levelDepth = that.configTree.fixedDepth.levelDepth;
	// 			d.y = d.depth * levelDepth;
	// 		}

	// 		if(d.parent && d.parent == "null"){
	// 			d.parent = null;
	// 		}

	// 		if(viewspec == "viewspec_manual"){
	// 			// update x and y to manual coordinates if present
	// 			if('xM' in d && typeof d.xM !== 'undefined' &&  !isNaN(d.xM)){
	// 				d.x = d.xM;
	// 			}
	// 			if('yM' in d && typeof d.yM !== 'undefined' &&  !isNaN(d.yM)){
	// 				d.y = d.yM;
	// 			}

	// 			// update width and height to manual values if present
	// 			if('widthM' in d && typeof d.widthM !== 'undefined' &&  !isNaN(d.widthM)){
	// 				d.width = d.widthM;
	// 			}else{
	// 				d.width = sizes.width;
	// 			}
	// 			if('heightM' in d && typeof d.heightM !== 'undefined' &&  !isNaN(d.heightM)){
	// 				d.height = d.heightM;
	// 			}else{
	// 				d.height = sizes.height;
	// 			}

	// 			// make it sure that x0 and y0 exist for newly entered nodes
	// 			if(!("x0" in d) || !("y0" in d)){
	// 				d.x0 = d.x;
	// 				d.y0 = d.y;
	// 			}
	// 			// make it sure that width0 and height0 exist for newly entered nodes
	// 			if(!("width0" in d)){
	// 				d.width0 = d.width;
	// 			}
	// 			if(!("height0" in d)){
	// 				d.height0 = d.height;
	// 			}
	// 		}
	// 	});
	//}
	//else{
	// 	this.nodes = [];
	// 	this.links = [];
	// }
	this.printTree(this.nodes);
};

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
	this.clientApi.setDomSize(maxY, maxX);
};

}()); // end of 'use strict';