(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* http://bl.ocks.org/d3noob/8329447
https://gist.github.com/d3noob/8329447
cd TreeHTML
../../frontend/scripts/web-server.js 8080 ../../Poc/TreeHTML
************** Generate the tree diagram	 *****************
*/

var margin = {top: 20, right: 120, bottom: 20, left: 120},
	widthFull = 960,
	heightFull = 700,
	width = widthFull - margin.right - margin.left,
	height = heightFull - margin.top - margin.bottom,
	node_width = 150,
	root;

// inverted since tree is rotated to be horizontal
var tree = d3.layout.tree()
	.size([height, width]);

var i=0, nodes, links;
var	durationEnter = 1000
,	durationUpdate = 500
,	durationExit = 750;

// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal
// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal_projection
// https://www.dashingd3js.com/svg-paths-and-d3js
var diagonal = d3.svg.diagonal()
	.source(function(d){
		//return d.source;
		// here we are creating object with just necessary parameters (x, y)
		var point = {x: d.source.x, y: d.source.y};
		// since our node is not just a punctual entity, but it has width, we need to adjust diagonals' source and target points
		// by shifting points from the center of node to the edges of node
		// we deal here with y-coordinates, because our final tree is rotated to propagete across the x-axis, instead of y-axis
		// (you can see that in .project() function
		if(d.source.y < d.target.y){
			point.y += node_width/2 + 0;
		}
		return point;
	})
	.target(function(d){
		//return d.target;
		var point = {x: d.target.x, y: d.target.y};
		if(d.target.y > d.source.y){
			point.y -= node_width/2 + 0;
		}
		// if()
		return point;
	})
	// our final tree is rotated to propagete across the x-axis, instead of y-axis
	// therefor we are swapping x and y coordinates here
	.projection(function(d, i) {
		return [d.y, d.x];
	});
// testing
// diagonal({source: {x:5,y:10}, target: {x:5,y:10}});

var divMap = d3.select("body").append("div")
	.attr("class", "div_map");

// http://stackoverflow.com/questions/13203897/d3-nested-appends-and-data-flow
// http://stackoverflow.com/questions/24318154/d3-js-append-on-existing-div-and-hierarchy
var divMapHtml = divMap.append("div")
	.attr("class", "div_map_html")
	.append("div")
		.attr("class", "html_content")
			.style("left", margin.left+"px")
			.style("top", margin.top+"px");

var divMapSvg = divMap.append("div")
	.attr("class", "div_map_svg");

var svg = divMapSvg
	.append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("class", "svg_content")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load the external data
d3.json("treeData.json", function(error, treeData) {
	root = treeData;
	update(root);
});

function update(source) {
	generateTree(source);
	updateHtml(source);
	window.setTimeout(function() {
		updateNodeDimensiona();
		updateSvgNodes(source);
		updateSvgLinks(source);		
	}, 10);
}

function generateTree(source){
	// Compute the new tree layout.
	nodes = tree.nodes(root).reverse();
	links = tree.links(nodes);

	// Normalize for fixed-depth.
	nodes.forEach(function(d) {
		d.y = d.depth * 300;
	});
}

function updateHtml(source) {
	var nodeHtml = divMapHtml.selectAll("div.node_html")
		.data(nodes, function(d) { return d.id || (d.id = ++i); });

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var nodeHtmlEnter = nodeHtml.enter().append("div")
		.attr("class", "node_html")
		.style("left", function(d) { 
			// return "0px";
			return "" + d.y + "px";
		})
		.style("top", function(d) { 
			// return "0px";
			return "" + d.x + "px";
		})
		.append("div")
			.attr("class", "node_inner_html")
			.append("span")
				//.text("<span>Hello</span>");
				//.html("<span>Hello</span>");
				.html(function(d) {
					return d.name;
				});
}

function updateNodeDimensiona(){
	divMapHtml.selectAll("div.node_html").each(function(d, i) {
		// Get centroid(this.d)
		d.width = parseInt(d3.select(this).style("width"));
		d.height = parseInt(d3.select(this).style("height"));
		d3.select(this).style("top", function(d) { 
			return "" + (d.x - d.height/2) + "px";
		})
	});
};

function updateSvgNodes(source) {
	var i = 0; // counter
	// Declare the nodes, since there is no unique id we are creating one on the fly
	// not very smart with real data marshaling in/out :)
	var node = svg.selectAll("g.node")
		.data(nodes, function(d) { return d.id || (d.id = ++i); });

	// Enter the nodes
	// we create a group "g" that will contain both visual representation of a node (circle) and text
	var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { 
		  // return "translate(0,0)";
		  return "translate(" + d.y + "," + d.x + ")";
		});

	// add visual representation of node
	nodeEnter.append("circle")
		// the center of the circle is positioned at the 0,0 coordinate
		.attr("r", 10)
		.style("fill", "#fff")
		.style("opacity", "0.8");

/*	// add node label
	nodeEnter.append("text")
		// if there are children anchor text to the end of thext
		// which means it will be positioned to the right side of the text provided position (x)
		.attr("text-anchor", function(d) { 
			return d.children || d._children ? "end" : "start";
		})
		// if there are children text will be on the left side from the node so we need to
		// increase negative (left) margine
		// otherwise we increase positive (right) margine
		.attr("x", function(d) { 
			return d.children || d._children ? -13 : 13;
		})
		// move (relatively) the text down
		.attr("dy", ".35em")
		// set the text
		.text(function(d) {
			return d.name;
		})
		.style("fill-opacity", 1);
*/
}

function updateSvgLinks(source) {
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
		.attr("d", diagonal);
}


}()); // end of 'use strict';