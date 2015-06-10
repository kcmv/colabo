(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapVisualizationGraph =  knalledge.MapVisualizationGraph = function(dom, mapStructure, configTransitions, configTree, configNodes, configEdges, rimaService, notifyService, mapPlugins, knalledgeMapViewService){
	this.construct(dom, mapStructure, configTransitions, configTree, configNodes, configEdges, rimaService, notifyService, mapPlugins, knalledgeMapViewService);
};

// TODO: the quickest solution until find the best and the most performance optimal solution
// Set up MapVisualizationGraph to inherit from MapVisualization
MapVisualizationGraph.prototype = Object.create(knalledge.MapVisualization.prototype);

MapVisualizationGraph.prototype._super = function(){
	var thisP = Object.getPrototypeOf(this);
	var parentP = Object.getPrototypeOf(thisP);
	return parentP;
};

/** @function update 
 * 	@param {vkNode} source - root node 
 *  @callback callback 
 * */
MapVisualizationGraph.prototype.update = function(source, callback) {
	// If source is missing try with rootNode
	if(!source){
		source = this.mapStructure.rootNode;
	}
	// If rootNode is missing try with the first node in the mapStructure (if any exist)
	if(!source && Object.keys(this.mapStructure.nodesById).length > 0){
		source = this.mapStructure.nodesById[Object.keys(this.mapStructure.nodesById)[0]];
	}
	this.mapLayout.generateGraph(this.mapStructure.rootNode);
	this.mapLayout.printTree(this.mapLayout.nodes);
	var nodeHtmlDatasets = this.updateHtml(source); // we need to update html nodes to calculate node heights in order to center them verticaly
	var that = this;
	window.setTimeout(function() {
		that.updateNodeDimensions();
		that.updateHtmlTransitions(source, nodeHtmlDatasets); // all transitions are put here to be in the same time-slot as links, labels, etc

		// we do it "second time" to react to width/height changes after adding/removing elemetns (like images, ...)
		that.updateNodeDimensions();
		that.updateHtmlAfterTransitions(source, nodeHtmlDatasets);

		that.updateSvgNodes(source);
		that.updateLinks(source);
		that.updateLinkLabels(source);
		if(callback){
			callback();
		}
	}, 25);
};

/** @function updateHtml 
 * 	@param {vkNode} source - root node 
 * joins data and view
 * stylize nodes and set their eventlisteners
 * */
MapVisualizationGraph.prototype.updateHtml = function(source) {
	var that = this;
	var nodeHtmlDatasets = {
		elements: null,
		enter: null,
		exit: null
	};
	if(this.configNodes.html.show && this.mapLayout.nodes !== null && typeof this.mapLayout.nodes !== "undefined"){

		// var nodeHtml = this.dom.divMapHtml.selectAll("div.node_graph_html")
		// 	.data(this.mapLayout.nodes, function(d) { return d.id; });

		var nodeHtml = this.dom.divMapHtml.selectAll("div.node_graph_html")
		.data(this.mapLayout.nodes);//graph.nodes());
	 

		function tick() {
			// add the curvy lines:
		    path.attr("d", function(d) {
		        var dx = d.target.x - d.source.x,
		            dy = d.target.y - d.source.y,
		            dr = Math.sqrt(dx * dx + dy * dy);
		        return "M" + 
		            d.source.x + "," + 
		            d.source.y + "A" + 
		            dr + "," + dr + " 0 0,1 " + 
		            d.target.x + "," + 
		            d.target.y;
		    });

		    nodeHtml
		        .attr("transform", function(d) { 
		  	    return "translate(" + d.x + "," + d.y + ")"; });
		}

		// graph
		// .on("tick", tick)
		// .start();

		nodeHtml.classed({
			"node_unselectable": function(d){
				return (!d.kNode.visual || !d.kNode.visual.selectable) ?
					true : false;
			},
			"node_selectable": function(d){
				return (d.kNode.visual && d.kNode.visual.selectable) ?
					true : false;
			}
		});

		//  .enter().append("g")
		// .attr("class", "node")
		// .on("click", click)
		// //.on("dblclick", dblclick)
		// .call(force.drag);

		// Enter the nodes
		// we create a div that will contain both visual representation of a node (circle) and text
		var nodeHtmlEnter = nodeHtml.enter().append("div")
			.attr("class", function(d){
					var classes = "node_graph_html node_unselected draggable " + d.kNode.type;
					return classes;
				})
			.on("dblclick", function(d){
				that.mapLayout.clickDoubleNode(d, this);
			})
			.on("click", function(d){
				that.mapLayout.clickNode(d, this);
			})
			//.call(graph.drag);

		// position node on enter at the source position
		// (it is either parent or another precessor)
		nodeHtmlEnter
			.style("left", function(d) {
				var y = null;
				if(that.configTransitions.enter.animate.position){
					if(that.configTransitions.enter.referToToggling){
						y = source.py;
					}else{
						y = d.parent ? d.parent.py : d.py;
					}
				}else{
					y = d.y;
				}
				return that.scales.y(y) + "px";
			})
			.style("top", function(d) {
				var x = null;
				if(that.configTransitions.enter.animate.position){
					if(that.configTransitions.enter.referToToggling){
						x = source.px;
					}else{
						x = d.parent ? d.parent.px : d.px;
					}
				}else{
					x = d.x;
				}
				// console.log("[nodeHtmlEnter] d: %s, x: %s", d.kNode.name, x);
				return that.scales.x(x) + "px";
			})
			.classed({
				"node_graph_html_fixed": function(d){
					return (that.knalledgeMapViewService.config.nodes.showImages && d.kNode.dataContent && d.kNode.dataContent.image && d.kNode.dataContent.image.width) ?
						false : true;
				}
			})
			/* TODO FIxing expandable nodes */
			.style("width", function(d){
			// .style("min-width", function(d){
					var width = (that.knalledgeMapViewService.config.nodes.showImages && d.kNode.dataContent && d.kNode.dataContent.image && d.kNode.dataContent.image.width) ?
						d.kNode.dataContent.image.width : width;
					if(width === null) {
						width = ( that.configNodes.html.dimensions &&  that.configNodes.html.dimensions.sizes &&  that.configNodes.html.dimensions.sizes.width) ?
						 that.configNodes.html.dimensions.sizes.width : null;
					}
					return that.scales.width(width) + "px";
			})
			.style("margin-left", function(d){
					// centering the node (set margin to half the width of the node)
					var width = (that.knalledgeMapViewService.config.nodes.showImages && d.kNode.dataContent && d.kNode.dataContent.image && d.kNode.dataContent.image.width) ?
						d.kNode.dataContent.image.width : null;
					if(width === null) {
						width = ( that.configNodes.html.dimensions &&  that.configNodes.html.dimensions.sizes &&  that.configNodes.html.dimensions.sizes.width) ?
						 that.configNodes.html.dimensions.sizes.width : null;
					}

					var margin = null;
					if(width !== null) {
						margin = that.scales.width(-width/2) + "px";
					}
					return margin;
			});
			// .style("background-color", function(d) {
			// 	var image = d.kNode.dataContent ? d.kNode.dataContent.image : null;
			// 	if(image) return null; // no bacground
			// 	return (!d.isOpen && that.mapStructure.hasChildren(d)) ? "#aaaaff" : "#ffffff";
			// });

		nodeHtmlEnter
			.append("div")
				.attr("class", "node_inner_html")
				.append("span")
					.html(function(d) {
						return d.kNode.name;
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

		if(this.mapPlugins && this.mapPlugins.mapVisualizePlugins){
			for(var pluginName in this.mapPlugins.mapVisualizePlugins){
				var plugin = this.mapPlugins.mapVisualizePlugins[pluginName];
				if(plugin.nodeHtmlEnter){
					plugin.nodeHtmlEnter(nodeHtmlEnter);
				}
			}
		}

		nodeHtmlDatasets.elements = nodeHtml;
		nodeHtmlDatasets.enter = nodeHtmlEnter;
		nodeHtmlDatasets.exit = null;
	}
	return nodeHtmlDatasets;
};

MapVisualizationGraph.prototype.updateHtmlTransitions = function(source, nodeHtmlDatasets){
	if(!this.configNodes.html.show) return;
	var that = this;

	var nodeHtml = nodeHtmlDatasets.elements;
	// var nodeHtmlEnter = nodeHtmlDatasets.enter;

	// var nodeHtml = divMapHtml.selectAll("div.node_graph_html")
	// 	.data(nodes, function(d) { return d.id; });

	// Transition nodes to their new (final) position
	// it happens also for entering nodes (http://bl.ocks.org/mbostock/3900925)
	var nodeHtmlUpdate = nodeHtml;
	if(nodeHtmlUpdate !== null){
		var nodeHtmlUpdateTransition = nodeHtmlUpdate;
		if(this.configTransitions.update.animate.position || this.configTransitions.update.animate.opacity){
			nodeHtmlUpdateTransition = nodeHtmlUpdate.transition()
				.duration(this.configTransitions.update.duration);
		}

		nodeHtmlUpdate
			.classed({
				"node_graph_html_fixed": function(d){
					return (that.knalledgeMapViewService.config.nodes.showImages && d.kNode.dataContent && d.kNode.dataContent.image && d.kNode.dataContent.image.width) ?
						false : true;
				}
			})
			/* TODO FIxing expandable nodes */
			.style("width", function(d){
			// .style("min-width", function(d){
					var width = (that.knalledgeMapViewService.config.nodes.showImages && d.kNode.dataContent && d.kNode.dataContent.image && d.kNode.dataContent.image.width) ?
						d.kNode.dataContent.image.width : null;
					if(width === null) {
						width = ( that.configNodes.html.dimensions &&  that.configNodes.html.dimensions.sizes &&  that.configNodes.html.dimensions.sizes.width) ?
						 that.configNodes.html.dimensions.sizes.width : null;
					}
					return that.scales.width(width) + "px";
			})
			.style("margin-left", function(d){
					// centering the node (set margin to half the width of the node)
					var width = (that.knalledgeMapViewService.config.nodes.showImages && d.kNode.dataContent && d.kNode.dataContent.image && d.kNode.dataContent.image.width) ?
						d.kNode.dataContent.image.width : width;
					if(width === null) {
						width = ( that.configNodes.html.dimensions &&  that.configNodes.html.dimensions.sizes &&  that.configNodes.html.dimensions.sizes.width) ?
						 that.configNodes.html.dimensions.sizes.width : null;
					}

					var margin = null;
					if(width !== null) {
						margin = that.scales.width(-width/2) + "px";
					}
					return margin;
			});
			nodeHtmlUpdate.select(".node_inner_html span")
				.html(function(d) {
					return d.kNode.name;
				});

		if(this.mapPlugins && this.mapPlugins.mapVisualizePlugins){
			for(var pluginName in this.mapPlugins.mapVisualizePlugins){
				var plugin = this.mapPlugins.mapVisualizePlugins[pluginName];
				if(plugin.nodeHtmlUpdate){
					plugin.nodeHtmlUpdate(nodeHtmlUpdate);
				}
			}
		}

		(this.configTransitions.update.animate.position ? nodeHtmlUpdateTransition : nodeHtmlUpdate)
			.style("left", function(d){
				return that.scales.y(d.y) + "px";
			})
			// .each("start", function(d){
			// 	console.log("[nodeHtmlUpdateTransition] STARTED: d: %s, xCurrent: %s", d.kNode.name, d3.select(this).style("top"));
			// })
			.style("top", function(d){
				var x = that.mapLayout.getHtmlNodePosition(d);
				// x = d.x;
				// console.log("[nodeHtmlUpdateTransition] d: %s, xCurrent: %s, xNew: %s", d.kNode.name, d3.select(this).style("top"), x);
				return that.scales.x(x) + "px";
			});

		if(this.configTransitions.update.animate.opacity){
			nodeHtmlUpdateTransition
				.style("opacity", 1.0);
			nodeHtmlUpdateTransition.select(".node_inner_html")
				.style("opacity", function(d){
					return (d.kNode.visual && d.kNode.visual.selectable) ?
						1.0 : 0.5;
				});
		}

		// nodeHtmlUpdateTransition
		// 	.style("background-color", function(d) {
		// 		var image = d.kNode.dataContent ? d.kNode.dataContent.image : null;
		// 		if(image) return null; // no bacground
		// 		return (!d.isOpen && that.mapStructure.hasChildren(d)) ? "#aaaaff" : "#ffffff";
		// 	});
	}

	// Transition exiting nodes
	if(nodeHtml !== null && nodeHtml.exit() !== null){
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
					var y = null;
					// Transition nodes to the toggling node's new position
					if(that.configTransitions.exit.referToToggling){
						y = source.y;
					}else{ // Transition nodes to the parent node's new position
						y = (d.parent ? d.parent.y : d.y);
					}
					return that.scales.y(d.y) + "px";
				})
				.style("top", function(d){
					var x = null;
					if(that.configTransitions.exit.referToToggling){
						x = source.x;
					}else{
						x = (d.parent ? d.parent.x : d.x);
					}
					return that.scales.x(d.x) + "px";
				});
		}
		nodeHtmlExitTransition.remove();
	}
};

