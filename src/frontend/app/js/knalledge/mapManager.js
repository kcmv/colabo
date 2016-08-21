(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
@classdesc MapManager is a multiplexing class that is responsible for multiplexing map related objects like instances of MapVisualization<X> classes or MapLayout<X> classes, etc
@class MapManager
@memberof knalledge
*/

var ID=0;
var MapManager =  knalledge.MapManager = function(upperApi, parentDom, mapStructure, collaboPluginsService, configTransitions, configTree, configNodes, configEdges, rimaService, knalledgeState, notifyService, mapPlugins, knalledgeMapViewService, knAllEdgeRealTimeService, injector){
	this.id = ID++;
	console.log("[MapManager] instance-id: ", this.id);
	this.destroyed = false;
	/**
	 * References to map DOM elements
	 * @type {Object}
	 */
	this.dom = {
		parentDom: parentDom,
		divMap: null,
		divMapHtml: null,
		divMapSvg: null,
		svg: null
	};

	/**
	 * API to upper map layers (usually comming from `knalledge.Map` or even higher (like `knalledgeMap` directive))
	 * @type {Object}
	 */
	this.upperApi = upperApi;

	/**
	 * Map structure that holds map data
	 * @type {knalledge.MapStructure}
	 */
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

	this.mapPlugins = mapPlugins;

	this.knalledgeState = knalledgeState;
	this.rimaService = rimaService;
	this.notifyService = notifyService;
	this.knAllEdgeRealTimeService = knAllEdgeRealTimeService;
	this.injector = injector;

	/**
	 * Collection of map visualizations, where the hash array key is the name of visualization
	 * @type {Array.<string, knalledge.MapVisualization>}
	 */
	this.visualizations = {
		'viewspec_tree': null,
		'viewspec_manual': null,
		'viewspec_flat': null,
		'viewspec_graph': null
	};

	/**
	 * Collection of map visualization APIs, where the hash array key is the name of visualization
	 * and value is a reference to the API constructed for the named visualization
	 * @type {Array.<string, knalledge.MapLayout>}
	 */
	this.visualizationApis = {
		'viewspec_tree': null,
		'viewspec_manual': null,
		'viewspec_flat': null,
		'viewspec_graph': null
	};

	/**
	 * Collection of map layouts, where the hash array key is the name of layout
	 * @type {Array.<string, knalledge.MapLayout>}
	 */
	this.layouts = {
		'viewspec_tree': null,
		'viewspec_manual': null,
		'viewspec_flat': null,
		'viewspec_graph': null
	};

	/**
	 * Collection of map layout APIs, where the hash array key is the name of layout
	 * and value is a reference to the API constructed for the named layout
	 * @type {Array.<string, knalledge.MapLayout>}
	 */
	this.layoutApis = {
		'viewspec_tree': null,
		'viewspec_manual': null,
		'viewspec_flat': null,
		'viewspec_graph': null
	};

/***********************************
* Creating Tree & Manual (same)
************************************/

	// Visualization API
	this.visualizationApis.viewspec_tree = this.visualizationApis.viewspec_manual = {
		nodeClicked: this.upperApi.nodeClicked.bind(this.upperApi),
		nodeSelected: this.upperApi.nodeSelected.bind(this.upperApi),
		nodeUnselected: this.upperApi.nodeUnselected.bind(this.upperApi),
		nodeDblClicked: this.upperApi.nodeDblClicked.bind(this.upperApi),
		edgeClicked: this.upperApi.edgeClicked.bind(this.upperApi),
		nodeVote: this.upperApi.nodeVote.bind(this.upperApi),
		nodeMediaClicked: this.upperApi.nodeMediaClicked.bind(this.upperApi),
		nodeCreatorClicked: this.upperApi.nodeCreatorClicked.bind(this.upperApi),
		nodeTypeClicked: this.upperApi.nodeTypeClicked.bind(this.upperApi)
	};

	// Visualization
	this.visualizations.viewspec_tree = this.visualizations.viewspec_manual = new knalledge.MapVisualizationTree(this.dom,
		this.mapStructure, this.collaboPluginsService, this.configTransitions, this.configTree, this.configNodes,
		this.configEdges, this.rimaService, this.notifyService, this.mapPlugins, knalledgeMapViewService, this.visualizationApis.viewspec_tree);

	// Layout API
	this.layoutApis.viewspec_tree = this.layoutApis.viewspec_manual = {
		update: this.visualizations.viewspec_tree.update.bind(this.visualizations.viewspec_tree),
		setDomSize: this.visualizations.viewspec_tree.setDomSize.bind(this.visualizations.viewspec_tree),
		nodeSelected: this.upperApi.nodeSelected.bind(this.upperApi)
	};

	// Layout
	this.layouts.viewspec_tree = this.layouts.viewspec_manual = new knalledge.MapLayoutTreeCF(this.mapStructure,
		this.collaboPluginsService, this.configNodes, this.configTree, this.layoutApis.viewspec_tree, this.knalledgeState,
		this.knAllEdgeRealTimeService);

/***********************************
* Creating Flat (currently Tree)
************************************/

	// Visualization API
	this.visualizationApis.viewspec_flat = {
		nodeClicked: this.upperApi.nodeClicked.bind(this.upperApi),
		nodeSelected: this.upperApi.nodeSelected.bind(this.upperApi),
		nodeUnselected: this.upperApi.nodeUnselected.bind(this.upperApi),
		nodeDblClicked: this.upperApi.nodeDblClicked.bind(this.upperApi),
		edgeClicked: this.upperApi.edgeClicked.bind(this.upperApi)
	};

	// Visualization
	this.visualizations.viewspec_flat = new knalledge.MapVisualizationTree(this.dom, this.mapStructure,
		this.collaboPluginsService, this.configTransitions, this.configTree, this.configNodes, this.configEdges,
		this.rimaService, this.notifyService, mapPlugins, knalledgeMapViewService, this.visualizationApis.viewspec_flat );

	// Layout API
	this.layoutApis.viewspec_flat = {
		update: this.visualizations.viewspec_flat.update.bind(this.visualizations.viewspec_flat),
		setDomSize: this.visualizations.viewspec_flat.setDomSize.bind(this.visualizations.viewspec_flat),
		nodeSelected: this.upperApi.nodeSelected.bind(this.upperApi)
	};

	// Layout
	this.layouts.viewspec_flat = new knalledge.MapLayoutTreeCF(this.mapStructure, this.collaboPluginsService, this.configNodes,
		this.configTree, this.layoutApis.viewspec_flat, this.knalledgeState, this.knAllEdgeRealTimeService);

/***********************************
* Creating Graph
************************************/

	// Visualization API
	this.visualizationApis.viewspec_graph = {
		nodeClicked: this.upperApi.nodeClicked.bind(this.upperApi),
		nodeSelected: this.upperApi.nodeSelected.bind(this.upperApi),
		nodeUnselected: this.upperApi.nodeUnselected.bind(this.upperApi),
		nodeDblClicked: this.upperApi.nodeDblClicked.bind(this.upperApi),
		edgeClicked: this.upperApi.edgeClicked.bind(this.upperApi)
	};

	// Visualization
	this.visualizations.viewspec_graph = new knalledge.MapVisualizationGraph(this.dom, this.mapStructure,
		this.collaboPluginsService, this.configTransitions, this.configTree, this.configNodes, this.configEdges,
		this.rimaService, this.notifyService, mapPlugins, knalledgeMapViewService, this.visualizationApis.viewspec_graph);

	// Layout API
	this.layoutApis.viewspec_graph = {
		update: this.visualizations.viewspec_graph.update.bind(this.visualizations.viewspec_graph),
		setDomSize: this.visualizations.viewspec_graph.setDomSize.bind(this.visualizations.viewspec_graph),
		nodeSelected: this.upperApi.nodeSelected.bind(this.upperApi)
	};

	// Layout
	this.layouts.viewspec_graph = new knalledge.MapLayoutGraph(this.mapStructure, this.collaboPluginsService, this.configNodes,
		this.configTree, this.layoutApis.viewspec_graph, this.knalledgeState, this.knAllEdgeRealTimeService);

	// Setting default
	this.activeVisualization = this.visualizations[this.configTree.viewspec]
	this.activeLayout = this.layouts[this.configTree.viewspec];
	// this.activeVisualization = this.visualizations.viewspec_graph;
	// this.activeLayout = this.layouts.viewspec_graph;
};

/**
 * Creates sub DOM components in tha map DOM placeholder
 * NOTE: Not currently in the use
 * @param  {knalledge.MapLayout} mapLayout [description]
 * @param  {Array.<number>} mapSize - width and height of the map
 * @return {knalledge.MapManager}
 */
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

	return this;
};

/**
 * The function that is called when we are destroying parent.
 * It has to destroy, or at worst disable any subcomponent from working
 * @function destroy
 * @memberof knalledge.MapManager#
 */
MapManager.prototype.destroy = function(){
	console.log("[MapManager] destroying instance-id: ", this.id);
	this.destroyed = true;

	for(var vN in this.visualizations){
		this.visualizations[vN].destroy();
	}
	for(var vL in this.layouts){
		this.layouts[vL].destroy();
	}
};

/**
 * Returns object with DOM references
 * @function getDom
 * @memberof knalledge.MapManager#
 * @return {Object}
 */
MapManager.prototype.getDom = function(){
	return this.dom;
};

/**
 * Returns active map visualization
 * @function getActiveVisualization
 * @memberof knalledge.MapManager#
 * @return {knalledge.MapVisualization}
 */
MapManager.prototype.getActiveVisualization = function(){
	return this.activeVisualization;
};

/**
 * Returns active map layout
 * @function getActiveLayout
 * @memberof getActiveLayout.MapManager#
 * @return {Object}
 */
MapManager.prototype.getActiveLayout = function(){
	return this.activeLayout;
};

}()); // end of 'use strict';
