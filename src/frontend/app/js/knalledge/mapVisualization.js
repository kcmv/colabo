(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapVisualization =  knalledge.MapVisualization = function(parentDom, structure, configTransitions, configNodes, configEdges){
	this.dom = {
		parentDom: parentDom,
		divMap: null,
		divMapHtml: null,
		divMapSvg: null,
		svg: null
	};
	this.structure = structure;

	this.configTransitions = configTransitions;
	this.configNodes = configNodes;
	this.configEdges = configEdges;
	this.editingNodeHtml = null;
};

MapVisualization.prototype.init = function(viewStructure){
	this.viewStructure = viewStructure;
	this.dom.divMap = this.dom.parentDom.append("div")
		.attr("class", "div_map");

	if(this.configNodes.html.show){
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

	// listen on change of input radio buttons (tree, manual, ... viewspecs)
	d3.selectAll("input").on("change", function(){
		// that.viewspecChanged(this);
	});
};

MapVisualization.prototype.getDom = function(){
	return this.dom;
};

MapVisualization.prototype.update = function(source, callback) {
	this.viewStructure.generateTree(this.structure.rootNode);
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

MapVisualization.prototype.updateHtml = function(source) {
	var that = this;
	if(!this.configNodes.html.show) return;

	var nodeHtml = this.dom.divMapHtml.selectAll("div.node_html")
		.data(this.viewStructure.nodes, function(d) { return d._id; });

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var nodeHtmlEnter = nodeHtml.enter().append("div")
		.attr("class", "node_html node_unselected draggable")
		.on("dblclick", this.viewStructure.clickDoubleNode.bind(this.viewStructure))
		.on("click", this.viewStructure.clickNode.bind(this.viewStructure));

	// position node on enter at the source position
	// (it is either parent or another precessor)
	nodeHtmlEnter
		.style("left", function(d) {
			var y = null;
			if(that.configTransitions.enter.animate.position){
				if(that.configTransitions.enter.referToToggling){
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
			if(that.configTransitions.enter.animate.position){
				if(that.configTransitions.enter.referToToggling){
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
		.classed({
			"node_html_fixed": function(d){
				return (d.dataContent && d.dataContent.image && d.dataContent.image.width) ?
					false : true;
			}
		})
		.style("width", function(d){
				var width = (d.dataContent && d.dataContent.image && d.dataContent.image.width) ?
					d.dataContent.image.width + "px" : null;
				return width;
		})
		.style("margin-left", function(d){
				var margin = (d.dataContent && d.dataContent.image && d.dataContent.image.width) ?
					-d.dataContent.image.width/2 + "px" : null;
				return margin;
		})
		.style("background-color", function(d) {
			var image = d.dataContent ? d.dataContent.image : null;
			if(image) return null; // no bacground
			return (!d.isOpen && that.structure.hasChildren(d)) ? "#aaaaff" : "#ffffff";
		});

	nodeHtmlEnter.filter(function(d) { return d.dataContent && d.dataContent.image; })
		.append("img")
			.attr("src", function(d){
				return d.dataContent.image.url;
			})
			.attr("width", function(d){
				return d.dataContent.image.width + "px";
			})
			.attr("height", function(d){
				return d.dataContent.image.height + "px";
			})
			.attr("alt", function(d){
				return d.name;
			});

	nodeHtmlEnter
		.append("div")
			.attr("class", "node_status")
				.html(function(){
					return "&nbsp;"; //d._id;
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

	if(this.configTransitions.enter.animate.opacity){
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

MapVisualization.prototype.updateHtmlTransitions = function(source, nodeHtmlDatasets){
	if(!this.configNodes.html.show) return;
	var that = this;

	var nodeHtml = nodeHtmlDatasets.elements;
	// var nodeHtmlEnter = nodeHtmlDatasets.enter;

	// var nodeHtml = divMapHtml.selectAll("div.node_html")
	// 	.data(nodes, function(d) { return d._id; });

	// Transition nodes to their new (final) position
	// it happens also for entering nodes (http://bl.ocks.org/mbostock/3900925)
	var nodeHtmlUpdate = nodeHtml;
	var nodeHtmlUpdateTransition = nodeHtmlUpdate;
	if(this.configTransitions.update.animate.position || this.configTransitions.update.animate.opacity){
		nodeHtmlUpdateTransition = nodeHtmlUpdate.transition()
			.duration(this.configTransitions.update.duration);
	}

	(this.configTransitions.update.animate.position ? nodeHtmlUpdateTransition : nodeHtmlUpdate)
		.style("left", function(d){
			return d.y + "px";
		})
		// .each("start", function(d){
		// 	console.log("[nodeHtmlUpdateTransition] STARTED: d: %s, xCurrent: %s", d.name, d3.select(this).style("top"));
		// })
		.style("top", function(d){
			var x = that.viewStructure.getHtmlNodePosition(d);
			// x = d.x;
			// console.log("[nodeHtmlUpdateTransition] d: %s, xCurrent: %s, xNew: %s", d.name, d3.select(this).style("top"), x);
			return x + "px";
		});

	if(this.configTransitions.update.animate.opacity){
		nodeHtmlUpdateTransition
			.style("opacity", 1.0);
	}

	nodeHtmlUpdateTransition
		.style("background-color", function(d) {
			var image = d.dataContent ? d.dataContent.image : null;
			if(image) return null; // no bacground
			return (!d.isOpen && that.structure.hasChildren(d)) ? "#aaaaff" : "#ffffff";
		});

	// Transition exiting nodes
	var nodeHtmlExit = nodeHtml.exit();
	var nodeHtmlExitTransition = nodeHtmlExit;
	nodeHtmlExit.on("click", null);
	nodeHtmlExit.on("dblclick", null);

	if(this.configTransitions.exit.animate.position || this.configTransitions.exit.animate.opacity){
		nodeHtmlExitTransition = nodeHtmlExit.transition()
			.duration(this.configTransitions.exit.duration);
	}

	if(this.configTransitions.exit.animate.opacity){
		nodeHtmlExitTransition
			.style("opacity", 1e-6);
	}

	if(this.configTransitions.exit.animate.position){
		nodeHtmlExitTransition
			.style("left", function(d){
				// Transition nodes to the toggling node's new position
				if(that.configTransitions.exit.referToToggling){
					return source.y + "px";					
				}else{ // Transition nodes to the parent node's new position
					return (d.parent ? d.parent.y : d.y) + "px";
				}
			})
			.style("top", function(d){
				if(that.configTransitions.exit.referToToggling){
					return source.x + "px";
				}else{
					return (d.parent ? d.parent.x : d.x) + "px";
				}
			});
	}
	nodeHtmlExitTransition.remove();
};

MapVisualization.prototype.updateNodeDimensions = function(){
	if(!this.configNodes.html.show) return;
	// var that = this;

	this.dom.divMapHtml.selectAll("div.node_html").each(function(d) {
		// Get centroid(this.d)
		d.width = parseInt(d3.select(this).style("width"));
		d.height = parseInt(d3.select(this).style("height"));
		// d3.select(this).style("top", function(d) { 
		// 	return "" + that.viewStructure.getHtmlNodePosition(d) + "px";
		// })
	});
};

MapVisualization.prototype.updateSvgNodes = function(source) {
	if(!this.configNodes.svg.show) return;
	var that = this;

	// Declare the nodes, since there is no unique id we are creating one on the fly
	// not very smart with real data marshaling in/out :)
	var node = this.dom.svg.selectAll("g.node")
		.data(this.viewStructure.nodes, function(d) { return d._id; });

	// Enter the nodes
	// we create a group "g" that will contain both visual representation of a node (circle) and text
	var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		.style("opacity", function(){
			return that.configTransitions.enter.animate.opacity ? 1e-6 : 0.8;
		})
		.on("click", this.viewStructure.clickNode.bind(this.viewStructure))
		.on("dblclick", this.viewStructure.clickDoubleNode.bind(this.viewStructure))
		// Enter any new nodes at the parent's previous position.
		.attr("transform", function(d) {
			if(that.configTransitions.enter.animate.position){
				if(that.configTransitions.enter.referToToggling){
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
	if(this.configTransitions.enter.animate.position || this.configTransitions.enter.animate.opacity){
		nodeEnterTransition = nodeEnter.transition()
			.duration(this.configTransitions.enter.duration);

		if(this.configTransitions.enter.animate.opacity){
			nodeEnterTransition
				.style("opacity", 1e-6);
		}
	}

	var nodeUpdate = node;
	var nodeUpdateTransition;
	if(this.configTransitions.update.animate.position || this.configTransitions.update.animate.opacity){
		nodeUpdateTransition = nodeUpdate.transition()
			.duration(this.configTransitions.update.duration);
	}
	// Transition nodes to their new position
	(this.configTransitions.update.animate.position ? nodeUpdateTransition : nodeUpdate)
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
	(this.configTransitions.update.animate.opacity ? nodeUpdateTransition : nodeUpdate)
			.style("opacity", 0.8);

	node.select("circle")
		.style("fill", function(d) { return (!d.isOpen && that.structure.hasChildren(d)) ? "lightsteelblue" : "#ffffff"; });

	// Transition exiting nodes
	var nodeExit = node.exit();
	var nodeExitTransition;

	nodeExit.on("click", null);
	if(this.configTransitions.exit.animate.position || this.configTransitions.exit.animate.opacity){
		nodeExitTransition = nodeExit.transition()
			.duration(this.configTransitions.exit.duration);

		if(this.configTransitions.exit.animate.opacity){
			nodeExitTransition
				.style("opacity", 1e-6);
		}

		if(this.configTransitions.exit.animate.position){
			nodeExitTransition
				.attr("transform", function(d) {
					if(that.configTransitions.exit.referToToggling){
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

MapVisualization.prototype.updateLinkLabels = function(source) {
	if(!this.configEdges.labels.show) return;

	var that = this;

	var linkLabelHtml = this.dom.divMapHtml.selectAll("div.label_html")
	.data(this.viewStructure.links, function(d) {
		// there is only one incoming edge
		return d.target._id;
	});

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var linkLabelHtmlEnter = linkLabelHtml.enter().append("div")
		.attr("class", "label_html")
		// position node on enter at the source position
		// (it is either parent or another precessor)
		.on("click", this.viewStructure.clickLinkLabel.bind(this.viewStructure))
		.style("left", function(d) {
			var y;
			if(that.configTransitions.enter.animate.position){
				if(that.configTransitions.enter.referToToggling){
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
			if(that.configTransitions.enter.animate.position){
				if(that.configTransitions.enter.referToToggling){
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
				var edge = that.structure.getEdge(d.source._id, d.target._id);
				return edge.name;
			});

	if(this.configTransitions.enter.animate.opacity){
		linkLabelHtmlEnter
			.style("opacity", 1e-6);
	}

	var linkLabelHtmlUpdate = linkLabelHtml;
	var linkLabelHtmlUpdateTransition = linkLabelHtmlUpdate;
	if(this.configTransitions.update.animate.position || this.configTransitions.update.animate.opacity){
		linkLabelHtmlUpdateTransition = linkLabelHtmlUpdate.transition()
			.duration(this.configTransitions.update.duration);
	}
	if(this.configTransitions.update.animate.position){
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
	if(this.configTransitions.update.animate.opacity){
		linkLabelHtmlUpdateTransition
			.style("opacity", 1.0);
	}

	var linkLabelHtmlExit = linkLabelHtml.exit();
	var linkLabelHtmlExitTransition = linkLabelHtmlExit;
	linkLabelHtmlExit.on("click", null);
	if(this.configTransitions.exit.animate.position || this.configTransitions.exit.animate.opacity){
		linkLabelHtmlExitTransition = linkLabelHtmlExit.transition()
			.duration(this.configTransitions.exit.duration);

		if(this.configTransitions.exit.animate.position){
			linkLabelHtmlExitTransition
				.style("left", function(d) {
					var y = null;
					// Transition nodes to the toggling node's new position
					if(that.configTransitions.exit.referToToggling){
						y = source.y;					
					}else{ // Transition nodes to the parent node's new position
						y = d.source.y;
					}

					return y + "px";
				})
				.style("top", function(d) {
					var x = null;
					// Transition nodes to the toggling node's new position
					if(that.configTransitions.exit.referToToggling){
						x = source.x;					
					}else{ // Transition nodes to the parent node's new position
						x = d.source.x;
					}

					return x + "px";
				});
		}
		if(this.configTransitions.exit.animate.opacity){
			linkLabelHtmlExitTransition
				.style("opacity", 1e-6);
		}
	}
	linkLabelHtmlExitTransition
		.remove();
};

MapVisualization.prototype.updateLinks = function(source) {
	if(!this.configEdges.show) return;

	var that = this;

	// Declare the links
	var link = this.dom.svg.selectAll("path.link")
	.data(this.viewStructure.links, function(d) {
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
			var diagonal;
			if(that.configTransitions.enter.animate.position){
				var o;
				if(that.configTransitions.enter.referToToggling){
					o = {x: source.x0, y: source.y0};
				}else{
					o = {x: d.source.x0, y: d.source.y0};
				}
				diagonal = that.viewStructure.diagonal(that.viewStructure)({source: o, target: o});
			}else{
				diagonal = that.viewStructure.diagonal(that.viewStructure)(d);
			}
			return diagonal;
		});

	var linkEnterTransition = linkEnter;
	if(this.configTransitions.enter.animate.opacity){
		linkEnterTransition = linkEnter.transition()
			.duration(this.configTransitions.update.duration);

		linkEnter
			.style("opacity", 1e-6);
	}
	linkEnterTransition
		.style("opacity", 1.0);

	var linkUpdate = link;
	var linkUpdateTransition = linkUpdate;
	if(this.configTransitions.update.animate.position || this.configTransitions.update.animate.opacity){
		linkUpdateTransition = linkUpdate.transition()
			.duration(this.configTransitions.update.duration);
	}
	if(this.configTransitions.update.animate.position){
		linkUpdateTransition
			.attr("d", function(d){
				var diagonal;
				diagonal = that.viewStructure.diagonal(that.viewStructure)(d);
				return diagonal;
			});
	}else{
		linkUpdate
			.attr("d", function(d){
				var diagonal;
				diagonal = that.viewStructure.diagonal(that.viewStructure)(d);
				return diagonal;
			});
	}

	// still need to understand why this is necessary and 
	// 	linkEnterTransition.style("opacity", 1.0);
	// is not enough
	linkUpdateTransition
		.style("opacity", 1.0);

	var linkExit = link.exit();
	var linkExitTransition = linkExit;
	if(this.configTransitions.exit.animate.position || this.configTransitions.exit.animate.opacity){
		linkExitTransition = linkExit.transition()
			.duration(this.configTransitions.exit.duration);

		if(this.configTransitions.exit.animate.position){
			linkExitTransition
				.attr("d", function(d) {
					var diagonal;
					var o;
					if(that.configTransitions.exit.referToToggling){
						o = {x: source.x, y: source.y};
					}else{
						o = {x: d.source.x, y: d.source.y};
					}
					diagonal = that.viewStructure.diagonal(that.viewStructure)({source: o, target: o});
					return diagonal;
				});
		}else{
			linkExit
				.attr("d", function(d){
					var diagonal;
					diagonal = that.viewStructure.diagonal(that.viewStructure)(d);
					return diagonal;
				});
		}
		if(this.configTransitions.exit.animate.opacity){
			linkExitTransition
				.style("opacity", 1e-6);
		}
	}
	linkExitTransition
		.remove();
};

}()); // end of 'use strict';