MapVisualizationGraph.prototype.updateHtmlAfterTransitions = function(source, nodeHtmlDatasets){
	if(!this.configNodes.html.show || nodeHtmlDatasets === null || nodeHtmlDatasets.elements === null) return;
	var that = this;

	var nodeHtml = nodeHtmlDatasets.elements;
	// var nodeHtmlEnter = nodeHtmlDatasets.enter;

	// var nodeHtml = divMapHtml.selectAll("div.node_graph_html")
	// 	.data(nodes, function(d) { return d.id; });

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
			return that.scales.y(d.y) + "px";
		})
		// .each("start", function(d){
		// 	console.log("[nodeHtmlUpdateTransition] STARTED: d: %s, xCurrent: %s", d.kNode.name, d3.select(this).style("top"));
		// })
		.style("top", function(d){
			var x = that.mapLayout.getHtmlNodePosition(d);
			// x = d.x;
			// console.log("[nodeHtmlUpdateTransition] d: %s, xCurrent: %s, xNew: %s", d.kNode.name, d3.select(this).style("top"), x);
			return that.scales.x(x) + "px";
		});

	if(this.configTransitions.update.animate.opacity){
		nodeHtmlUpdateTransition
			.style("opacity", 1.0);
		nodeHtmlUpdateTransition.select(".node_inner_html")
			.style("opacity", function(d){
				return (d.kNode.visual && d.kNode.visual.selectable) ?
					1.0 : 0.5;
			});
	}

};

