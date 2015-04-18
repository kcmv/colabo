(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapLayout =  knalledge.MapLayout = function(structure, configNodes, configTree, mapVisualizationApi, knalledgeState){
	this.structure = structure;
	this.configNodes = configNodes;
	this.configTree = configTree;
	this.mapVisualizationApi = mapVisualizationApi;
	this.knalledgeState = knalledgeState;
	this.nodes = null;
	this.links = null;
	this.dom = null;
	this.tree = null;
};

MapLayout.prototype.getChildren = function(d){
	var children = [];
	if(!d.isOpen) return children;

	for(var i in this.structure.edgesById){
		if(this.structure.edgesById[i].kEdge.sourceId == d.kNode._id){
			var vkNode = this.structure.getVKNodeByKId(this.structure.edgesById[i].kEdge.targetId);
			children.push(vkNode);
		}
	}
	return children;
};

MapLayout.prototype.init = function(mapSize){
	this.dom = this.mapVisualizationApi.getDom();

	this.tree = d3.layout.tree()
		.size(mapSize);

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
		if(!that.configNodes.punctual){
			// since our node is not just a punctual entity, but it has width, we need to adjust diagonals' source and target points
			// by shifting points from the center of node to the edges of node
			// we deal here with y-coordinates, because our final tree is rotated to propagete across the x-axis, instead of y-axis
			// (you can see that in .project() function
			if(d.source.y < d.target.y){
				var width = (d.source.kNode.dataContent && d.source.kNode.dataContent.image && d.source.kNode.dataContent.image.width) ?
					d.source.kNode.dataContent.image.width/2 : that.configNodes.html.dimensions.sizes.width/2;
				point.y += width + 0;
			}
		}
		return point;
	}.bind(that);

	var diagonalTarget = function(d){
		//return d.target;
		var point = {x: d.target.x, y: d.target.y};
		if(!that.configNodes.punctual){
			if(d.target.y > d.source.y){
				var width = (d.target.kNode.dataContent && d.target.kNode.dataContent.image && d.target.kNode.dataContent.image.width) ?
					d.target.kNode.dataContent.image.width/2 : that.configNodes.html.dimensions.sizes.width/2;
				point.y -= width + 0;
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
MapLayout.prototype.clickNode = function(d) {
	// select clicked
	var isSelected = d.isSelected; //nodes previous state
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
		if(this.knalledgeState.addingLinkFrom !== null){
			this.structure.createEdge(this.knalledgeState.addingLinkFrom, d);
			this.knalledgeState.addingLinkFrom = null;
			this.mapVisualizationApi.update(this.structure.rootNode); //TODO: should we move it into this.structure.createEdge?
		}
	}
	//this.mapVisualizationApi.update(this.structure.rootNode);
};

// Toggle children on node double-click
MapLayout.prototype.clickDoubleNode = function(d) {
	this.structure.toggle(d);
	this.mapVisualizationApi.update(d);
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
	this.mapVisualizationApi.update(this.structure.rootNode);
};

MapLayout.prototype.processData = function() {
	this.clickNode(this.structure.rootNode);
	this.mapVisualizationApi.update(this.structure.rootNode);
};

MapLayout.prototype.generateTree = function(source){
	if(this.nodes){
		// Normalize for fixed-depth.
		this.nodes.forEach(function(d) {
			// Stash the old positions for transition.
		    if('x' in d) d.x0 = d.x;
		    if('y' in d) d.y0 = d.y;
		    if('width' in d) d.width0 = d.width;
		    if('height' in d) d.height0 = d.height;
		});
	}

	// Compute the new tree layout.
	this.nodes = this.tree.nodes(source).reverse();
	this.links = this.tree.links(this.nodes);

	// Normalize for fixed-depth.
	var viewspec = this.configTree.viewspec;
	var sizes = this.configNodes.html.dimensions.sizes;
	this.nodes.forEach(function(d) {
		d.y = d.depth * 300;

		if(d.parent && d.parent == "null"){
			d.parent = null;
		}

		if(viewspec == "viewspec_manual"){
			// update x and y to manual coordinates if present
			if(d.visual && d.visual.dimensions && d.visual.dimensions.sizes && "x" in d.visual.dimensions.sizes){
				d.x = d.visual.dimensions.sizes.x;
			}
			if(d.visual && d.visual.dimensions && d.visual.dimensions.sizes && "y" in d.visual.dimensions.sizes){
				d.y = d.visual.dimensions.sizes.y;
			}

			// update width and height to manual values if present
			if(d.visual && d.visual.dimensions && d.visual.dimensions.sizes && "width" in d.visual.dimensions.sizes){
				d.width = d.visual.dimensions.sizes.width;
			}else{
				d.width = sizes.width;
			}
			if(d.visual && d.visual.dimensions && d.visual.dimensions.sizes && "height" in d.visual.dimensions.sizes){
				d.height = d.visual.dimensions.sizes.height;
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