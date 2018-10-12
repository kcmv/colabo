// http://bl.ocks.org/d3noob/8329447
// https://gist.github.com/d3noob/8329447

// cd TreeSVG
// ../../frontend/scripts/web-server.js 8080 ../../Poc/TreeSVG

// ************** Generate the tree diagram	 *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 960 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;

// inverted since tree is rotated to be horizontal
var tree = d3.layout.tree()
	.size([height, width]);

// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal
// https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal_projection
// https://www.dashingd3js.com/svg-paths-and-d3js
var diagonal = d3.svg.diagonal()
	// Example
	// 	0: {name: "Level 2: A", parent: Object, children: Array[2], depth: 1, x: 282.8571428571429, y: 300, id:4}
	// 	1: {x: 282.8571428571429, y: 450}
	// 	2: {x: 188.57142857142858, y: 450}
	// 	3: {name: "Son of A that is the brother of Son of A and nephew og Level 2: B", parent: Object, depth: 2, x: 188.57142857142858, y: 600, id: 3}
	.projection(function(d, i) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load the external data
d3.json("treeData.json", function(error, treeData) {
	root = treeData;
	console.log(root);
	update(root);
});

function update(source) {

	// Compute the new tree layout.
	var nodes = tree.nodes(root).reverse(),
		links = tree.links(nodes);

	// Normalize for fixed-depth.
	nodes.forEach(function(d) {
		d.y = d.depth * 180; 
	});

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
		  return "translate(" + d.y + "," + d.x + ")"; });

	// add visual representation of node
	nodeEnter.append("circle")
		.attr("r", 10)
		.style("fill", "#fff");

	// add node label
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
		.attr("d", diagonal);

}