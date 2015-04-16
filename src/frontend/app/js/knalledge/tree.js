var TreeHtml = null;
var mapId = "552678e69ad190a642ad461c";

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var treeHtml;

treeHtml = TreeHtml = function(parentDom, config, dimensions, clientApi){
	this.parentDom = parentDom;
	this.config = config;
	this.dimensions = dimensions;
	this.clientApi = clientApi;

	this.rootNode = null;
	this.selectedNode = null;
	this.selectedNodeInTree = null;
	this.editingNodeHtml = null;
	this.nodes = null;
	this.links = null;
	this.nodesById = {};
	this.edgesById = {};
	this.properties = {};
	this.dom = {
		parentDom: parentDom,
		divMap: null,
		divMapHtml: null,
		divMapSvg: null,
		svg: null
	};

	// http://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element
	var mapSize = [parentDom.node().getBoundingClientRect().height, parentDom.node().getBoundingClientRect().width];
	// inverted since tree is rotated to be horizontal
	// related posts
	//	http://stackoverflow.com/questions/17847131/generate-multilevel-flare-json-data-format-from-flat-json
	//	http://stackoverflow.com/questions/20940854/how-to-load-data-from-an-internal-json-array-rather-than-from-an-external-resour
	this.tree = d3.layout.tree()
		.size(mapSize);

	this.tree.children(function(d){
		var children = [];
		if(!d.isOpen) return children;

		for(var i in this.edgesById){
			if(this.edgesById[i].sourceId == d._id){
				children.push(this.nodesById[this.edgesById[i].targetId]);
			}
		}
		return children;
	}.bind(this));
};

treeHtml.prototype.hasChildren = function(d){
	for(var i in this.edgesById){
		if(this.edgesById[i].sourceId == d._id){
			return true;
		}
	}
	return false;
};

treeHtml.prototype.getEdge = function(sourceId, targetId){
	for(var i in this.edgesById){
		if(this.edgesById[i].sourceId == sourceId && this.edgesById[i].targetId == targetId){
			return this.edgesById[i];
		}
	}
	return null;
};

// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal
// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal_projection
// https://www.dashingd3js.com/svg-paths-and-d3js
treeHtml.prototype.diagonal = function(that){
	var diagonalSource = function(d){
		//return d.source;
		// here we are creating object with just necessary parameters (x, y)
		var point = {x: d.source.x, y: d.source.y};
		if(!this.config.nodes.punctual){
			// since our node is not just a punctual entity, but it has width, we need to adjust diagonals' source and target points
			// by shifting points from the center of node to the edges of node
			// we deal here with y-coordinates, because our final tree is rotated to propagete across the x-axis, instead of y-axis
			// (you can see that in .project() function
			if(d.source.y < d.target.y){
				point.y += this.dimensions.node.width/2 + 0;
			}
		}
		return point;
	}.bind(that);

	var diagonalTarget = function(d){
		//return d.target;
		var point = {x: d.target.x, y: d.target.y};
		if(!this.config.nodes.punctual){
			if(d.target.y > d.source.y){
				point.y -= this.dimensions.node.width/2 + 0;
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

// collapses children of the provided node
treeHtml.prototype.collapse = function(d) {
	d.isOpen = false;
};

// toggle children of the provided node
treeHtml.prototype.toggle = function(d) {
	d.isOpen = !d.isOpen;
	return;
};

// Returns view representation (dom) from datum d
treeHtml.prototype.getDomFromDatum = function(d) {
	var dom = this.dom.divMapHtml.selectAll("div.node_html")
		.data([d], function(d){return d._id;});
	if(dom.size() != 1) return null;
	else return dom;
};

// Select node on node click
treeHtml.prototype.clickNode = function(d) {
	// select clicked
	var isSelected = d.isSelected;
	var nodesHtmlSelected = this.getDomFromDatum(d);
	if(!nodesHtmlSelected) return;

	// unselect all nodes
	var nodesHtml = this.dom.divMapHtml.selectAll("div.node_html");
	nodesHtml.classed({
		"node_selected": false,
		"node_unselected": true
	});
	this.nodes.forEach(function(d){d.isSelected = false;});

	if(isSelected){
		d.isSelected = false;
		this.selectedNode = null;
	}else{
		// var nodeHtml = nodesHtml[0];
		nodesHtmlSelected.classed({
			"node_selected": true,
			"node_unselected": false
		});
		d.isSelected = true;
		this.selectedNode = d;
	}
	//this.update(this.rootNode);
};

// Toggle children on node double-click
treeHtml.prototype.clickDoubleNode = function(d) {
	this.toggle(d);
	this.update(d);
};

// react on label click.
treeHtml.prototype.clickLinkLabel = function() {
	// console.log("Label clicked: " + JSON.stringify(d.target.name));

	// just as a click indicator
	if(d3.select(this).style("opacity") < 0.75){
		d3.select(this).style("opacity", 1.0);
	}else{
		d3.select(this).style("opacity", 0.5);
	}
};

treeHtml.prototype.init = function(){
	var that = this;

	this.dom.divMap = this.dom.parentDom.append("div")
		.attr("class", "div_map");

	if(this.config.nodes.html.show){
		this.dom.divMapHtml = this.dom.divMap.append("div")
			.attr("class", "div_map_html")
			.append("div")
				.attr("class", "html_content");
	}

	this.dom.divMapSvg = this.dom.divMap.append("div")
		.attr("class", "div_map_svg");

	this.dom.svg = this.dom.divMapSvg
		.append("svg")
			.append("g")
				.attr("class", "svg_content");

	this.initializeKeyboard();
	this.initializeManipulation();
	// listen on change of input radio buttons (tree, manual, ... viewspecs)
	d3.selectAll("input").on("change", function(){
		that.viewspecChanged(this);
	});
};

treeHtml.prototype.viewspecChanged = function(target){
	if (target.value === "viewspec_tree") this.config.tree.viewspec = "viewspec_tree";
	else if (target.value === "viewspec_manual") this.config.tree.viewspec = "viewspec_manual";
	this.update(this.rootNode);
};

treeHtml.prototype.load = function(filename){
	// load the external data
	var that = this;
	d3.json(filename, function(error, treeData) {
		that.processData(error, treeData);
	});
};

treeHtml.prototype.createNewNode = function() {
	var maxId = -1;
	for(var i in this.nodesById){
		if(maxId < this.nodesById[i]._id){
			maxId = this.nodesById[i]._id;
		}
	}
	
	var newNode = {
		"_id": maxId+1,
		"name": "name ...",
		"isOpen": false,
		"mapId": mapId
	};

	this.nodesById[newNode._id] = newNode;
	this.clientApi.createNode(); //saving on server service
	return newNode;
};

treeHtml.prototype.updateNode = function() {
	this.clientApi.updateNode(); //updating on server service
};

treeHtml.prototype.createNewEdge = function(startNodeId, endNodeId) {
	var maxId = -1;
	for(var i in this.edgesById){
		if(maxId < this.edgesById[i]._id){
			maxId = this.edgesById[i]._id;
		}
	}
	var newEdge = {
		"id": maxId+1,
		"name": "Hello Links",
		"sourceId": startNodeId,
		"targetId": endNodeId
	};

	this.edgesById[newEdge._id] = newEdge;

	return newEdge;
};

treeHtml.prototype.processData = function(error, treeData) {
	//this.properties = treeData.properties;
	var rootId = "55268521fb9a901e442172f9";
	var i=0;
	var node = null;
	var edge = null;
	for(i=0; i<treeData.nodes.length; i++){
		node = treeData.nodes[i];
		if(!("isOpen" in node)){
			node.isOpen = false;
		}
		this.nodesById[node._id] = node;
	}

	for(i=0; i<treeData.edges.length; i++){
		edge = treeData.edges[i];
		this.edgesById[edge._id] = edge;
	}

	// this.rootNode = this.nodesById[this.properties.rootNodeId];
	this.rootNode = this.nodesById[rootId];
	this.rootNode.x0 = this.parentDom.attr("height") / 2;
	this.rootNode.y0 = 0;

	this.selectedNode = this.rootNode;
	this.clickNode(this.rootNode);

	this.update(this.rootNode);
};

treeHtml.prototype.update = function(source, callback) {
	this.generateTree(this.rootNode);
	var nodeHtmlDatasets = this.updateHtml(source); // we need to update html nodes to calculate node heights in order to center them verticaly
	var that = this;
	window.setTimeout(function() {
		that.updateNodeDimensions();
		that.updateHtmlTransitions(source, nodeHtmlDatasets); // all transitions are put here to be in the same time-slot as links, labels, etc
		that.updateSvgNodes(source);
		that.updateLinks(source);
		that.updateLinkLabels(source);
		if(callback){
			callback();
		}
	}, 25);
};

treeHtml.prototype.generateTree = function(source){
	if(this.nodes){
		// Normalize for fixed-depth.
		this.nodes.forEach(function(d) {
			// Stash the old positions for transition.
		    d.x0 = d.x;
		    d.y0 = d.y;
		});
	}

	// Compute the new tree layout.
	this.nodes = this.tree.nodes(source).reverse();
	this.links = this.tree.links(this.nodes);

	// Normalize for fixed-depth.
	var viewspec = this.config.tree.viewspec;
	this.nodes.forEach(function(d) {
		d.y = d.depth * 300;
		if(d.parent && d.parent == "null"){
			d.parent = null;
		}

		if(viewspec == "viewspec_manual"){
			// update x and y to manual coordinates if present
			if("manualX" in d){
				d.x = d.manualX;
			}
			if("manualY" in d){
				d.y = d.manualY;
			}

			// make it sure that x0 and y0 exist for newly entered nodes
			if(!("x0" in d) || !("y0" in d)){
				d.x0 = d.x;
				d.y0 = d.y;
			}
		}
	});
};

treeHtml.prototype.getHtmlNodePosition = function(d) {
	var x = null;
	if(this.config.nodes.html.show){
		x = d.x - d.height/2;
	}else{
		x = d.x;
	}

	if (isNaN(x) || x === null){
		x = d.x;
	}
	return x;
};

treeHtml.prototype.updateHtml = function(source) {
	var that = this;
	if(!this.config.nodes.html.show) return;

	var nodeHtml = this.dom.divMapHtml.selectAll("div.node_html")
		.data(this.nodes, function(d) { return d._id; });

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var nodeHtmlEnter = nodeHtml.enter().append("div")
		.attr("class", "node_html node_unselected draggable")
		.on("dblclick", this.clickDoubleNode.bind(this))
		.on("click", this.clickNode.bind(this));

	// position node on enter at the source position
	// (it is either parent or another precessor)
	nodeHtmlEnter
		.style("left", function(d) {
			var y = null;
			if(that.config.transitions.enter.animate.position){
				if(that.config.transitions.enter.referToToggling){
					y = source.y0;
				}else{
					y = d.parent ? d.parent.y0 : d.y0;
				}
			}else{
				y = d.y;
			}
			return y + "px";
		})
		.style("top", function(d) {
			var x = null;
			if(that.config.transitions.enter.animate.position){
				if(that.config.transitions.enter.referToToggling){
					x = source.x0;
				}else{
					x = d.parent ? d.parent.x0 : d.x0;
				}
			}else{
				x = d.x;
			}
			// console.log("[nodeHtmlEnter] d: %s, x: %s", d.name, x);
			return x + "px";
		})
		.style("background-color", function(d) {
			return (!d.isOpen && that.hasChildren(d)) ? "#aaaaff" : "#ffffff";
		});

	nodeHtmlEnter
		.append("div")
			.attr("class", "node_status")
				.html(function(d){
					return d._id;
				});

	nodeHtmlEnter
		.append("div")
			.attr("class", "node_inner_html")
			.append("span")
				.html(function(d) {
					return d.name;
				});
			// .append("span")
			// 	.html(function(d) {
			// 		return "report: "+d.x+","+d.y;
			// 	})
			// .append("p")
			// 	.html(function(d) {
			// 		return "moving: ";
			// 	});

	if(this.config.transitions.enter.animate.opacity){
		nodeHtmlEnter
			.style("opacity", 1e-6);
	}

	var nodeHtmlDatasets = {
		elements: nodeHtml,
		enter: nodeHtmlEnter,
		exit: null
	};
	return nodeHtmlDatasets;
};

treeHtml.prototype.updateHtmlTransitions = function(source, nodeHtmlDatasets){
	if(!this.config.nodes.html.show) return;
	var that = this;

	var nodeHtml = nodeHtmlDatasets.elements;
	// var nodeHtmlEnter = nodeHtmlDatasets.enter;

	// var nodeHtml = divMapHtml.selectAll("div.node_html")
	// 	.data(nodes, function(d) { return d._id; });

	// Transition nodes to their new (final) position
	// it happens also for entering nodes (http://bl.ocks.org/mbostock/3900925)
	var nodeHtmlUpdate = nodeHtml;
	var nodeHtmlUpdateTransition = nodeHtmlUpdate;
	if(this.config.transitions.update.animate.position || this.config.transitions.update.animate.opacity){
		nodeHtmlUpdateTransition = nodeHtmlUpdate.transition()
			.duration(this.config.transitions.update.duration);
	}

	(this.config.transitions.update.animate.position ? nodeHtmlUpdateTransition : nodeHtmlUpdate)
		.style("left", function(d){
			return d.y + "px";
		})
		// .each("start", function(d){
		// 	console.log("[nodeHtmlUpdateTransition] STARTED: d: %s, xCurrent: %s", d.name, d3.select(this).style("top"));
		// })
		.style("top", function(d){
			var x = that.getHtmlNodePosition(d);
			// x = d.x;
			// console.log("[nodeHtmlUpdateTransition] d: %s, xCurrent: %s, xNew: %s", d.name, d3.select(this).style("top"), x);
			return x + "px";
		});

	if(this.config.transitions.update.animate.opacity){
		nodeHtmlUpdateTransition
			.style("opacity", 1.0);
	}

	nodeHtmlUpdateTransition
		.style("background-color", function(d) {
			return (!d.isOpen && that.hasChildren(d)) ? "#aaaaff" : "#ffffff";
		});

	// Transition exiting nodes
	var nodeHtmlExit = nodeHtml.exit();
	var nodeHtmlExitTransition = nodeHtmlExit;
	nodeHtmlExit.on("click", null);
	nodeHtmlExit.on("dblclick", null);

	if(this.config.transitions.exit.animate.position || this.config.transitions.exit.animate.opacity){
		nodeHtmlExitTransition = nodeHtmlExit.transition()
			.duration(this.config.transitions.exit.duration);
	}

	if(this.config.transitions.exit.animate.opacity){
		nodeHtmlExitTransition
			.style("opacity", 1e-6);
	}

	if(this.config.transitions.exit.animate.position){
		nodeHtmlExitTransition
			.style("left", function(d){
				// Transition nodes to the toggling node's new position
				if(that.config.transitions.exit.referToToggling){
					return source.y + "px";					
				}else{ // Transition nodes to the parent node's new position
					return (d.parent ? d.parent.y : d.y) + "px";
				}
			})
			.style("top", function(d){
				if(that.config.transitions.exit.referToToggling){
					return source.x + "px";
				}else{
					return (d.parent ? d.parent.x : d.x) + "px";
				}
			});
	}
	nodeHtmlExitTransition.remove();
};

treeHtml.prototype.updateNodeDimensions = function(){
	if(!this.config.nodes.html.show) return;
	// var that = this;

	this.dom.divMapHtml.selectAll("div.node_html").each(function(d) {
		// Get centroid(this.d)
		d.width = parseInt(d3.select(this).style("width"));
		d.height = parseInt(d3.select(this).style("height"));
		// d3.select(this).style("top", function(d) { 
		// 	return "" + that.getHtmlNodePosition(d) + "px";
		// })
	});
};

treeHtml.prototype.updateSvgNodes = function(source) {
	if(!this.config.nodes.svg.show) return;
	var that = this;

	// Declare the nodes, since there is no unique id we are creating one on the fly
	// not very smart with real data marshaling in/out :)
	var node = this.dom.svg.selectAll("g.node")
		.data(this.nodes, function(d) { return d._id; });

	// Enter the nodes
	// we create a group "g" that will contain both visual representation of a node (circle) and text
	var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		.style("opacity", function(){
			return that.config.transitions.enter.animate.opacity ? 1e-6 : 0.8;
		})
		.on("click", this.clickNode.bind(this))
		.on("dblclick", this.clickDoubleNode.bind(this))
		// Enter any new nodes at the parent's previous position.
		.attr("transform", function(d) {
			if(that.config.transitions.enter.animate.position){
				if(that.config.transitions.enter.referToToggling){
					return "translate(" + source.y0 + "," + source.x0 + ")";
				}else{
					if(d.parent){
						return "translate(" + d.parent.y0 + "," + d.parent.x0 + ")";						
					}else{
						return "translate(" + d.y0 + "," + d.x0 + ")";						
					}
				}
			}else{
				return "translate(" + d.y + "," + d.x + ")";
			}
		});
		// .attr("transform", function(d) { 
		//   // return "translate(0,0)";
		//   return "translate(" + d.y + "," + d.x + ")";
		// });

	// add visual representation of node
	nodeEnter.append("circle")
		// the center of the circle is positioned at the 0,0 coordinate
		.attr("r", 10)
		.style("fill", "#fff");

	var nodeEnterTransition;
	if(this.config.transitions.enter.animate.position || this.config.transitions.enter.animate.opacity){
		nodeEnterTransition = nodeEnter.transition()
			.duration(this.config.transitions.enter.duration);

		if(this.config.transitions.enter.animate.opacity){
			nodeEnterTransition
				.style("opacity", 1e-6);
		}
	}

	var nodeUpdate = node;
	var nodeUpdateTransition;
	if(this.config.transitions.update.animate.position || this.config.transitions.update.animate.opacity){
		nodeUpdateTransition = nodeUpdate.transition()
			.duration(this.config.transitions.update.duration);
	}
	// Transition nodes to their new position
	(this.config.transitions.update.animate.position ? nodeUpdateTransition : nodeUpdate)
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
	(this.config.transitions.update.animate.opacity ? nodeUpdateTransition : nodeUpdate)
			.style("opacity", 0.8);

	node.select("circle")
		.style("fill", function(d) { return (!d.isOpen && that.hasChildren(d)) ? "lightsteelblue" : "#ffffff"; });

	// Transition exiting nodes
	var nodeExit = node.exit();
	var nodeExitTransition;

	nodeExit.on("click", null);
	if(this.config.transitions.exit.animate.position || this.config.transitions.exit.animate.opacity){
		nodeExitTransition = nodeExit.transition()
			.duration(this.config.transitions.exit.duration);

		if(this.config.transitions.exit.animate.opacity){
			nodeExitTransition
				.style("opacity", 1e-6);
		}

		if(this.config.transitions.exit.animate.position){
			nodeExitTransition
				.attr("transform", function(d) {
					if(that.config.transitions.exit.referToToggling){
						return "translate(" + source.y + "," + source.x + ")";
					}else{
						if(d.parent){
							return "translate(" + d.parent.y + "," + d.parent.x + ")";							
						}else{
							return "translate(" + d.y + "," + d.x + ")";							
						}
					}
				});
		}
		nodeExitTransition
			.remove();
	}else{
		nodeExit
			.remove();
	}
};

treeHtml.prototype.updateLinkLabels = function(source) {
	if(!this.config.edges.labels.show) return;

	var that = this;

	var linkLabelHtml = this.dom.divMapHtml.selectAll("div.label_html")
	.data(this.links, function(d) {
		// there is only one incoming edge
		return d.target._id;
	});

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var linkLabelHtmlEnter = linkLabelHtml.enter().append("div")
		.attr("class", "label_html")
		// position node on enter at the source position
		// (it is either parent or another precessor)
		.on("click", this.clickLinkLabel.bind(this))
		.style("left", function(d) {
			var y;
			if(that.config.transitions.enter.animate.position){
				if(that.config.transitions.enter.referToToggling){
					y = source.y0;
				}else{
					y = d.source.y0;
				}
			}else{
				y = (d.source.y + d.target.y) / 2;
			}
			return y + "px";
		})
		.style("top", function(d) {
			var x;
			if(that.config.transitions.enter.animate.position){
				if(that.config.transitions.enter.referToToggling){
					x = source.x0;
				}else{
					x = d.source.x0;
				}
			}else{
				x = (d.source.x + d.target.x) / 2;
			}
			return x + "px";
		});

	linkLabelHtmlEnter
		.append("span")
			//.text("<span>Hello</span>");
			//.html("<span>Hello</span>");
			.html(function(d) {
				var edge = that.getEdge(d.source._id, d.target._id);
				return edge.name;
			});

	if(this.config.transitions.enter.animate.opacity){
		linkLabelHtmlEnter
			.style("opacity", 1e-6);
	}

	var linkLabelHtmlUpdate = linkLabelHtml;
	var linkLabelHtmlUpdateTransition = linkLabelHtmlUpdate;
	if(this.config.transitions.update.animate.position || this.config.transitions.update.animate.opacity){
		linkLabelHtmlUpdateTransition = linkLabelHtmlUpdate.transition()
			.duration(this.config.transitions.update.duration);
	}
	if(this.config.transitions.update.animate.position){
		linkLabelHtmlUpdateTransition
			.style("left", function(d){
				return ((d.source.y + d.target.y) / 2) + "px";
			})
			.style("top", function(d){
				return ((d.source.x + d.target.x) / 2) + "px";
			});
	}else{
		linkLabelHtmlUpdate
			.style("left", function(d){
				return ((d.source.y + d.target.y) / 2) + "px";
			})
			.style("top", function(d){
				return ((d.source.x + d.target.x) / 2) + "px";
			});
	}
	if(this.config.transitions.update.animate.opacity){
		linkLabelHtmlUpdateTransition
			.style("opacity", 1.0);
	}

	var linkLabelHtmlExit = linkLabelHtml.exit();
	var linkLabelHtmlExitTransition = linkLabelHtmlExit;
	linkLabelHtmlExit.on("click", null);
	if(this.config.transitions.exit.animate.position || this.config.transitions.exit.animate.opacity){
		linkLabelHtmlExitTransition = linkLabelHtmlExit.transition()
			.duration(this.config.transitions.exit.duration);

		if(this.config.transitions.exit.animate.position){
			linkLabelHtmlExitTransition
				.style("left", function(d) {
					var y = null;
					// Transition nodes to the toggling node's new position
					if(that.config.transitions.exit.referToToggling){
						y = source.y;					
					}else{ // Transition nodes to the parent node's new position
						y = d.source.y;
					}

					return y + "px";
				})
				.style("top", function(d) {
					var x = null;
					// Transition nodes to the toggling node's new position
					if(that.config.transitions.exit.referToToggling){
						x = source.x;					
					}else{ // Transition nodes to the parent node's new position
						x = d.source.x;
					}

					return x + "px";
				});
		}
		if(this.config.transitions.exit.animate.opacity){
			linkLabelHtmlExitTransition
				.style("opacity", 1e-6);
		}
	}
	linkLabelHtmlExitTransition
		.remove();
};

treeHtml.prototype.updateLinks = function(source) {
	if(!this.config.edges.show) return;

	var that = this;

	// Declare the links
	var link = this.dom.svg.selectAll("path.link")
	.data(this.links, function(d) {
		// there is only one incoming edge
		return d.target._id;
	});

	// Enter the links
	var linkEnter = link.enter().insert("path", "g")
		.attr("class", "link")
		// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
		// http://www.w3schools.com/svg/svg_path.asp
		// https://www.dashingd3js.com/svg-paths-and-d3js
		// link contains source {x, y} and target {x, y} attributes which are used as input for diagonal,
		// and then each passed to projection to calculate array couple [x,y] for both source and target point
		.attr("d", function(d) {
			if(that.config.transitions.enter.animate.position){
				var o;
				if(that.config.transitions.enter.referToToggling){
					o = {x: source.x0, y: source.y0};
				}else{
					o = {x: d.source.x0, y: d.source.y0};
				}
				return that.diagonal(that)({source: o, target: o});
			}else{
				return that.diagonal(that)(d);
			}
		});

	var linkEnterTransition = linkEnter;
	if(this.config.transitions.enter.animate.opacity){
		linkEnterTransition = linkEnter.transition()
			.duration(this.config.transitions.update.duration);

		linkEnter
			.style("opacity", 1e-6);
	}
	linkEnterTransition
		.style("opacity", 1.0);

	var linkUpdate = link;
	var linkUpdateTransition = linkUpdate;
	if(this.config.transitions.update.animate.position || this.config.transitions.update.animate.opacity){
		linkUpdateTransition = linkUpdate.transition()
			.duration(this.config.transitions.update.duration);
	}
	if(this.config.transitions.update.animate.position){
		linkUpdateTransition
			.attr("d", this.diagonal(this));
	}else{
		linkUpdate
			.attr("d", this.diagonal(this));
	}

	// still need to understand why this is necessary and 
	// 	linkEnterTransition.style("opacity", 1.0);
	// is not enough
	linkUpdateTransition
		.style("opacity", 1.0);

	var linkExit = link.exit();
	var linkExitTransition = linkExit;
	if(this.config.transitions.exit.animate.position || this.config.transitions.exit.animate.opacity){
		linkExitTransition = linkExit.transition()
			.duration(this.config.transitions.exit.duration);

		if(this.config.transitions.exit.animate.position){
			linkExitTransition
				.attr("d", function(d) {
					var o;
					if(that.config.transitions.exit.referToToggling){
						o = {x: source.x, y: source.y};
					}else{
						o = {x: d.source.x, y: d.source.y};
					}
					return that.diagonal(that)({source: o, target: o});
				});
		}else{
			linkExit
				.attr("d", this.diagonal(this));
		}
		if(this.config.transitions.exit.animate.opacity){
			linkExitTransition
				.style("opacity", 1e-6);
		}
	}
	linkExitTransition
		.remove();
};

// http://interactjs.io/
// http://interactjs.io/docs/#interactables
treeHtml.prototype.initializeManipulation = function() {
	var that = this;
	var movingPlaceholder = null;
	// target elements with the "draggable" class
	interact('.draggable')
		.draggable({
			// enable inertial throwing
			inertia: true,
			// keep the element within the area of it's parent
			restrict: {
				restriction: "parent",
				endOnly: true,
				elementRect: { top: 1, left: 1, bottom: 1, right: 1 }
			},

			// call this function on every dragmove event
			onstart: function (event) {
				// var target = event.target;
				var nodeHtml = d3.select(event.target);
				// var d = nodeHtml.datum();

				// remember original z-index
				nodeHtml.attr('data-z-index', nodeHtml.style("z-index"));
				// set it to the top of the index and reduce opacity
				nodeHtml
					.style("opacity", 0.5)
					.style("z-index", 10);

				// clone node with jQuery
				// https://api.jquery.com/clone/
				// http://www.w3schools.com/jsref/met_node_clonenode.asp
				// https://www.safaribooksonline.com/library/view/jquery-cookbook/9780596806941/ch01s14.html
				// http://stackoverflow.com/questions/8702165/how-to-clone-and-restore-a-dom-subtree
				// http://stackoverflow.com/questions/1848445/duplicating-an-element-and-its-style-with-javascript
				var movingPlaceholderJQ = $(event.target).clone(true, true);
				// create D3 selector
				movingPlaceholder = d3.select(movingPlaceholderJQ.get(0));
				// append cloned node to the map
				// http://stackoverflow.com/questions/21727202/append-dom-element-to-the-d3
				// http://jsperf.com/innertext-vs-fragment/24
				// http://stackoverflow.com/questions/16429199/selections-in-d3-how-to-use-parentnode-appendchild
				that.dom.divMapHtml.node().appendChild(movingPlaceholder.node());
			},

			// call this function on every dragmove event
			onmove: function (event) {
				// var target = event.target;
				var nodeHtml = d3.select(event.target),
					// d = nodeHtml.datum(),

				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(nodeHtml.attr('data-x')) || 0) + event.dx,
				y = (parseFloat(nodeHtml.attr('data-y')) || 0) + event.dy;

				// update the posiion attributes
				nodeHtml.attr('data-x', x);
				nodeHtml.attr('data-y', y);

				// translate the cloned node
				var translate = 'translate(' + x + 'px, ' + y + 'px)';
				movingPlaceholder.style("transform", translate);
			},
			// call this function on every dragend event
			onend: function (event) {
				var target = event.target;
				var nodeHtml = d3.select(event.target);
				var d = nodeHtml.datum();

				// update manual values for datum
				d.manualX = d.x + event.dy;
				d.manualY = d.y + event.dx;

				// var textEl = event.target.querySelector('p');
				// textEl && (textEl.textContent =
				// "moving: " + d.manualX + ", " + d.manualY);
				// 'moved a distance of '
				// + (Math.sqrt(event.dx * event.dx +
				//              event.dy * event.dy)|0) + 'px');

				nodeHtml
					.style("opacity", 1.0)
					.style("z-index", target.getAttribute('data-z-index'));
				nodeHtml.attr('data-z-index', null);

				// resetting element translation
				nodeHtml.style("transform", null);
				// update the posiion attributes
				nodeHtml.attr('data-x', null);
				nodeHtml.attr('data-y', null);

				if(movingPlaceholder){
					movingPlaceholder.remove();
					movingPlaceholder = null;
				}

				that.update(that.rootNode);
	    }
	  });
};

treeHtml.prototype.createCaretPlacer = function(el, atStart){
	// http://www.w3schools.com/jsref/met_html_focus.asp
	// http://stackoverflow.com/questions/2388164/set-focus-on-div-contenteditable-element
	// http://stackoverflow.com/questions/12203086/how-to-set-focus-back-to-contenteditable-div
	// http://stackoverflow.com/questions/2871081/jquery-setting-cursor-position-in-contenteditable-div
	// http://stackoverflow.com/questions/7699825/how-do-i-set-focus-on-a-div-with-contenteditable
	// https://gist.github.com/shimondoodkin/1081133
	el.focus();

	// http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
	// http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
	// http://stackoverflow.com/questions/2871081/jquery-setting-cursor-position-in-contenteditable-div
	// http://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
	if(typeof window.getSelection != "undefined" && typeof window.document.createRange != "undefined"){
		// https://developer.mozilla.org/en-US/docs/Web/API/range
		// https://developer.mozilla.org/en-US/docs/Web/API/Document/createRange
		var range = window.document.createRange();
		// https://developer.mozilla.org/en-US/docs/Web/API/range/selectNodeContents
		// https://developer.mozilla.org/en-US/docs/Web/API/Node
		range.selectNodeContents(el);
		// https://developer.mozilla.org/en-US/docs/Web/API/range/collapse
		range.collapse(atStart);
		// https://developer.mozilla.org/en-US/docs/Web/API/Selection
		// https://developer.mozilla.org/en-US/docs/Web/API/window/getSelection
		var sel = window.getSelection();
		// https://developer.mozilla.org/en-US/docs/Web/API/Selection/removeAllRanges
		// https://developer.mozilla.org/en-US/docs/Web/API/Selection/removeRange
		// https://msdn.microsoft.com/en-us/library/ie/ff975178(v=vs.85).aspx
		sel.removeAllRanges();
		// https://developer.mozilla.org/en-US/docs/Web/API/Selection/addRange
		sel.addRange(range);
	}else if(typeof window.document.body.createTextRange != "undefined"){
		// https://msdn.microsoft.com/en-us/library/ie/ms536401%28v=vs.85%29.aspx
		// https://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
		var textRange = window.document.body.createTextRange();
		// https://msdn.microsoft.com/en-us/library/ie/ms536630(v=vs.85).aspx
		textRange.moveToElementText(el);
		// http://help.dottoro.com/ljuobwme.php
		// http://www.ssicom.org/js/x415055.htm
		if(typeof textRange.collapse != "undefined"){
			textRange.collapse(atStart);
		}
		if(typeof textRange.collapse != "undefined"){
			// https://msdn.microsoft.com/en-us/library/ie/ms536616(v=vs.85).aspx
			textRange.move("textedit", (atStart ? -1 : 1));
		}
		// https://msdn.microsoft.com/en-us/library/ie/ms536735(v=vs.85).aspx
		textRange.select();
	}
};

treeHtml.prototype.setEditing = function(node){
	if(!node) return;
	var that = this;

	console.log("editing starting");
	this.editingNodeHtml = this.getDomFromDatum(this.selectedNode);
	var nodeSpan = this.editingNodeHtml.select("span");

	// http://www.w3.org/TR/html5/editing.html#editing-0
	// http://www.w3.org/TR/html5/editing.html#contenteditable
	// http://www.w3.org/TR/html5/editing.html#making-entire-documents-editable:-the-designmode-idl-attribute
	nodeSpan.attr("contenteditable", true);

	this.createCaretPlacer(nodeSpan.node(), false);

	// http://www.w3schools.com/js/js_htmldom_eventlistener.asp
	nodeSpan.node().addEventListener("blur", function onblur(){
		console.log("editing bluring");
		// http://www.w3schools.com/jsref/met_element_removeeventlistener.asp
		if(nodeSpan.node().removeEventListener){// For all major browsers, except IE 8 and earlier
			nodeSpan.node().removeEventListener("blur", onblur);
		}else if(nodeSpan.node().detachEvent){ // For IE 8 and earlier versions
			nodeSpan.node().detachEvent("blur", onblur);
		}
		that.exitEditingNode();
	});
};

treeHtml.prototype.exitEditingNode = function(){
	console.log("exitEditingNode");
	if(this.editingNodeHtml){
		var nodeSpan = this.editingNodeHtml.select("span");
		nodeSpan.attr("contenteditable", false);
		
		this.updateNode(this.editingNodeHtml.datum);
		nodeSpan.node().blur();
		this.editingNodeHtml = null;
	}
};

// http://robertwhurst.github.io/KeyboardJS/
treeHtml.prototype.initializeKeyboard = function() {
	var that = this;
	this.editingNodeHtml = null;

	KeyboardJS.on("right", function(){
		if(this.editingNodeHtml) return;

		if(this.selectedNode.children){
			this.clickNode(this.selectedNode.children[0]);
		}
	}.bind(this), function(){}.bind(this));
	KeyboardJS.on("left", function(){
		if(this.editingNodeHtml) return;

		if(this.selectedNode.parent){
			this.clickNode(this.selectedNode.parent);
		}
	}.bind(this), function(){}.bind(this));
	KeyboardJS.on("down", function(){
		if(this.editingNodeHtml) return;

		if(this.selectedNode.parent && this.selectedNode.parent.children){
			for(var i=0; i<this.selectedNode.parent.children.length; i++){
				if(this.selectedNode.parent.children[i] == this.selectedNode){
					if(i+1<this.selectedNode.parent.children.length){
						this.clickNode(this.selectedNode.parent.children[i+1]);
					}
				}
			}
		}
	}.bind(this), function(){}.bind(this));
	KeyboardJS.on("up", function(){
		if(this.editingNodeHtml) return;

		if(this.selectedNode.parent && this.selectedNode.parent.children){
			for(var i=0; i<this.selectedNode.parent.children.length; i++){
				if(this.selectedNode.parent.children[i] == this.selectedNode){
					if(i-1>=0){
						this.clickNode(this.selectedNode.parent.children[i-1]);
					}
				}
			}
		}
	}.bind(this), function(){}.bind(this));
	KeyboardJS.on("enter", function(){
		if(this.editingNodeHtml) return;

		this.selectedNode.isOpen = !this.selectedNode.isOpen;
		this.update(this.selectedNode);
	}.bind(this), function(){}.bind(this));

	// EDIT
	KeyboardJS.on("space",
	function(){
		if(this.editingNodeHtml){
			return;
		}
		return false;
	},
	function(){
		if(this.editingNodeHtml) return;
		this.setEditing(this.selectedNode);
	}.bind(this), function(){}.bind(this));

	// STOP-EDITING
	KeyboardJS.on("escape", function(){
		console.log("editing escaping");
		if(this.editingNodeHtml){
			this.exitEditingNode();
		}
	}.bind(this), function(){}.bind(this));	

	// Add new node
	KeyboardJS.on("tab", function(){
		if(this.editingNodeHtml) return; // in typing mode
		if(!this.selectedNode) return; // no parent node selected

		var newNode = this.createNewNode();
		// var newEdge = 
		this.createNewEdge(this.selectedNode._id, newNode._id);
		if(!this.selectedNode.isOpen){
			this.selectedNode.isOpen = true;
		}

		this.update(this.selectedNode, function(){
			that.selectedNode = newNode;
			that.setEditing(that.selectedNode);			
		});
	}.bind(this), function(){}.bind(this));	
};

}()); // end of 'use strict';