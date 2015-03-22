(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* 
Collapsible Tree - http://bl.ocks.org/mbostock/4339083

cd TreeHTML
../../frontend/scripts/web-server.js 8080 ../../Poc/TreeHtmlManipulation/
************** Generate the tree diagram	 *****************
*/

var margin = {top: 20, right: 120, bottom: 20, left: 120},
	widthFull = 960,
	heightFull = 700,
	width = widthFull - margin.right - margin.left,
	height = heightFull - margin.top - margin.bottom,
	node_width = 150,
	root;

var config = {
	nodes: {
		punctual: false,
		svg: {
			show: false
		},
		html: {
			show: true
		}
	},
	edges: {
		show: true,
		labels: {
			show: true
		}
	}
};

var transitions = {
	enter: {
		duration: 1000,
		// if set to true, entering elements will enter from the node that is expanding
		// (no matter if it is parent or grandparent, ...)
		// otherwise it elements will enter from the parent node
		referToToggling: true,
		animate: {
			position: true,
			opacity: true
		}
	},
	update: {
		duration: 500,
		referToToggling: true,
		animate: {
			position: true,
			opacity: true
		}
	},
	exit: {
		duration: 750,
		// if set to true, exiting elements will exit to the node that is collapsing
		// (no matter if it is parent or grandparent, ...)
		// otherwise it elements will exit to the parent node
		referToToggling: true,
		animate: {
			position: true,
			opacity: true
		}
	}
}

// inverted since tree is rotated to be horizontal
var tree = d3.layout.tree()
	.size([height, width]);

var id=0, nodes, links;

// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal
// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal_projection
// https://www.dashingd3js.com/svg-paths-and-d3js
var diagonal = d3.svg.diagonal()
	.source(function(d){
		//return d.source;
		// here we are creating object with just necessary parameters (x, y)
		var point = {x: d.source.x, y: d.source.y};
		if(!config.nodes.punctual){
			// since our node is not just a punctual entity, but it has width, we need to adjust diagonals' source and target points
			// by shifting points from the center of node to the edges of node
			// we deal here with y-coordinates, because our final tree is rotated to propagete across the x-axis, instead of y-axis
			// (you can see that in .project() function
			if(d.source.y < d.target.y){
				point.y += node_width/2 + 0;
			}
		}
		return point;
	})
	.target(function(d){
		//return d.target;
		var point = {x: d.target.x, y: d.target.y};
		if(!config.nodes.punctual){
			if(d.target.y > d.source.y){
				point.y -= node_width/2 + 0;
			}
		}
		return point;
	})
	// our final tree is rotated to propagete across the x-axis, instead of y-axis
	// therefor we are swapping x and y coordinates here
	.projection(function(d, i) {
		return [d.y, d.x];
	});

var divMap = d3.select("body").append("div")
	.attr("class", "div_map");

var divMapHtml;
if(config.nodes.html.show){
	var divMapHtml = divMap.append("div")
		.attr("class", "div_map_html")
		.append("div")
			.attr("class", "html_content")
				.style("left", margin.left+"px")
				.style("top", margin.top+"px");
}

var divMapSvg = divMap.append("div")
	.attr("class", "div_map_svg");

var svg = divMapSvg
	.append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("class", "svg_content")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// collapses children of the provided node
function collapse(d) {
	if (d.children) {
		d._children = d.children;
		d._children.forEach(collapse);
		d.children = null;
	}
}

// toggle children of the provided node
function toggle(d) {
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
}

// Toggle children on node click.
function clickNode(d) {
	toggle(d);
	update(d);
}

// react on label click.
function clickLinkLabel(d) {
	// console.log("Label clicked: " + JSON.stringify(d.target.name));

	// just as a click indicator
	if(d3.select(this).style("opacity") < 0.75){
		d3.select(this).style("opacity", 1.0);
	}else{
		d3.select(this).style("opacity", 0.5);
	}
}

// load the external data
d3.json("treeData.json", function(error, treeData) {
	root = treeData;
	root.x0 = height / 2;
	root.y0 = 0;

	if(root.children){
		root.children.forEach(collapse);
	}
	update(root);
});

function update(source) {
	generateTree(root);
	var nodeHtmlDatasets = updateHtml(source); // we need to update html nodes to calculate node heights in order to center them verticaly
	window.setTimeout(function() {
		updateNodeDimensions();
		updateHtmlTransitions(source, nodeHtmlDatasets); // all transitions are put here to be in the same time-slot as links, labels, etc
		updateSvgNodes(source);
		updateLinks(source);
		updateLinkLabels(source);		
	}, 25);
}

function generateTree(source){
	if(nodes){
		// Normalize for fixed-depth.
		nodes.forEach(function(d) {
			// Stash the old positions for transition.
		    d.x0 = d.x;
		    d.y0 = d.y;
		});
	}

	// Compute the new tree layout.
	nodes = tree.nodes(source).reverse();
	links = tree.links(nodes);

	// Normalize for fixed-depth.
	nodes.forEach(function(d) {
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

function getHtmlNodePosition(d) {
	var x = null;
	if(config.nodes.html.show){
		x = d.x - d.height/2;
	}else{
		x = d.x;
	}

	if (isNaN(x) || x == null){
		x = d.x;
	}
	return x;
}

function updateHtml(source) {
	if(!config.nodes.html.show) return;

	var nodeHtml = divMapHtml.selectAll("div.node_html")
		.data(nodes, function(d) { return d.id || (d.id = ++id); });

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var nodeHtmlEnter = nodeHtml.enter().append("div")
		.attr("class", "node_html")
		.on("click", clickNode)

	// position node on enter at the source position
	// (it is either parent or another precessor)
	nodeHtmlEnter
		.style("left", function(d) {
			var y = null;
			if(transitions.enter.animate.position){
				if(transitions.enter.referToToggling){
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
			if(transitions.enter.animate.position){
				if(transitions.enter.referToToggling){
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
			return d._children ? "#aaaaff" : "#ffffff";
		});

	nodeHtmlEnter
		.append("div")
			.attr("class", "node_inner_html")
			.append("span")
				.html(function(d) {
					return d.name;
				});

	if(transitions.enter.animate.opacity){
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

function updateHtmlTransitions(source, nodeHtmlDatasets){
	if(!config.nodes.html.show) return;

	var nodeHtml = nodeHtmlDatasets.elements;
	var nodeHtmlEnter = nodeHtmlDatasets.enter;

	// var nodeHtml = divMapHtml.selectAll("div.node_html")
	// 	.data(nodes, function(d) { return d.id || (d.id = ++id); });

	// Transition nodes to their new (final) position
	// it happens also for entering nodes (http://bl.ocks.org/mbostock/3900925)
	var nodeHtmlUpdate = nodeHtml;
	var nodeHtmlUpdateTransition = nodeHtmlUpdate;
	if(transitions.update.animate.position || transitions.update.animate.opacity){
		nodeHtmlUpdateTransition = nodeHtmlUpdate.transition()
			.duration(transitions.update.duration);
	}

	(transitions.update.animate.position ? nodeHtmlUpdateTransition : nodeHtmlUpdate)
		.style("left", function(d){
			return d.y + "px";
		})
		// .each("start", function(d){
		// 	console.log("[nodeHtmlUpdateTransition] STARTED: d: %s, xCurrent: %s", d.name, d3.select(this).style("top"));
		// })
		.style("top", function(d){
			var x = getHtmlNodePosition(d);
			this;
			// x = d.x;
			// console.log("[nodeHtmlUpdateTransition] d: %s, xCurrent: %s, xNew: %s", d.name, d3.select(this).style("top"), x);
			return x + "px";
		});

	if(transitions.update.animate.opacity){
		nodeHtmlUpdateTransition
			.style("opacity", 1.0);
	}

	nodeHtmlUpdateTransition
		.style("background-color", function(d) {
			return d._children ? "#aaaaff" : "#ffffff";
		});

	// Transition exiting nodes
	var nodeHtmlExit = nodeHtml.exit();
	var nodeHtmlExitTransition = nodeHtmlExit;
	nodeHtmlExit.on("click", null);
	if(transitions.exit.animate.position || transitions.exit.animate.opacity){
		nodeHtmlExitTransition = nodeHtmlExit.transition()
			.duration(transitions.exit.duration);
	}

	if(transitions.exit.animate.opacity){
		nodeHtmlExitTransition
			.style("opacity", 1e-6);
	}

	if(transitions.exit.animate.position){
		nodeHtmlExitTransition
			.style("left", function(d){
				// Transition nodes to the toggling node's new position
				if(transitions.exit.referToToggling){
					return source.y + "px";					
				}else{ // Transition nodes to the parent node's new position
					return (d.parent ? d.parent.y : d.y) + "px";
				}
			})
			.style("top", function(d){
				if(transitions.exit.referToToggling){
					return source.x + "px";
				}else{
					return (d.parent ? d.parent.x : d.x) + "px";
				}
			})
	}
	nodeHtmlExitTransition.remove();
}

function updateNodeDimensions(){
	if(!config.nodes.html.show) return;
	divMapHtml.selectAll("div.node_html").each(function(d, i) {
		// Get centroid(this.d)
		d.width = parseInt(d3.select(this).style("width"));
		d.height = parseInt(d3.select(this).style("height"));
		// d3.select(this).style("top", function(d) { 
		// 	return "" + getHtmlNodePosition(d) + "px";
		// })
	});
};

function updateSvgNodes(source) {
	if(!config.nodes.svg.show) return;

	// Declare the nodes, since there is no unique id we are creating one on the fly
	// not very smart with real data marshaling in/out :)
	var node = svg.selectAll("g.node")
		.data(nodes, function(d) { return d.id || (d.id = ++id); });

	// Enter the nodes
	// we create a group "g" that will contain both visual representation of a node (circle) and text
	var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		.style("opacity", function(d){
			return transitions.enter.animate.opacity ? 1e-6 : 0.8
		})
		.on("click", clickNode)
		// Enter any new nodes at the parent's previous position.
		.attr("transform", function(d) {
			if(transitions.enter.animate.position){
				if(transitions.enter.referToToggling){
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
	if(transitions.enter.animate.position || transitions.enter.animate.opacity){
		nodeEnterTransition = nodeEnter.transition()
			.duration(transitions.enter.duration)

		if(transitions.enter.animate.opacity){
			nodeEnterTransition
				.style("opacity", 1e-6);
		}
	}

	var nodeUpdate = node;
	var nodeUpdateTransition;
	if(transitions.update.animate.position || transitions.update.animate.opacity){
		nodeUpdateTransition = nodeUpdate.transition()
			.duration(transitions.update.duration);
	}
	// Transition nodes to their new position
	(transitions.update.animate.position ? nodeUpdateTransition : nodeUpdate)
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
	(transitions.update.animate.opacity ? nodeUpdateTransition : nodeUpdate)
			.style("opacity", 0.8);

	node.select("circle")
		.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	// Transition exiting nodes
	var nodeExit = node.exit();
	var nodeExitTransition;

	nodeExit.on("click", null);
	if(transitions.exit.animate.position || transitions.exit.animate.opacity){
		nodeExitTransition = nodeExit.transition()
			.duration(transitions.exit.duration)

		if(transitions.exit.animate.opacity){
			nodeExitTransition
				.style("opacity", 1e-6);
		}

		if(transitions.exit.animate.position){
			nodeExitTransition
				.attr("transform", function(d) {
					if(transitions.exit.referToToggling){
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
function updateLinkLabels(source) {
	if(!config.edges.labels.show) return;

	var linkLabelHtml = divMapHtml.selectAll("div.label_html")
	.data(links, function(d) {
		// there is only one incoming edge
		return d.target.id;
	});

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var linkLabelHtmlEnter = linkLabelHtml.enter().append("div")
		.attr("class", "label_html")
		// position node on enter at the source position
		// (it is either parent or another precessor)
		.on("click", clickLinkLabel)
		.style("left", function(d) {
			if(transitions.enter.animate.position){
				if(transitions.enter.referToToggling){
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
			if(transitions.enter.animate.position){
				if(transitions.enter.referToToggling){
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
				return d.target.linkLabel// d.target.name; // "лабела"; // d.name;
			});

	if(transitions.enter.animate.opacity){
		linkLabelHtmlEnter
			.style("opacity", 1e-6);
	}

	var linkLabelHtmlUpdate = linkLabelHtml;
	var linkLabelHtmlUpdateTransition = linkLabelHtmlUpdate;
	if(transitions.update.animate.position || transitions.update.animate.opacity){
		linkLabelHtmlUpdateTransition = linkLabelHtmlUpdate.transition()
			.duration(transitions.update.duration);
	}
	if(transitions.update.animate.position){
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
	if(transitions.update.animate.opacity){
		linkLabelHtmlUpdateTransition
			.style("opacity", 1.0);
	}

	var linkLabelHtmlExit = linkLabelHtml.exit();
	var linkLabelHtmlExitTransition = linkLabelHtmlExit;
	linkLabelHtmlExit.on("click", null);
	if(transitions.exit.animate.position || transitions.exit.animate.opacity){
		linkLabelHtmlExitTransition = linkLabelHtmlExit.transition()
			.duration(transitions.exit.duration);

		if(transitions.exit.animate.position){
			linkLabelHtmlExitTransition
				.style("left", function(d) {
					var y = null;
					// Transition nodes to the toggling node's new position
					if(transitions.exit.referToToggling){
						y = source.y;					
					}else{ // Transition nodes to the parent node's new position
						y = d.source.y;
					}

					return y + "px";
				})
				.style("top", function(d) {
					var x = null;
					// Transition nodes to the toggling node's new position
					if(transitions.exit.referToToggling){
						x = source.x;					
					}else{ // Transition nodes to the parent node's new position
						x = d.source.x;
					}

					return x + "px";
				});
		}
		if(transitions.exit.animate.opacity){
			linkLabelHtmlExitTransition
				.style("opacity", 1e-6);
		}
	}
	linkLabelHtmlExitTransition
		.remove();
}

function updateLinks(source) {
	if(!config.edges.show) return;

	// Declare the links
	var link = svg.selectAll("path.link")
	.data(links, function(d) {
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
			if(transitions.enter.animate.position){
				if(transitions.enter.referToToggling){
					var o = {x: source.x0, y: source.y0};
				}else{
					var o = {x: d.source.x0, y: d.source.y0};
				}
				return diagonal({source: o, target: o});
			}else{
				return diagonal(d);
			}
		});

	var linkEnterTransition = linkEnter;
	if(transitions.enter.animate.opacity){
		linkEnterTransition = linkEnter.transition()
			.duration(transitions.update.duration);

		linkEnter
			.style("opacity", 1e-6);
	}
	linkEnterTransition
		.style("opacity", 1.0);

	var linkUpdate = link;
	var linkUpdateTransition = linkUpdate;
	if(transitions.update.animate.position || transitions.update.animate.opacity){
		linkUpdateTransition = linkUpdate.transition()
			.duration(transitions.update.duration);
	}
	if(transitions.update.animate.position){
		linkUpdateTransition
			.attr("d", diagonal);
	}else{
		linkUpdate
			.attr("d", diagonal);
	}

	// still need to understand why this is necessary and 
	// 	linkEnterTransition.style("opacity", 1.0);
	// is not enough
	linkUpdateTransition
		.style("opacity", 1.0);

	var linkExit = link.exit();
	var linkExitTransition = linkExit;
	if(transitions.exit.animate.position || transitions.exit.animate.opacity){
		linkExitTransition = linkExit.transition()
			.duration(transitions.exit.duration);

		if(transitions.exit.animate.position){
			linkExitTransition
				.attr("d", function(d) {
					if(transitions.exit.referToToggling){
						var o = {x: source.x, y: source.y};
					}else{
						var o = {x: d.source.x, y: d.source.y};
					}
					return diagonal({source: o, target: o});
				});
		}else{
			linkExit
				.attr("d", diagonal);
		}
		if(transitions.exit.animate.opacity){
			linkExitTransition
				.style("opacity", 1e-6);
		}
	}
	linkExitTransition
		.remove();
}


}()); // end of 'use strict';