MapVisualizationGraph.prototype.updateSvgNodes = function(source) {
	if(!this.configNodes.svg.show) return;
	var that = this;

	// Declare the nodes, since there is no unique id we are creating one on the fly
	// not very smart with real data marshaling in/out :)
	var node = this.dom.svg.selectAll("g.node")
		.data(this.mapLayout.nodes, function(d) { return d.id; });

	// Enter the nodes
	// we create a group "g" that will contain both visual representation of a node (circle) and text
	var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		.style("opacity", function(){
			return that.configTransitions.enter.animate.opacity ? 1e-6 : 0.8;
		})

		.on("click", function(d){
			that.mapLayout.clickNode(d, this);
		})
		.on("dblclick", function(d){
			that.clickDoubleNode.clickNode(d, this);
		})
		// Enter any new nodes at the parent's previous position.
		.attr("transform", function(d) {
			var x = null, y = null;
			if(that.configTransitions.enter.animate.position){
				if(that.configTransitions.enter.referToToggling){
					y = source.py;
					x = source.px;
				}else{
					if(d.parent){
						y = d.parent.py;
						x = d.parent.px;
					}else{
						y = d.py;
						x = d.px;
					}
				}
			}else{
					y = d.y;
					x = d.x;
			}
			return "translate(" + that.scales.y(source.py) + "," + that.scales.x(source.px) + ")";
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
		.style("fill", function(d) { return (!d.isOpen && that.mapStructure.hasChildren(d)) ? "lightsteelblue" : "#ffffff"; });

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
					var x=null, y=null;
					if(that.configTransitions.exit.referToToggling){
						x = source.x;
						y = source.y;
					}else{
						if(d.parent){
							x = d.parent.x;
							y = d.parent.y;
						}else{
							x = d.x;
							y = d.y;
						}
					}
					return "translate(" + that.scales.y(y) + "," + that.scales.x(x) + ")";							
				});
		}
		nodeExitTransition
			.remove();
	}else{
		nodeExit
			.remove();
	}
};

