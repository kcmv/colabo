(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var mapId = "552678e69ad190a642ad461c";

var Map =  knalledge.Map = function(parentDom, config, dimensions, clientApi, entityStyles){
	this.parentDom = parentDom;
	this.config = config;
	this.dimensions = dimensions;
	this.clientApi = clientApi;
	this.entityStyles = entityStyles;

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

	this.keyboardInteraction = null;

	// http://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element
	var mapSize = [this.parentDom.node().getBoundingClientRect().height, this.parentDom.node().getBoundingClientRect().width];
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

Map.prototype.hasChildren = function(d){
	for(var i in this.edgesById){
		if(this.edgesById[i].sourceId == d._id){
			return true;
		}
	}
	return false;
};

Map.prototype.getEdge = function(sourceId, targetId){
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
Map.prototype.diagonal = function(that){
	var diagonalSource = function(d){
		//return d.source;
		// here we are creating object with just necessary parameters (x, y)
		var point = {x: d.source.x, y: d.source.y};
		if(!that.config.nodes.punctual){
			// since our node is not just a punctual entity, but it has width, we need to adjust diagonals' source and target points
			// by shifting points from the center of node to the edges of node
			// we deal here with y-coordinates, because our final tree is rotated to propagete across the x-axis, instead of y-axis
			// (you can see that in .project() function
			if(d.source.y < d.target.y){
				var width = (d.dataContent && d.dataContent.image && d.dataContent.image.width) ?
					d.dataContent.image.width/2 : that.dimensions.node.width/2;
				point.y += width + 0;
			}
		}
		return point;
	}.bind(that);

	var diagonalTarget = function(d){
		//return d.target;
		var point = {x: d.target.x, y: d.target.y};
		if(!that.config.nodes.punctual){
			if(d.target.y > d.source.y){
				var width = (d.dataContent && d.dataContent.image && d.dataContent.image.width) ?
					d.dataContent.image.width/2 : that.dimensions.node.width/2;
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

// collapses children of the provided node
Map.prototype.collapse = function(d) {
	d.isOpen = false;
};

// toggle children of the provided node
Map.prototype.toggle = function(d) {
	d.isOpen = !d.isOpen;
	return;
};

// Returns view representation (dom) from datum d
Map.prototype.getDomFromDatum = function(d) {
	var dom = this.dom.divMapHtml.selectAll("div.node_html")
		.data([d], function(d){return d._id;});
	if(dom.size() != 1) return null;
	else return dom;
};

// Select node on node click
Map.prototype.clickNode = function(d) {
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
Map.prototype.clickDoubleNode = function(d) {
	this.toggle(d);
	this.update(d);
};

// react on label click.
Map.prototype.clickLinkLabel = function() {
	// console.log("Label clicked: " + JSON.stringify(d.target.name));

	// just as a click indicator
	if(d3.select(this).style("opacity") < 0.75){
		d3.select(this).style("opacity", 1.0);
	}else{
		d3.select(this).style("opacity", 0.5);
	}
};

Map.prototype.init = function(){
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

Map.prototype.viewspecChanged = function(target){
	if (target.value === "viewspec_tree") this.config.tree.viewspec = "viewspec_tree";
	else if (target.value === "viewspec_manual") this.config.tree.viewspec = "viewspec_manual";
	this.update(this.rootNode);
};

//should be migrated to some util .js file:
Map.prototype.cloneObject = function(obj){
	return (JSON.parse(JSON.stringify(obj)));
};
	
Map.prototype.createNode = function() {
	
	var nodeCreated = function(nodeFromServer) {
		console.log("[Map] nodeCreated" + JSON.stringify(nodeFromServer));
		var edgeUpdatedNodeRef = function(edgeFromServer){
			console.log("[Map] edgeUpdatedNodeRef" + JSON.stringify(edgeFromServer));
		};
		
		// updating all references to node on fronted with server-created id:
		var oldId = newNode._id;
		delete this.nodesById.oldId;//		this.nodesById.splice(oldId, 1);
		this.nodesById[nodeFromServer._id] = newNode; //TODO: we should set it to 'nodeFromServer'?! But we should synchronize also local changes from 'newNode' happen in meantime
		newNode._id = nodeFromServer._id; //TODO: same as above
		
		//fixing edges:: sourceId & targetId:
		for(var i in this.edgesById){
			var changed = false;
			var edge = this.edgesById[i];
			if(edge.sourceId == oldId){edge.sourceId = nodeFromServer._id; changed = true;}
			if(edge.targetId == oldId){edge.targetId = nodeFromServer._id; changed = true;}
			if(changed){
				//TODO: should we clone it or call vanilla object creation:
				this.clientApi.updateEdge(edge, edgeUpdatedNodeRef.bind(this)); //saving changes in edges's node refs to server
			}
		}
	};
	
	console.log("[Map] createNode");
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
	var nodeCloned = this.cloneObject(newNode);
	delete nodeCloned._id;
	this.clientApi.createNode(nodeCloned, nodeCreated.bind(this)); //saving on server service.
	return newNode;
};

Map.prototype.updateNode = function(node) {
	this.clientApi.updateNode(node); //updating on server service
};

Map.prototype.createEdge = function(startNodeId, endNodeId) {
	
	var edgeCreated = function(edgeFromServer) {
		console.log("[Map] edgeCreated" + JSON.stringify(edgeFromServer));
		
		// updating all references to edge on fronted with server-created id:
		var oldId = newEdge._id;
		delete this.edgesById[oldId];//		this.nodesById.splice(oldId, 1);
		this.edgesById[edgeFromServer._id] = newEdge; //TODO: we should set it to 'edgeFromServer'?! But we should synchronize also local changes from 'newEdge' happen in meantime
		newEdge._id = edgeFromServer._id; //TODO: same as above
	};
	
	console.log("[Map] createEdge");
	var maxId = -1;
	for(var i in this.edgesById){
		if(maxId < this.edgesById[i]._id){
			maxId = this.edgesById[i]._id;
		}
	}
	var newEdge = {
		"_id": maxId+1,
		"name": "Hello Links",
		"sourceId": startNodeId,
		"targetId": endNodeId,
		"mapId": mapId
	};

	this.edgesById[newEdge._id] = newEdge;
	
	//preparing and saving on server service:
	var edgeCloned = this.cloneObject(newEdge);
	delete edgeCloned._id;
	delete edgeCloned.targetId; // this is still not set to real DV ids
	this.clientApi.createEdge(edgeCloned, edgeCreated.bind(this));
	
	return newEdge;
};

Map.prototype.processData = function(error, treeData) {
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

Map.prototype.update = function(source, callback) {
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

Map.prototype.generateTree = function(source){
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
	var viewspec = this.config.tree.viewspec;
	var sizes = this.config.nodes.html.dimensions.sizes;
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

Map.prototype.getHtmlNodePosition = function(d) {
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

Map.prototype.updateHtml = function(source) {
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
			return (!d.isOpen && that.hasChildren(d)) ? "#aaaaff" : "#ffffff";
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

Map.prototype.updateHtmlTransitions = function(source, nodeHtmlDatasets){
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
			var image = d.dataContent ? d.dataContent.image : null;
			if(image) return null; // no bacground
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

Map.prototype.updateNodeDimensions = function(){
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

Map.prototype.updateSvgNodes = function(source) {
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

Map.prototype.updateLinkLabels = function(source) {
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

Map.prototype.updateLinks = function(source) {
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
			var diagonal;
			if(that.config.transitions.enter.animate.position){
				var o;
				if(that.config.transitions.enter.referToToggling){
					o = {x: source.x0, y: source.y0};
				}else{
					o = {x: d.source.x0, y: d.source.y0};
				}
				diagonal = that.diagonal(that)({source: o, target: o});
			}else{
				diagonal = that.diagonal(that)(d);
			}
			return diagonal;
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
			.attr("d", function(d){
				var diagonal;
				diagonal = that.diagonal(that)(d);
				return diagonal;
			});
	}else{
		linkUpdate
			.attr("d", function(d){
				var diagonal;
				diagonal = that.diagonal(that)(d);
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
	if(this.config.transitions.exit.animate.position || this.config.transitions.exit.animate.opacity){
		linkExitTransition = linkExit.transition()
			.duration(this.config.transitions.exit.duration);

		if(this.config.transitions.exit.animate.position){
			linkExitTransition
				.attr("d", function(d) {
					var diagonal;
					var o;
					if(that.config.transitions.exit.referToToggling){
						o = {x: source.x, y: source.y};
					}else{
						o = {x: d.source.x, y: d.source.y};
					}
					diagonal = that.diagonal(that)({source: o, target: o});
					return diagonal;
				});
		}else{
			linkExit
				.attr("d", function(d){
					var diagonal;
					diagonal = that.diagonal(that)(d);
					return diagonal;
				});
		}
		if(this.config.transitions.exit.animate.opacity){
			linkExitTransition
				.style("opacity", 1e-6);
		}
	}
	linkExitTransition
		.remove();
};

Map.prototype.initializeKeyboard = function() {
	// var that = this;

	var keyboardClientInterface = {
		updateNode: this.updateNode.bind(this),
		getDomFromDatum: this.getDomFromDatum.bind(this),
		clickNode: this.clickNode.bind(this),
		update: this.update.bind(this),
		createNode: this.createNode.bind(this),
		createEdge: this.createEdge.bind(this),
		getSelectedNode: function(){
			return this.selectedNode;
		}.bind(this),
		setSelectedNode: function(selectedNode){
			this.selectedNode = selectedNode;
		}.bind(this),
		addImage: function(node){
			this.clientApi.addImage(node);
		}.bind(this)
	};

	this.keyboardInteraction = new interaction.Keyboard(keyboardClientInterface);
	this.keyboardInteraction.init();
};

// http://interactjs.io/
// http://interactjs.io/docs/#interactables
Map.prototype.initializeManipulation = function() {
	var that = this;

	var manipulationEnded = function(targetD3){
		var d = targetD3 ? targetD3.datum() : null;
		/*
		Save:
		d.visual.dimensions.sizes.x = d.x;
		d.visual.dimensions.sizes.y = d.y;
		*/

		console.log("knalledge_map:manipulationEnded [%s]", d ? d.name : null);
		that.update(that.rootNode);
		//that.update(that.model.nodes[0]);
	};

	this.draggingConfig = {
		draggTargetElement: true,
		target: {
			refCategory: '.draggable',
			opacity:  0.5,
			zIndex: 10,
			cloningContainer: that.dom.divMapHtml.node(), // getting native dom element from D3 selector
			leaveAtDraggedPosition: false,
			callbacks: {
				onend: manipulationEnded
			}
		},
		debug: {
			origVsClone: false
		}
	};

	interaction.MoveAndDrag.InitializeDragging(this.draggingConfig);
};

}()); // end of 'use strict';