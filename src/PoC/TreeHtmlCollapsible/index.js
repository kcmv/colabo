(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* http://bl.ocks.org/d3noob/8329447
https://gist.github.com/d3noob/8329447
cd TreeHTML
../../frontend/scripts/web-server.js 8080 ../../Poc/TreeHtmlCollapsible/
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
			show: true
		},
		html: {
			show: true
		}
	},
	edges: {
		show: true
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
			position: false,
			opacity: true
		}
	},
	update: {
		duration: 500,
		referToToggling: true,
		animate: {
			position: false,
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
			position: false,
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

// Toggle children on click.
function click(d) {
	toggle(d);
	update(d);
}

// load the external data
d3.json("treeData.json", function(error, treeData) {
	root = treeData;
	root.x0 = height / 2;
	root.y0 = 0;

	root.children.forEach(collapse);
	update(root);
});

function update(source) {
	generateTree(root);
	updateHtml(source);
	window.setTimeout(function() {
		updateNodeDimensions();
		updateSvgNodes(source);
		updateSvgLinks(source);		
	}, 10);
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
	});
}

function getHtmlNodePosition(d) {
	if(config.nodes.html.show){
		return (d.x - d.height/2);
	}else{
		return d.x;
	}
}

function updateHtml(source) {
	if(!config.nodes.html.show) return;

	var nodeHtml = divMapHtml.selectAll("div.node_html")
		.data(nodes, function(d) { return d.id || (d.id = ++id); });

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var nodeHtmlEnter = nodeHtml.enter().append("div")
		.attr("class", "node_html")
		.style("background-color", function(d) {
			return d._children ? "#aaaaff" : "#ffffff";
		})
		// position node on enter at the source position
		// (it is either parent or another precessor)
		.style("left", function(d) {
			if(transitions.enter.animate.position){
				if(transitions.enter.referToToggling){
					return "" + source.y0 + "px";
				}else{
					return d.parent.y + "px";
				}
			}else{
				return "" + d.y + "px";				
			}
		})
		.style("top", function(d) {
			if(transitions.enter.animate.position){
				if(transitions.enter.referToToggling){
					return "" + source.x0 + "px";
				}else{
					return d.parent.x + "px";
				}
			}else{
				return "" + d.x + "px";
			}
		});

	if(transitions.enter.animate.opacity){
		nodeHtmlEnter
			.style("opacity", 0.0);
	}
		
	nodeHtmlEnter
		.on("click", click)
		.append("div")
			.attr("class", "node_inner_html")
			.append("span")
				//.text("<span>Hello</span>");
				//.html("<span>Hello</span>");
				.html(function(d) {
					return d.name;
				});

	// Transition nodes to their new (final) position
	// it seems it happens also for entering nodes ?!
	if(transitions.exit.animate.position || transitions.exit.animate.opacity){
		var nodeHtmlUpdate = nodeHtml.transition()
			.duration(transitions.update.duration);

		if(transitions.update.animate.position){
			nodeHtmlUpdate
				.style("left", function(d){
					return "" + d.y + "px";
				})
				.style("top", function(d){
					return "" + getHtmlNodePosition(d) + "px";
					// return "" + d.x + "px";
				});
		}
		if(transitions.update.animate.opacity){
			nodeHtmlUpdate
				.style("opacity", 1.0)
				.style("background-color", function(d) {
					return d._children ? "#aaaaff" : "#ffffff";
				});
		}
	}else{
		nodeHtml
			.style("background-color", function(d) {
				return d._children ? "#aaaaff" : "#ffffff";
			});
	}

	// Transition exiting nodes
	if(transitions.exit.animate.position || transitions.exit.animate.opacity){
		var nodeHtmlExit = nodeHtml.exit().transition()
			.duration(transitions.exit.duration);

		if(transitions.exit.animate.opacity){
			nodeHtmlExit
				.style("opacity", 0.0);
		}

		if(transitions.exit.animate.position){
			nodeHtmlExit
				.style("left", function(d){
					// Transition nodes to the toggling node's new position
					if(transitions.exit.referToToggling){
						return source.y + "px";					
					}else{ // Transition nodes to the parent node's new position
						return d.parent.y + "px";
					}
				})
				.style("top", function(d){
					if(transitions.exit.referToToggling){
						return source.x + "px";
					}else{
						return d.parent.x + "px";
					}
				})
		}
		nodeHtmlExit
			.remove();
	}else{
		var nodeHtmlExit = nodeHtml.exit()
			.remove();
	}
}

