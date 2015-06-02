(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapVisualization =  knalledge.MapVisualization = function(){
};

MapVisualization.prototype._super = function(dom, mapStructure, configTransitions, configTree, configNodes, configEdges, rimaService, notifyService, mapPlugins, knalledgeMapViewService){
	this.dom = dom;
	this.mapStructure = mapStructure;

	this.configTransitions = configTransitions;
	this.configTree = configTree;
	this.configNodes = configNodes;
	this.configEdges = configEdges;
	this.editingNodeHtml = null;
	// size of visualizing DOM element
	this.mapSize = null;
	// scales used for transformation of knalledge from informational to visual domain
	this.scales = null;
	this.rimaService = rimaService;
	this.notifyService = notifyService;
	this.mapPlugins = mapPlugins;
	this.knalledgeMapViewService = knalledgeMapViewService;
};

MapVisualization.prototype.init = function(mapLayout, mapSize){
	this.mapSize = mapSize;
	this.scales = this.setScales();

	this.mapLayout = mapLayout;
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
};

MapVisualization.prototype.updateName = function(nodeView){
	var nodeSpan = nodeView.select("span");
	var newName = nodeSpan.text();
	if(newName === ""){
		newName = "name...";
		nodeSpan.text(newName);
	}
	var d = nodeView.datum();
	this.mapStructure.updateName(d, newName);
};

MapVisualization.prototype.updateNodeDimensions = function(){
	if(!this.configNodes.html.show) return;
	// var that = this;

	this.dom.divMapHtml.selectAll("div.node_html").each(function(d) {
		// Get centroid(this.d)
		d.width = parseInt(d3.select(this).style("width"));
		d.height = parseInt(d3.select(this).style("height"));
		// d3.select(this).style("top", function(d) { 
		// 	return "" + that.mapLayout.getHtmlNodePosition(d) + "px";
		// })
	});
};

MapVisualization.prototype.getDom = function(){
	return this.dom;
};

MapVisualization.prototype.setDomSize = function(maxX, maxY){
	if(typeof maxX == 'undefined') maxX = 5000;
	if(typeof maxY == 'undefined') maxY = 5000;

	if(maxX < this.mapSize[0]){
		maxX = this.mapSize[0];
	}
	if(maxY < this.mapSize[1]){
		maxY = this.mapSize[1];
	}

	this.dom.divMap
		.style("width", maxX)
		.style("height", maxY);		
	this.dom.divMapHtml
		.style("width", maxX)
		.style("height", maxY);		
	// TODO: fix to avoid use of selector
	this.dom.divMapSvg.select("svg")
		.style("width", maxX)
		.style("height", maxY);
};

MapVisualization.prototype.setScales = function(){
	// var that = this;

	var scales = {
		x: null,
		y: null,
		width: null,
		height: null
	};

	// var maxIntensity = d3.max(dataset, function(d) { return d.y; });
	// var minIntensity = d3.min(dataset, function(d) { return d.y; });

	if(false){
		var scale = d3.scale.linear()
			.domain([0, 1])
			.range([0, 1]);
		scales.x = scale;
		scales.y = scale;
		scales.width = scale;
		scales.height = scale;
	}else{
		var maxX = this.mapSize[0];
		var maxY = this.mapSize[1];

		var scaling = 1;

		scales.x = d3.scale.linear()
			.domain([0, maxY])
			.range([this.configTree.margin.top, this.configTree.margin.top+maxY]);
		scales.y = d3.scale.linear()
			.domain([0, maxX])
			.range([this.configTree.margin.left, this.configTree.margin.left+maxX]);

		scales.x = d3.scale.linear()
			.domain([0, 1])
			.range([0, scaling]);
		scales.y = d3.scale.linear()
			.domain([0, 1])
			.range([0, scaling]);

		scales.width = d3.scale.linear()
			.domain([0, maxX])
			.range([this.configTree.margin.left, this.configTree.margin.left+maxX]);
		scales.height = d3.scale.linear()
			.domain([0, maxY])
			.range([this.configTree.margin.top, this.configTree.margin.top+maxY]);

		scales.width = d3.scale.linear()
			.domain([0, 1])
			.range([0, scaling]);
		scales.height = d3.scale.linear()
			.domain([0, 1])
			.range([0, scaling]);
	}
	return scales;
};

MapVisualization.prototype.positionToDatum = function(datum) {
	// TODO: Add support for scales
	var y = datum.x - this.dom.parentDom.node().getBoundingClientRect().height/2;
	var x = datum.y - this.dom.parentDom.node().getBoundingClientRect().width/2;
	var divMapNative = this.dom.divMap.node();
	var divMapJQ = $(divMapNative);
	divMapJQ = $('.knalledge_map_container');
	// console.log("divMapJQ.scrollLeft(): %s, divMapJQ.scrollTop(): %s", divMapJQ.scrollLeft(), divMapJQ.scrollTop());

	// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
	// http://www.w3schools.com/jquery/css_scrolltop.asp
	// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
	// http://stackoverflow.com/questions/4897947/jquery-scrolling-inside-a-div-scrollto
	// https://api.jquery.com/scrollTop/
	// https://api.jquery.com/scrollleft/

	// 	// https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md
	var position = { x:divMapJQ.scrollLeft(), y:divMapJQ.scrollTop()};
	var target = { x:x, y:y};
	var tween = new TWEEN.Tween(position).to(target, 500);
	tween.easing(TWEEN.Easing.Exponential.InOut);
	tween.onUpdate(function(){
		divMapJQ.scrollLeft(position.x);
		divMapJQ.scrollTop(position.y);
	});

	var animatePositioning = function() {
		requestAnimationFrame(animatePositioning);
		TWEEN.update();
	};

	animatePositioning();

	// TWEEN.remove(tween);
	// this.shapeView.animations.transition.push(tween);
	
	console.log("[GameView.rotateShape] starting pushing = %s", tween);
	tween.start();

	// d3.transition().duration(2000)
	// 	.ease("linear").each(function(){
	// d3.selectAll(".foo").transition() .style("opacity",0)
	// .remove(); })
};

}()); // end of 'use strict';