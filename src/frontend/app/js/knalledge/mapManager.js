(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapManager =  knalledge.MapManager = function(clientApi, parentDom, mapStructure, collaboPluginsService, configTransitions, configTree, configNodes, configEdges, rimaService, knalledgeState, notifyService, mapPlugins, knalledgeMapViewService, knAllEdgeRealTimeService){
	this.dom = {
		parentDom: parentDom,
		divMap: null,
		divMapHtml: null,
		divMapSvg: null,
		svg: null
	};
	this.clientApi = clientApi;
	this.mapStructure = mapStructure;
	this.collaboPluginsService = collaboPluginsService;

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
	this.knAllEdgeRealTimeService = knAllEdgeRealTimeService;

	this.visualizations = {
		'viewspec_tree': null,
		'viewspec_manual': null,
		'viewspec_flat': null,
		'viewspec_graph': null
	};
	this.layouts = {
		'viewspec_tree': null,
		'viewspec_manual': null,
		'viewspec_flat': null,
		'viewspec_graph': null
	};
	this.layoutApis = {
		'viewspec_tree': null,
		'viewspec_manual': null,
		'viewspec_flat': null,
		'viewspec_graph': null
	};

	this.visualizations.viewspec_tree = this.visualizations.viewspec_manual = new knalledge.MapVisualizationTree(this.dom, this.mapStructure, this.collaboPluginsService, this.configTransitions, this.configTree, this.configNodes, this.configEdges, this.rimaService, this.notifyService, this.mapPlugins, knalledgeMapViewService);
	this.layoutApis.viewspec_tree = this.layoutApis.viewspec_manual = {
		update: this.visualizations.viewspec_tree.update.bind(this.visualizations.viewspec_tree),
		getDom: this.visualizations.viewspec_tree.getDom.bind(this.visualizations.viewspec_tree),
		setDomSize: this.visualizations.viewspec_tree.setDomSize.bind(this.visualizations.viewspec_tree),
		positionToDatum: this.visualizations.viewspec_tree.positionToDatum.bind(this.visualizations.viewspec_tree),
		nodeClicked: this.clientApi.nodeClicked.bind(this.clientApi),
		selectNode: this.clientApi.selectNode
	};
	this.layouts.viewspec_tree = this.layouts.viewspec_manual = new knalledge.MapLayoutTree(this.mapStructure, this.collaboPluginsService, this.configNodes, this.configTree, this.layoutApis.viewspec_tree, this.knalledgeState, this.knAllEdgeRealTimeService);

	this.visualizations.viewspec_flat = new knalledge.MapVisualizationTree(this.dom, this.mapStructure, this.collaboPluginsService, this.configTransitions, this.configTree, this.configNodes, this.configEdges, this.rimaService, this.notifyService, mapPlugins, knalledgeMapViewService);
	this.layoutApis.viewspec_flat = {
		update: this.visualizations.viewspec_flat.update.bind(this.visualizations.viewspec_flat),
		getDom: this.visualizations.viewspec_flat.getDom.bind(this.visualizations.viewspec_flat),
		setDomSize: this.visualizations.viewspec_flat.setDomSize.bind(this.visualizations.viewspec_flat),
		positionToDatum: this.visualizations.viewspec_flat.positionToDatum.bind(this.visualizations.viewspec_flat),
		nodeClicked: this.clientApi.nodeClicked.bind(this.clientApi),
		selectNode: this.clientApi.selectNode
	};
	this.layouts.viewspec_flat = new knalledge.MapLayoutTree(this.mapStructure, this.collaboPluginsService, this.configNodes, this.configTree, this.layoutApis.viewspec_flat, this.knalledgeState, this.knAllEdgeRealTimeService);

	this.visualizations.viewspec_graph = new knalledge.MapVisualizationGraph(this.dom, this.mapStructure, this.collaboPluginsService, this.configTransitions, this.configTree, this.configNodes, this.configEdges, this.rimaService, this.notifyService, mapPlugins, knalledgeMapViewService);
	this.layoutApis.viewspec_graph = {
		update: this.visualizations.viewspec_graph.update.bind(this.visualizations.viewspec_graph),
		getDom: this.visualizations.viewspec_graph.getDom.bind(this.visualizations.viewspec_graph),
		setDomSize: this.visualizations.viewspec_graph.setDomSize.bind(this.visualizations.viewspec_graph),
		positionToDatum: this.visualizations.viewspec_graph.positionToDatum.bind(this.visualizations.viewspec_graph),
		nodeClicked: this.clientApi.nodeClicked.bind(this.clientApi),
		selectNode: this.clientApi.selectNode
	};
	this.layouts.viewspec_graph = new knalledge.MapLayoutGraph(this.mapStructure, this.collaboPluginsService, this.configNodes, this.configTree, this.layoutApis.viewspec_graph, this.knalledgeState, this.knAllEdgeRealTimeService);

	this.activeVisualization = this.visualizations[this.configTree.viewspec]
	this.activeLayout = this.layouts[this.configTree.viewspec];
	// this.activeVisualization = this.visualizations.viewspec_graph;
	// this.activeLayout = this.layouts.viewspec_graph;
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