function updateNodeDimensions(){
	if(!config.nodes.html.show) return;
	divMapHtml.selectAll("div.node_html").each(function(d, i) {
		// Get centroid(this.d)
		d.width = parseInt(d3.select(this).style("width"));
		d.height = parseInt(d3.select(this).style("height"));
		d3.select(this).style("top", function(d) { 
			return "" + getHtmlNodePosition(d) + "px";
		})
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
		.on("click", click)
		// Enter any new nodes at the parent's previous position.
		.attr("transform", function(d) {
			if(transitions.enter.animate.position){
				if(transitions.enter.referToToggling){
					return "translate(" + source.y0 + "," + source.x0 + ")";
				}else{
					return "translate(" + d.parent.y + "," + d.parent.x + ")";
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


	var nodeUpdate;
	var nodeUpdateTransition;
	if(transitions.update.animate.position || transitions.update.animate.opacity){
		nodeUpdateTransition = node.transition()
			.duration(transitions.update.duration);
	}
	nodeUpdate = node;
	// Transition nodes to their new position
	(transitions.update.animate.position ? nodeUpdateTransition : nodeUpdate)
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
	(transitions.update.animate.opacity ? nodeUpdateTransition : nodeUpdate)
			.style("opacity", 0.8);

	node.select("circle")
		.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	// Transition exiting nodes
	if(transitions.exit.animate.position || transitions.exit.animate.opacity){
		var nodeExit = node.exit().transition()
			.duration(transitions.exit.duration)

		if(transitions.exit.animate.opacity){
			nodeExit
				.style("opacity", 0.0);
		}

		if(transitions.exit.animate.position){
			nodeExit
				.attr("transform", function(d) {
					if(transitions.exit.referToToggling){
						return "translate(" + source.y + "," + source.x + ")";
					}else{
						return "translate(" + d.parent.y + "," + d.parent.x + ")";
					}
				})
		}
		nodeExit
			.remove();
	}else{
		var nodeExit = node.exit();
		nodeExit
			.remove();
	}
}

function updateSvgLinks(source) {
	if(!config.edges.show) return;

	// Declare the links
	var link = svg.selectAll("path.link")
	.data(links, function(d) {
		// there is only one incoming edge
		return d.target.id;
	});

	// Enter the links
	link.enter().insert("path", "g")
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
					var o = {x: d.parent.x, y: d.parent.y};
				}
				return diagonal({source: o, target: o});
			}else{
				return diagonal(d);
			}
		});
		// .attr("d", diagonal);

	// Transition links to their new position.
	if(transitions.update.animate.position){
		link.transition()
			.duration(transitions.update.duration)
			.attr("d", diagonal);
	}else{
		link
			.attr("d", diagonal);
	}

	// Transition exiting nodes to the parent's new position.
	if(transitions.exit.animate.position){
		link.exit().transition()
			.duration(transitions.exit.duration)
			.attr("d", function(d) {
				if(transitions.exit.referToToggling){
					var o = {x: source.x, y: source.y};
				}else{
					var o = {x: d.parent.x, y: d.parent.y};
				}
				return diagonal({source: o, target: o});
			})
			.style("opacity", 0.0)
			.remove();
	}else{
		link.exit()
			.remove();
	}
}


}()); // end of 'use strict';