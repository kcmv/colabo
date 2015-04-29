(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapLayout =  knalledge.MapLayout = function(structure, configNodes, configTree, clientApi, knalledgeState){
	this.structure = structure;
	this.configNodes = configNodes;
	this.configTree = configTree;
	this.clientApi = clientApi;
	this.knalledgeState = knalledgeState;
	this.nodes = null;
	this.links = null;
	this.dom = null;
	this.tree = null;
};

MapLayout.prototype.getChildren = function(d){ //TODO: improve probably, not to compute array each time, but to update it upon changes
	var children = [];
	if(!d.isOpen) return children;

	for(var i in this.structure.edgesById){
		var vkEdge = this.structure.edgesById[i];
		if(vkEdge.kEdge.sourceId == d.kNode._id){
			var vkNode = this.structure.getVKNodeByKId(vkEdge.kEdge.targetId);
			if(vkNode){
				children.push(vkNode);
			}
			else{
				console.warn('getChildren reached by edge.targetId a node that cannot be found');
			}
		}
	}
	return children;
};

MapLayout.prototype.init = function(mapSize, scales){
	this.dom = this.clientApi.getDom();
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

// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal
// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal_projection
// https://www.dashingd3js.com/svg-paths-and-d3js
MapLayout.prototype.diagonal = function(that){
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

MapLayout.prototype.getAllNodesHtml = function(){
	return this.dom.divMapHtml.selectAll("div.node_html");
};

// Returns view representation (dom) from datum d
MapLayout.prototype.getDomFromDatum = function(d) {
	var dom = this.getAllNodesHtml()
		.data([d], function(d){return d.id;});
	if(dom.size() != 1) return null;
	else return dom;
};

// Select node on node click
MapLayout.prototype.clickNode = function(d, dom) {
	// select clicked
	var isSelected = d.isSelected; //nodes previous state
	if(d.kNode.visual && !d.kNode.visual.selectable){
		return;
	}
	var nodesHtmlSelected = this.getDomFromDatum(d);
	if(!nodesHtmlSelected) return;

	// unselect all nodes
	var nodesHtml = this.getAllNodesHtml();
	nodesHtml.classed({
		"node_selected": false,
		"node_unselected": true
	});
	this.nodes.forEach(function(d){d.isSelected = false;});

	if(isSelected){//it was selected, and with this click it becomes unselected:
		d.isSelected = false;
		this.structure.unsetSelectedNode();
	}else{//it was unselected, and with this click it becomes selected:
		// var nodeHtml = nodesHtml[0];
		nodesHtmlSelected.classed({
			"node_selected": true,
			"node_unselected": false
		});
		d.isSelected = true;
		this.structure.setSelectedNode(d);
		this.clientApi.positionToDatum(d);
		if(this.knalledgeState.addingLinkFrom !== null){
			this.structure.createEdgeBetweenNodes(this.knalledgeState.addingLinkFrom, d);
			this.knalledgeState.addingLinkFrom = null;
			this.clientApi.update(this.structure.rootNode); //TODO: should we move it into this.structure.createEdge?
		}
	}
	this.clientApi.nodeClicked(this.structure.getSelectedNode(), dom);
	//this.clientApi.update(this.structure.rootNode);
};

// Toggle children on node double-click
MapLayout.prototype.clickDoubleNode = function(d) {
	this.structure.toggle(d);
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

MapLayout.prototype.viewspecChanged = function(target){
	if (target.value === "viewspec_tree") this.configTree.viewspec = "viewspec_tree";
	else if (target.value === "viewspec_manual") this.configTree.viewspec = "viewspec_manual";
	this.clientApi.update(this.structure.rootNode);
};

MapLayout.prototype.processData = function(callback) {
	this.clickNode(this.structure.rootNode);
	this.clientApi.update(this.structure.rootNode, callback);
};

/**
 * @func generateTree
 * - destroying structure of the old tree
- setting up VkNode
position and dimension
 */
MapLayout.prototype.generateTree = function(source){
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
		    delete d.children;
		    delete d.depth;
		});
	}

	// Compute the new tree layout.
	this.nodes = this.tree.nodes(source).reverse();
	this.links = this.tree.links(this.nodes);
	
	//links are D3.tree-generated objects of type Object: {source, target}
	for(var i in this.links){
		var link = this.links[i];
		var edges = this.structure.getEdgesBetweenNodes(link.source.kNode, link.target.kNode);
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
	this.printTree(this.nodes);
};

MapLayout.prototype.printTree = function(nodes) {
	var minX = 0, maxX = 0, minY = 0, maxY = 0;
	console.log("%d nodes", nodes.length);
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
};

MapLayout.prototype.MoveNodesToPositiveSpace = function(nodes) {
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