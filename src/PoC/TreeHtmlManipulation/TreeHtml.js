var TreeHtml = null;

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var treeHtml = TreeHtml = function(parentDom, config, dimensions){
	this.config = config;
	this.dimensions = dimensions;

	this.rootNode = null;
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

	// inverted since tree is rotated to be horizontal
	this.tree = d3.layout.tree()
		.size([this.dimensions.sizes.height, this.dimensions.sizes.width]);

	this.tree.children(function(d){
		var children = [];
		if(!d.isOpen) return children;

		for(var i in this.edgesById){
			if(this.edgesById[i].sourceId == d.id){
				children.push(this.nodesById[this.edgesById[i].targetId]);
			}
		}
		return children;
	}.bind(this));
}

treeHtml.prototype.hasChildren = function(d){
	for(var i in this.edgesById){
		if(this.edgesById[i].sourceId == d.id){
			return true;
		}
	}
	return false;
}

treeHtml.prototype.getEdge = function(sourceId, targetId){
	for(var i in this.edgesById){
		if(this.edgesById[i].sourceId == sourceId
			&& this.edgesById[i].targetId == targetId){
			return this.edgesById[i];
		}
	}
	return null;
}

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
	.projection(function(d, i) {
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

// Toggle children on node click.
treeHtml.prototype.clickNode = function(d) {
	this.toggle(d);
	this.update(d);
};

// react on label click.
treeHtml.prototype.clickLinkLabel = function(d) {
	// console.log("Label clicked: " + JSON.stringify(d.target.name));

	// just as a click indicator
	if(d3.select(this).style("opacity") < 0.75){
		d3.select(this).style("opacity", 1.0);
	}else{
		d3.select(this).style("opacity", 0.5);
	}
};

treeHtml.prototype.init = function(){

	this.dom.divMap = this.dom.parentDom.append("div")
		.attr("class", "div_map");

	if(this.config.nodes.html.show){
		this.dom.divMapHtml = this.dom.divMap.append("div")
			.attr("class", "div_map_html")
			.append("div")
				.attr("class", "html_content")
					.style("left", this.dimensions.margin.left+"px")
					.style("top", this.dimensions.margin.top+"px");
	}

	this.dom.divMapSvg = this.dom.divMap.append("div")
		.attr("class", "div_map_svg");

	this.dom.svg = this.dom.divMapSvg
		.append("svg")
			.attr("width", this.dimensions.sizes.width + this.dimensions.margin.right + this.dimensions.margin.left)
			.attr("height", this.dimensions.sizes.height + this.dimensions.margin.top + this.dimensions.margin.bottom)
			.append("g")
				.attr("class", "svg_content")
				.attr("transform", "translate(" + this.dimensions.margin.left + "," + this.dimensions.margin.top + ")");
};

treeHtml.prototype.load = function(filename){
	// load the external data
	var that = this;
	d3.json(filename, function(error, treeData) {
		that.processData(error, treeData);
	});
};

treeHtml.prototype.processData = function(error, treeData) {
	this.properties = treeData.properties;
	var i=0;
	var node = null;
	var edge = null;
	for(i=0; i<treeData.nodes.length; i++){
		node = treeData.nodes[i];
		if(! "isOpen" in node){
			node.isOpen = false;
		}
		this.nodesById[node.id] = node;
	}

	for(i=0; i<treeData.edges.length; i++){
		edge = treeData.edges[i];
		this.edgesById[edge.id] = edge;
	}

	this.rootNode = this.nodesById[this.properties.rootNodeId];
	this.rootNode.x0 = this.dimensions.sizes.height / 2;
	this.rootNode.y0 = 0;

	this.update(this.rootNode);
};

treeHtml.prototype.update = function(source) {
	this.generateTree(this.rootNode);
	var nodeHtmlDatasets = this.updateHtml(source); // we need to update html nodes to calculate node heights in order to center them verticaly
	var that = this;
	window.setTimeout(function() {
		that.updateNodeDimensions();
		that.updateHtmlTransitions(source, nodeHtmlDatasets); // all transitions are put here to be in the same time-slot as links, labels, etc
		that.updateSvgNodes(source);
		that.updateLinks(source);
		that.updateLinkLabels(source);		
	}, 25);
}

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
	this.nodes.forEach(function(d) {
		d.y = d.depth * 300;
		if(d.parent && d.parent == "null"){
			d.parent = null;
		}
		// make it sure that x0 and y0 exist for newly entered nodes
		if(!("x0" in d) || !("y0" in d)){
			d.x0 = d.x;
			d.y0 = d.y;
		}
	});
}

treeHtml.prototype.getHtmlNodePosition = function(d) {
	var x = null;
	if(this.config.nodes.html.show){
		x = d.x - d.height/2;
	}else{
		x = d.x;
	}

	if (isNaN(x) || x == null){
		x = d.x;
	}
	return x;
}

treeHtml.prototype.updateHtml = function(source) {
	var that = this;
	if(!this.config.nodes.html.show) return;

	var nodeHtml = this.dom.divMapHtml.selectAll("div.node_html")
		.data(this.nodes, function(d) { return d.id; });

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var nodeHtmlEnter = nodeHtml.enter().append("div")
		.attr("class", "node_html")
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
			.attr("class", "node_inner_html")
			.append("span")
				.html(function(d) {
					return d.name;
				});

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
}

treeHtml.prototype.updateHtmlTransitions = function(source, nodeHtmlDatasets){
	if(!this.config.nodes.html.show) return;
	var that = this;

	var nodeHtml = nodeHtmlDatasets.elements;
	var nodeHtmlEnter = nodeHtmlDatasets.enter;

	// var nodeHtml = divMapHtml.selectAll("div.node_html")
	// 	.data(nodes, function(d) { return d.id; });

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
			})
	}
	nodeHtmlExitTransition.remove();
}