MapVisualizationGraph.prototype.updateLinkLabels = function(source) {
	if(!this.configEdges.labels.show || this.mapLayout.links === null) return;

	var that = this;

	var linkLabelHtml = this.dom.divMapHtml.selectAll("div.label_html")
	.data(this.mapLayout.links, function(d) {
		// there is only one incoming edge
		return d.id; // d.target.id;
	});

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var linkLabelHtmlEnter = linkLabelHtml.enter().append("div")
		.attr("class", function(d){
				return "label_html " + d.kEdge.type;
			})
		// position node on enter at the source position
		// (it is either parent or another precessor)
		.on("click", this.mapLayout.clickLinkLabel.bind(this.mapLayout))
		.style("left", function(d) {
			var y;
			if(that.configTransitions.enter.animate.position){
				if(that.configTransitions.enter.referToToggling){
					y = source.py;
				}else{
					y = d.source.py;
				}
			}else{
				y = (d.source.y + d.target.y) / 2;
			}
			return that.scales.y(y) + "px";
		})
		.style("top", function(d) {
			var x;
			if(that.configTransitions.enter.animate.position){
				if(that.configTransitions.enter.referToToggling){
					x = source.px;
				}else{
					x = d.source.px;
				}
			}else{
				x = (d.source.x + d.target.x) / 2;
			}
			return that.scales.x(x) + "px";
		});

	linkLabelHtmlEnter
		.append("span")
			//.text("<span>Hello</span>");
			//.html("<span>Hello</span>");
			.html(function(d) {
				var edge = that.mapStructure.getEdge(d.source.id, d.target.id); //TODO: replace with added kEdge 
				return edge.kEdge.name;
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

	linkLabelHtmlUpdate.select("span")
			.html(function(d) {
				var edge = that.mapStructure.getEdge(d.source.id, d.target.id); //TODO: replace with added kEdge 
				return that.knalledgeMapViewService.config.edges.showNames ? edge.kEdge.name : "";
			});

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

					return that.scales.y(y) + "px";
				})
				.style("top", function(d) {
					var x = null;
					// Transition nodes to the toggling node's new position
					if(that.configTransitions.exit.referToToggling){
						x = source.x;					
					}else{ // Transition nodes to the parent node's new position
						x = d.source.x;
					}

					return that.scales.x(x) + "px";
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

MapVisualizationGraph.prototype.updateLinks = function(source) {
	if(!this.configEdges.show || this.mapLayout.links === null) return;

	var that = this;

	// Declare the links
	var link = this.dom.svg.selectAll("path.link")
	.data(this.mapLayout.links, function(d) {
		// there is only one incoming edge
		return d.id; // d.target.id;
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
					o = {x: source.px, y: source.py};
				}else{
					o = {x: d.source.px, y: d.source.py};
				}
				diagonal = that.mapLayout.diagonal(that.mapLayout)({source: o, target: o});
			}else{
				diagonal = that.mapLayout.diagonal(that.mapLayout)(d);
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
				diagonal = that.mapLayout.diagonal(that.mapLayout)(d);
				return diagonal;
			});
	}else{
		linkUpdate
			.attr("d", function(d){
				var diagonal;
				diagonal = that.mapLayout.diagonal(that.mapLayout)(d);
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
					diagonal = that.mapLayout.diagonal(that.mapLayout)({source: o, target: o});
					return diagonal;
				});
		}else{
			linkExit
				.attr("d", function(d){
					var diagonal;
					diagonal = that.mapLayout.diagonal(that.mapLayout)(d);
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