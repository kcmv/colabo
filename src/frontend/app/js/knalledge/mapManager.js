(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapManager =  knalledge.MapManager = function(clientApi, parentDom, mapStructure, configTransitions, configTree, configNodes, configEdges, rimaService, knalledgeState, notifyService, mapPlugins){
	this.dom = {
		parentDom: parentDom,
		divMap: null,
		divMapHtml: null,
		divMapSvg: null,
		svg: null
	};
	this.clientApi = clientApi;
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
	this.knalledgeState = knalledgeState;
	this.notifyService = notifyService;
	this.mapPlugins = mapPlugins;

	this.visualizations = {
		'tree': null,
		'manual': null,
		'flat': null
	};
	this.layouts = {
		'tree': null,
		'manual': null,
		'flat': null
	};
	this.layoutApis = {
		'tree': null,
		'manual': null,
		'flat': null
	};

	this.visualizations.tree = this.visualizations.manual = new knalledge.MapVisualizationTree(this.dom, this.mapStructure, this.configTransitions, this.configTree, this.configNodes, this.configEdges, this.rimaService, this.notifyService, this.mapPlugins);
	this.layoutApis.tree = this.layoutApis.manual = {
		update: this.visualizations.tree.update.bind(this.visualizations.tree),
		getDom: this.visualizations.tree.getDom.bind(this.visualizations.tree),
		setDomSize: this.visualizations.tree.setDomSize.bind(this.visualizations.tree),
		positionToDatum: this.visualizations.tree.positionToDatum.bind(this.visualizations.tree),
		nodeClicked: this.clientApi.nodeClicked.bind(this.clientApi)
	};
	this.layouts.tree = this.layouts.manual = new knalledge.MapLayoutTree(this.mapStructure, this.configNodes, this.configTree, this.layoutApis.tree, this.knalledgeState);

	this.visualizations.flat = new knalledge.MapVisualizationTree(this.dom, this.mapStructure, this.configTransitions, this.configTree, this.configNodes, this.configEdges, this.rimaService, this.notifyService, mapPlugins);
	this.layoutApis.flat = {
		update: this.visualizations.flat.update.bind(this.visualizations.flat),
		getDom: this.visualizations.flat.getDom.bind(this.visualizations.flat),
		setDomSize: this.visualizations.flat.setDomSize.bind(this.visualizations.flat),
		positionToDatum: this.visualizations.flat.positionToDatum.bind(this.visualizations.flat),
		nodeClicked: this.clientApi.nodeClicked.bind(this.clientApi)
	};
	this.layouts.flat = new knalledge.MapLayoutTree(this.mapStructure, this.configNodes, this.configTree, this.layoutApis.flat, this.knalledgeState);

	this.activeVisualization = this.visualizations.tree;
	this.activeLayout = this.layouts.tree;
	// this.activeVisualization = this.visualizations.flat;
	// this.activeLayout = this.layouts.flat;
};

MapManager.prototype.init = function(mapLayout, mapSize){
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

MapManager.prototype.getDom = function(){
	return this.dom;
};

MapManager.prototype.getActiveVisualization = function(){
	return this.activeVisualization;
};

MapManager.prototype.getActiveLayout = function(){
	return this.activeLayout;
};

}()); // end of 'use strict';