treeHtml.prototype.updateNodeDimensions = function(){
	if(!this.config.nodes.html.show) return;
	var that = this;

	this.dom.divMapHtml.selectAll("div.node_html").each(function(d, i) {
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
		.data(this.nodes, function(d) { return d.id; });

	// Enter the nodes
	// we create a group "g" that will contain both visual representation of a node (circle) and text
	var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		.style("opacity", function(d){
			return that.config.transitions.enter.animate.opacity ? 1e-6 : 0.8
		})
		.on("click", this.clickNode.bind(this))
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
			.duration(this.config.transitions.enter.duration)

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
			.duration(this.config.transitions.exit.duration)

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
				})
		}
		nodeExitTransition
			.remove();
	}else{
		nodeExit
			.remove();
	}
}
treeHtml.prototype.updateLinkLabels = function(source) {
	if(!this.config.edges.labels.show) return;

	var that = this;

	var linkLabelHtml = this.dom.divMapHtml.selectAll("div.label_html")
	.data(this.links, function(d) {
		// there is only one incoming edge
		return d.target.id;
	});

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var linkLabelHtmlEnter = linkLabelHtml.enter().append("div")
		.attr("class", "label_html")
		// position node on enter at the source position
		// (it is either parent or another precessor)
		.on("click", this.clickLinkLabel.bind(this))
		.style("left", function(d) {
			if(that.config.transitions.enter.animate.position){
				if(that.config.transitions.enter.referToToggling){
					var y = source.y0;
				}else{
					var y = d.source.y0;
				}
			}else{
				var y = (d.source.y + d.target.y) / 2;
			}
			return y + "px";
		})
		.style("top", function(d) {
			if(that.config.transitions.enter.animate.position){
				if(that.config.transitions.enter.referToToggling){
					var x = source.x0;
				}else{
					var x = d.source.x0;
				}
			}else{
				var x = (d.source.x + d.target.x) / 2;
			}
			return x + "px";
		});

	linkLabelHtmlEnter
		.append("span")
			//.text("<span>Hello</span>");
			//.html("<span>Hello</span>");
			.html(function(d) {
				var edge = that.getEdge(d.source.id, d.target.id);
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
}

treeHtml.prototype.updateLinks = function(source) {
	if(!this.config.edges.show) return;

	var that = this;

	// Declare the links
	var link = this.dom.svg.selectAll("path.link")
	.data(this.links, function(d) {
		// there is only one incoming edge
		return d.target.id;
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
				if(that.config.transitions.enter.referToToggling){
					var o = {x: source.x0, y: source.y0};
				}else{
					var o = {x: d.source.x0, y: d.source.y0};
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
					if(that.config.transitions.exit.referToToggling){
						var o = {x: source.x, y: source.y};
					}else{
						var o = {x: d.source.x, y: d.source.y};
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
}


}()); // end of 'use strict';