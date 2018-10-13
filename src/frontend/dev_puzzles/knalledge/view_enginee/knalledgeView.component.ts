import { Component, ReflectiveInjector, Injector, Inject, Optional, NgModule, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {KMapClientInterface} from './code/knalledge/KMapClientInterface';
import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';

import {Map} from './code/knalledge/map'

/**
TODO: See how does this kind of documentation work with TS, NG2+, ...
 * the namespace for core services for the KnAllEdge system
 * @namespace knalledge.knalledgeMap.knalledgeMapDirectives
 */

/** TODO:<export>
Probable we should move this to some utils folder/file/package/puzzle
*/
declare var window;
declare var setTimeout: Function;
declare var d3;
declare var knalledge;

var SLASH_ENCODING = '___';

// duplicated at components/rima/directives.js
var decodeRoute = function(routeEncoded) {
  var route = decodeURI(routeEncoded);
  var slashIndex = 0;

  // replace the first level
  var slash0 = SLASH_ENCODING + "0";
  var rx = new RegExp(slash0, 'gi');
  route = route.replace(rx, '/');

  // decrease next levels
  for (var i = 1; i < 10; i++) {
    var slashCurrent = SLASH_ENCODING + i;
    var rx = new RegExp(slashCurrent, 'gi');
    var slashLess = SLASH_ENCODING + (i - 1);
    route = route.replace(rx, slashLess);
  }
  return route;
};

/** TODO:</export>
*/

/**
events
*/

var moduleImports = [];

@NgModule({
  imports: moduleImports
})

@Component({
  selector: 'knalledge-view',
  templateUrl: './knalledgeView.component.tpl.html'
  // styleUrls: ['./app.component.css']
})

/**
* @class knalledgeMap
* @memberof knalledge.knalledgeMap.knalledgeMapDirectives
*/
export class KnalledgeViewComponent implements OnInit, AfterViewInit, OnDestroy{
  public title: string = 'FDB Knowledge Graph';
  // a route retrieved and decoded from the `route` parameter of the route
  private route: string;
  private subscriptions: any[];
  /** @var {knalledge.Map} knalledgeMap */
  private knalledgeMap:Map = null;
  private config:any = null;
  private kMapClientInterface:KMapClientInterface;
  private knalledgeMapInjector:Injector;

  // dependencies
  private $injector:any;
  private $rootScope:any;
  private $route:any;
  private $routeParams:any;
  private $location:any;
  private KnalledgeMapViewService:any;
  private KnAllEdgeSelectItemService:any;
  private KnalledgeMapPolicyService:any;
  private CollaboPluginsService:any;
  private Plugins:any;

  private KnalledgeMapVOsService:any;
  private KnalledgeMapService:any;
  private SyncingService:any;
  private IbisTypesService:any;
  private NotifyService:any;
  private GlobalEmittersArrayService:any;
  private KnAllEdgeRealTimeService:any;
  private RimaService:any;
  private CollaboGrammarService:any;

  // event names
  public KnRealTimeviewConfigChangedEvent = "view-config-change";
  public KnRealTimeBehaviourChangedEvent = "map-behaviour-change";
  public KnRealTimeBroadcastUpdateMaps = "update-maps";
  public KnRealTimeBroadcastReloadMaps = "reload-maps";

  public changeKnalledgePropertyEvent = "changeKnalledgePropertyEvent";
  public knalledgeMapUpdateEvent = "knalledgeMapUpdateEvent";
  public mapEntitySelectedEvent = "mapEntitySelectedEvent";
  public changeKnalledgeRimaEvent = "changeKnalledgeRimaEvent";
  public changeSelectedNodeEvent = "changeSelectedNodeEvent";
  public selectedNodeChangedEvent = "selectedNodeChangedEvent";
  public KnRealTimeNodeCreatedEvent = "node-created-to-visual";
  public KnRealTimeNodeDeletedEvent = "node-deleted-to-visual";
  public KnRealTimeNodeUpdatedEvent = "node-updated-to-visual";
  public KnRealTimeEdgeCreatedEvent = "edge-created-to-visual";
  public KnRealTimeEdgeUpdatedEvent = "edge-updated-to-visual";
  public KnRealTimeEdgeDeletedEvent = "edge-deleted-to-visual";
  public modelLoadedEvent = "modelLoadedEvent";
  public knalledgePropertyChangedEvent = "knalledgePropertyChangedEvent";
  public knalledgePropertyChangedFinishedEvent = "knalledgePropertyChangedFinishedEvent";
  public behaviourChangedEvent = "behaviourChangedEvent";
  public nodeMediaClickedEvent = "nodeMediaClickedEvent";
  public viewConfigChangedEvent = "viewConfigChangedEvent";
  public broadcastingChangedEvent = "broadcastingChangedEvent";

  // TODO: these should be @input parameters
  private mapData:any;
  private mapConfig:any;
  private nodeSelected:Function;

  // a reference of a map placeholder inside the component's DOM
  // 'map_container' is a name (string) of a template variable
  // inside the component's template
  @ViewChild('map_container', { read: ElementRef }) mapContainer: ElementRef;
  /**
   * @memberof knalledge.knalledgeMap.knalledgeMapDirectives.knalledgeMap#
   * @constructor
   * @param {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeNodeService} KnalledgeNodeService
   * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeEdgeService} KnalledgeEdgeService
   * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService} KnalledgeMapVOsService
   * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapService} KnalledgeMapService
   * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapViewService} KnalledgeMapViewService
   * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeSelectItemService} KnAllEdgeSelectItemService
   * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapPolicyService} KnalledgeMapPolicyService
   * @param  {knalledge.collaboPluginsServices.CollaboPluginsService} CollaboPluginsService
   * @param  {knalledge.knalledgeMap.knalledgeMapServices.SyncingService} SyncingService
   * @param  {utils.Injector} injector
   * @param  {config.Plugins}  Plugins
   */

  constructor(
    private ng2injector:Injector,
    private activatedRoute: ActivatedRoute
    // @Optional @Inject('$injector') private $injector:any,
    // @Optional @Inject('$rootScope') private $rootScope:any,
    // @Optional @Inject('$route') private $route:any,
    // @Optional @Inject('$routeParams') private $routeParams:any,
    // @Optional @Inject('$location') private $location:any,
    // @Optional @Inject('KnalledgeMapViewService') private KnalledgeMapViewService:any,
    // @Optional @Inject('KnAllEdgeSelectItemService') private KnAllEdgeSelectItemService:any,
    // @Optional @Inject('KnalledgeMapPolicyService') private KnalledgeMapPolicyService:any,
    // @Optional @Inject('CollaboPluginsService') private CollaboPluginsService:any,
    // @Optional @Inject('injector') private injector:any,
    // @Optional @Inject('Plugins') private Plugins:any
  ) {
    this.$injector = this.ng2injector.get('$injector', null);
    this.$rootScope = this.ng2injector.get('$rootScope', null);
    this.$route = this.ng2injector.get('$route', null);
    this.$routeParams = this.ng2injector.get('$routeParams', null);
    this.$location = this.ng2injector.get('$location', null);
    this.KnalledgeMapViewService = this.ng2injector.get('KnalledgeMapViewService', null);
    this.KnAllEdgeSelectItemService = this.ng2injector.get('KnAllEdgeSelectItemService', null);
    this.KnalledgeMapPolicyService = this.ng2injector.get('KnalledgeMapPolicyService', null);
    this.CollaboPluginsService = this.ng2injector.get('CollaboPluginsService', null);
    this.Plugins = this.ng2injector.get('Plugins', null);
  }

  getInitialParams() {
      const nodeId = this.activatedRoute.snapshot.paramMap.get('nodeId');
      console.log("[KnalledgeViewComponent] nodeId: ", nodeId);
  }

  ngOnInit() {
    this.getInitialParams();
    this.loadDynamicServices();
    this.registerToGlobalEvents();

    /**
    TODO:ng2 find equivalent
    if (this.$routeParams.route) {
      this.route = decodeRoute(this.$routeParams.route);
    }
    */

  }

  ngAfterViewInit(){
    this.subscriptions = [];
    setTimeout(function() {
      this.delayedFunc();
    }.bind(this), 500);
  }

  ngOnDestroy() {
    // alert("knalledge.knalledgeMap directive is about to be destroyed!");
    for (var i in this.subscriptions) {
      // http://stackoverflow.com/questions/36494509/how-to-unsubscribe-from-eventemitter-in-angular-2
      this.subscriptions[i].unsubscribe();
    }
    this.knalledgeMap.destroy();
  }

  private initKnalledgeMap(){
    /**
     * Plugins that are provided to the knalledge.Map
     * @type {Object}
     */
    var mapPlugins = this.getPluginsForKnalledgeMap();

    // create an callback-like interface for knalledge.Map instance
    // it will provide it a feedback and callback to the hosting environment
    // our directive (this one)
    this.kMapClientInterface = new KMapClientInterface(
      this.$routeParams,
      this.$route,

      this.GlobalEmittersArrayService,
      this.KnalledgeMapPolicyService,
      this.KnalledgeMapVOsService,
      this.KnAllEdgeSelectItemService,
      this.RimaService,

      this.knalledgeMap,

      this.changeKnalledgePropertyEvent,
      this.selectedNodeChangedEvent,
      this.mapEntitySelectedEvent,
      this.nodeMediaClickedEvent,
      this.nodeSelected
    );

    // a reference of a dom element
    // (currently a div inside the directive's template)
    // that should contain visual representation of the knowledge graph
    var knalledgeMapDomVisualContainer = null;
    // TODO:ng2 find replacement
    // $element.find("#map_container").get(0);
    var knalledgeMapDomVisualContainerD3 = null;
    if(this.mapContainer){
      knalledgeMapDomVisualContainerD3 = d3.select(this.mapContainer.nativeElement);
    }else{
      console.error("[knalledgeView.component] Error: this.mapContainer.nativeElement is not available");
      // should work as a fallback approach, but not a good solution
      knalledgeMapDomVisualContainerD3 = d3.select("knalledge_map_container");
    }

    // initialize the knalledge.Map instance
    this.knalledgeMap = new Map(
      knalledgeMapDomVisualContainerD3,
      this.config, this.kMapClientInterface, null,
      this.config.tree.mapService.enabled ? this.KnalledgeMapVOsService : null,
      // if this.mapData is set, we do not use KnalledgeMapVOsService.mapStructure but let knalledge.Map to create a new mapStructure and build VKs from Ks
      this.checkData(this.mapData) ? null :
      (this.KnalledgeMapVOsService ? this.KnalledgeMapVOsService.mapStructure : null),
      this.CollaboPluginsService, this.RimaService, this.IbisTypesService, this.NotifyService, mapPlugins, this.KnalledgeMapViewService, this.SyncingService, this.KnAllEdgeRealTimeService, this.KnalledgeMapPolicyService, this.knalledgeMapInjector, this.Plugins
    );
    this.knalledgeMap.init();

    // providing select item service with the context
    // https://docs.angularjs.org/api/ng/function/angular.element
    // TODO: This seems as wrong, because it is addressing the parent container (main.ts component)
    // TODO:ng2 find replacement
    // var el = angular.element('.knalledge_map_middle');
    var el = null;
    // TODO:ng2 we should not use this way anymore (it is creating a new scope and compiling directive, etc)
    // this.KnAllEdgeSelectItemService.init(this.knalledgeMap, $scope, el);

    this.registerToGlobalEventsAfterInit();
  }

  private getPluginsForKnalledgeMap():any{
    /**
     * Plugins that are provided to the knalledge.Map
     * @type {Object}
     */
    var mapPlugins = {};

    // here we provide the names of all plugins
    // that we care for
    var pluginsOfInterest = {
      mapVisualizePlugins: true,
      mapVisualizeHaloPlugins: true,
      mapInteractionPlugins: true,
      keyboardPlugins: true
    };

    // TODO:ng2 we need to inject it at the lower level, like app.module.ts, ...
    var PluginsPreloader = this.ng2injector.get("puzzles.collaboPlugins.PluginsPreloader", null);
    // populate in all plugins of interest
    // TODO:ng2 before was our `this.injector` instead of `this.ng2injector`
    // which is different scope, etc, so not equivalent, but it shouldn't matter
    // we didn't use it that much, but we still need to rethink about all this
    if(PluginsPreloader) PluginsPreloader.populateInPluginsOfInterest(
      pluginsOfInterest, this.$injector, this.ng2injector, mapPlugins);

    return mapPlugins;
  }

  // this is registration of events after the init() function is called
  // TODO: if init() is not necessary to called with a delay but can be called
  // from the ngOnInit() instead, then this might be merged with
  // registerToGlobalEvents() method
  private registerToGlobalEventsAfterInit(){
    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.KnRealTimeNodeCreatedEvent).subscribe('knalledgeMap', this.knalledgeMap.processExternalChangesInMap.bind(this.knalledgeMap)));
    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.KnRealTimeNodeUpdatedEvent).subscribe('knalledgeMap', this.knalledgeMap.processExternalChangesInMap.bind(this.knalledgeMap)));
    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.KnRealTimeNodeDeletedEvent).subscribe('knalledgeMap', this.knalledgeMap.processExternalChangesInMap.bind(this.knalledgeMap)));

    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.KnRealTimeEdgeCreatedEvent).subscribe('knalledgeMap', this.knalledgeMap.processExternalChangesInMap.bind(this.knalledgeMap)));
    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.KnRealTimeEdgeUpdatedEvent).subscribe('knalledgeMap', this.knalledgeMap.processExternalChangesInMap.bind(this.knalledgeMap)));
    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.KnRealTimeEdgeDeletedEvent).subscribe('knalledgeMap', this.knalledgeMap.processExternalChangesInMap.bind(this.knalledgeMap)));
  }

  private loadDynamicServices(){
    // getting services dinamicaly by injecting
    try {
      this.KnalledgeMapVOsService = this.$injector ? this.$injector.get('KnalledgeMapVOsService') : null;
    } catch (err) {
      console.warn("[knalledgeMapDirectives:knalledgeMap] Error while trying to retrieve the KnalledgeMapVOsService service:", err);
    }
    try {
      this.KnalledgeMapService = this.$injector ? this.$injector.get('KnalledgeMapService') : null;
    } catch (err) {
      console.warn("[knalledgeMapDirectives:knalledgeMap] Error while trying to retrieve the KnalledgeMapService service:", err);
    }
    try {
      this.SyncingService = this.$injector ? this.$injector.get('SyncingService') : null;
    } catch (err) {
      console.warn("[knalledgeMapDirectives:knalledgeMap] Error while trying to retrieve the SyncingService service:", err);
    }

    // here we can inject config object/service
    // that will pull/provide services across the system
    // depending on available (which is configurabe) components/plugins
    // and services
    try {
      // * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService} KnAllEdgeRealTimeService
      this.IbisTypesService = this.$injector ? this.$injector.get('IbisTypesService') : null;
    } catch (err) {
      console.warn("Error while trying to retrieve the IbisTypesService service:", err);
    }
    try {
      // * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService} KnAllEdgeRealTimeService
      this.NotifyService = this.$injector ? this.$injector.get('NotifyService') : null;
    } catch (err) {
      console.warn("Error while trying to retrieve the NotifyService service:", err);
    }
    this.GlobalEmittersArrayService = this.ng2injector.get(GlobalEmittersArrayService, null);

    try {
      // * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService} KnAllEdgeRealTimeService
      this.KnAllEdgeRealTimeService = this.Plugins.puzzles.knalledgeMap.config.knAllEdgeRealTimeService.available ?
        (this.$injector ? this.$injector.get('KnAllEdgeRealTimeService') : null) : null;
    } catch (err) {
      console.warn("Error while trying to retrieve the KnAllEdgeRealTimeService service:", err);
    }
    try {
      // * @param  {rima.rimaServices.RimaService}  RimaService
      this.RimaService = this.Plugins.puzzles.rima.config.rimaService.available ?
        this.$injector ? this.$injector.get('RimaService') : null : null;
    } catch (err) {
      console.warn(err);
    }

    try {
      // * @param {knalledge.collaboPluginsServices.CollaboGrammarService} CollaboGrammarService
      this.CollaboGrammarService = this.Plugins.puzzles.collaboGrammar.config.collaboGrammarService.available ?
        this.$injector ? this.$injector.get('CollaboGrammarService') : null : null;
    } catch (err) {
      console.warn(err);
    }

    // bring additional dependencies for the knalledge.Map instance


    var providers = [
      // TODO:ng2 clean-out any use of $timeout, we can use native now
      // {provide: "timeout", useValue: $timeout},
      {provide: "collaboPlugins.CollaboGrammarService", useValue: this.CollaboGrammarService},
      {provide: "collaboPlugins.globalEmitterServicesArray", useValue: this.GlobalEmittersArrayService}
    ];
    // this is for ng5
    // https://angular.io/api/core/Injector
    // this.knalledgeMapInjector = Injector.create(providers);

    // this is for ng4
    this.knalledgeMapInjector = ReflectiveInjector.resolveAndCreate(providers);
  }

  private registerToGlobalEvents(){
    //duplikat: var GlobalEmittersArrayService = $injector.get('GlobalEmittersArrayService');

    this.GlobalEmittersArrayService.register(this.changeKnalledgePropertyEvent);
    this.GlobalEmittersArrayService.register(this.knalledgeMapUpdateEvent);
    this.GlobalEmittersArrayService.register(this.mapEntitySelectedEvent);
    this.GlobalEmittersArrayService.register(this.changeKnalledgeRimaEvent);
    this.GlobalEmittersArrayService.register(this.changeSelectedNodeEvent);
    this.GlobalEmittersArrayService.register(this.selectedNodeChangedEvent);

    this.GlobalEmittersArrayService.register(this.KnRealTimeNodeCreatedEvent);
    this.GlobalEmittersArrayService.register(this.KnRealTimeNodeDeletedEvent);
    this.GlobalEmittersArrayService.register(this.KnRealTimeNodeUpdatedEvent);

    this.GlobalEmittersArrayService.register(this.KnRealTimeEdgeCreatedEvent);
    this.GlobalEmittersArrayService.register(this.KnRealTimeEdgeUpdatedEvent);
    this.GlobalEmittersArrayService.register(this.KnRealTimeEdgeDeletedEvent);

    this.GlobalEmittersArrayService.register(this.modelLoadedEvent);

    this.GlobalEmittersArrayService.register(this.knalledgePropertyChangedEvent);
    this.GlobalEmittersArrayService.register(this.knalledgePropertyChangedFinishedEvent);

    this.GlobalEmittersArrayService.register(this.behaviourChangedEvent);

    this.GlobalEmittersArrayService.register(this.nodeMediaClickedEvent);

    // http://docs.angularjs.org/guide/directive
  }

  /**
   * Loads map with specific map id
   * @param  {string} mapId the id of the map to be loaded
   */
  loadMapWithId(mapId:string) {
    /**
     * Callback after loading map object from the KnalledgeMapService
     * @param  {knalledge.KMap} kMap - map object
     */
    var gotMap = function(kMap) {
      console.log('gotMap:' + JSON.stringify(kMap));
      console.log('KnalledgeMapService.map:', this.KnalledgeMapService.map);
      // this method broadcasts the 'modelLoadedEvent' event after loading and processing kMap
      // this event is subscribed bellow for
      this.KnalledgeMapVOsService.loadAndProcessData(kMap, function() {
        if (this.route) {
          // alert("redirecting to: " + this.route);
          if (this.route.indexOf("http") < 0) {
            /**
            TODO:ng2 find equivalent
            this.$location.path(this.route);
            */
          } else {
            window.location.href = this.route;
          }
        }
      });
    };

    console.warn("loading map by mcmMapDirectives: mapId: " + mapId);

    // TODO: FIX: promise doesn't work well, we need callback
    // KnalledgeMapService.getById(mapId).$promise.then(gotMap);
    if(this.KnalledgeMapService) this.KnalledgeMapService.getById(mapId, gotMap);
    else{
      console.error("[knalledgeView.component] Error: this.KnalledgeMapService service is not available")
    }
  }

  delayedFunc() {
    this.init();
    this.initKnalledgeMap();
    if (this.checkData(this.mapData)) {
      // console.warn('have this.mapData:' + JSON.stringify(this.mapData));
      this.setData(this.mapData);
    } else {
      /**
      TODO:ng2 find equivalent
      this.loadMapWithId(this.$routeParams.id);
      */
      // this.loadMapWithId("fake_id_until_TODO:ng2_solved");
    }

    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.modelLoadedEvent).subscribe('knalledgeMap', function(eventModel) {
      // there is only one listener so we can stop further propagation of the event
      // e.stopPropagation();
      // knalledgeMap.placeModels(eventModel);
      this.setData(eventModel);
    }));

    // TODO:ng2 we should find replacement, and see if this is still necessary
    // I guess it is not since we can have observables on the @Input change
    /*
    $scope.$watch(function() {
      return this.mapData;
    },
    function(newValue) {
      //alert("RimaService.howAmIs changed: " + JSON.stringify(newValue));
      if (newValue) this.setData(newValue);
    }, true);
    */

    function knalledgePropertyCallback(nodeContentChanged, isFinal){
      // 	var vkNode = knalledgeMap.mapStructure.getSelectedNode();
      var vkNode = nodeContentChanged.node;

      var knalledgePropertyBefore = undefined;
      var knalledgeProperty = nodeContentChanged.property;
      var knalledgePropertyTypeBefore = undefined;
      var knalledgePropertyType = nodeContentChanged.propertyType;
      if (vkNode) {
        console.log("[knalledgeMap.controller::$on:%s] vkNode[%s](%s): (old knalledgeProperty: %s), knalledgeProperty: %s", this.knalledgePropertyChangedEvent, vkNode.id, vkNode.kNode._id,
          (vkNode.kNode.dataContent ? vkNode.kNode.dataContent.property : null),
          knalledgeProperty);

        if (!vkNode.kNode.dataContent) vkNode.kNode.dataContent = {};
        if (vkNode.kNode.dataContent.property) knalledgePropertyBefore = vkNode.kNode.dataContent.property;
        if (vkNode.kNode.dataContent.propertyType) knalledgePropertyTypeBefore = vkNode.kNode.dataContent.propertyType;

        var updateType = knalledge.MapStructure.UPDATE_DATA_CONTENT;
        if(!isFinal){
          if (knalledgePropertyBefore === knalledgeProperty && knalledgeProperty === knalledgePropertyTypeBefore) return;
          if (!knalledgePropertyBefore && !knalledgeProperty) return;
        }else{
          updateType = knalledge.MapStructure.UPDATE_DATA_CONTENT_FINAL;
        }

        vkNode.kNode.dataContent.property = knalledgeProperty;
        vkNode.kNode.dataContent.propertyType = knalledgePropertyType;

        this.knalledgeMap.mapStructure.updateNode(vkNode, updateType);
      } else {
        console.log("[knalledgeMap.controller::$on:%s] node not selected. knalledgeProperty: %s", this.knalledgePropertyChangedEvent, knalledgeProperty, knalledgePropertyType);
      }
    }

    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.knalledgePropertyChangedEvent).subscribe('knalledgeMap', function(nodeContentChanged) {
      knalledgePropertyCallback(nodeContentChanged, false);
    }));

    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.knalledgePropertyChangedFinishedEvent).subscribe('knalledgeMap', function(nodeContentChanged) {
      knalledgePropertyCallback(nodeContentChanged, true);
    }));

    var toolsChange = function(eventName, msg) {
      this.knalledgeMap.update();
      // realtime distribution
      if (this.KnAllEdgeRealTimeService) {
        this.KnAllEdgeRealTimeService.emit(eventName, msg);
      }
    };

    var viewConfigChanged = function(msg) {
      //setData(model);
      console.log("[knalledgeMap.controller::$on] event: %s", this.viewConfigChangedEvent);
      if (msg.path == 'config.visualization.viewspec') {
        this.config.tree.viewspec = msg.value;
        if(this.KnalledgeMapViewService)
          this.KnalledgeMapViewService.provider.config.tree.viewspec = msg.value;
      }
      if (msg.path == 'config.edges.orderBy') {
        this.config.edges.orderBy = msg.value;
        if(this.KnalledgeMapViewService)
          this.KnalledgeMapViewService.provider.config.edges.orderBy = msg.value;
      }
      toolsChange(this.KnRealTimeviewConfigChangedEvent, msg);
    };

    function knalledgeMapUpdate() {
      this.knalledgeMap.update();
    }

    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.knalledgeMapUpdateEvent).subscribe('knalledgeMap', knalledgeMapUpdate));

    this.GlobalEmittersArrayService.register(this.viewConfigChangedEvent);
    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.viewConfigChangedEvent).subscribe('knalledgeMap', viewConfigChanged));

    var behaviourChanged = function(msg) {
      //setData(model);
      console.log("[knalledgeMap.controller::$on] event: %s", this.behaviourChangedEvent);
      toolsChange(this.KnRealTimeBehaviourChangedEvent, msg);
      updateState(msg.value);
    };
    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.behaviourChangedEvent).subscribe('knalledgeMap', behaviourChanged));

    var updateState = function(value) {
      if (!this.KnalledgeMapPolicyService) return;
      if (value === 0) {
        this.KnalledgeMapPolicyService.provider.config.state = {
          id: 0,
          name: ''
        };
      } else {
        this.KnalledgeMapPolicyService.provider.config.state = {
          id: value,
          name: 'Brainstorming (' + value + ')'
        };
      }
    }

    var realTimeBehaviourChanged = function(eventName, msg) {
      console.log('realTimeBehaviourChanged:', eventName, 'msg:', msg);

      switch (msg.path) {
        // case 'policyConfig.behaviour.brainstorming':
        // 	if(KnalledgeMapPolicyService) KnalledgeMapPolicyService.provider.config.behaviour.brainstorming = msg.value;
        // 	break;
      }
      updateState(msg.value);
      this.knalledgeMap.update();
    }

    // realtime listener registration
    if (this.KnAllEdgeRealTimeService) {
      /**
       * registered to event `KnRealTimeviewConfigChangedEvent`, to be called by `KnAllEdgeRealTimeService` from `mapStructure.service `
       * @param  {string} eventName [description]
       * @param  {Object} msg       [description]
       * @return {[type]}           [description]
       */
      var realTimeviewConfigChanged = function(eventName, msg) {

        //TODO: this should not be treated as viewConfig change but as other type
        if (msg.path == 'policyConfig.broadcasting.enabled' && msg.value) { // Highlander: There can be only one!
          if(this.KnalledgeMapPolicyService) this.KnalledgeMapPolicyService.provider.config.broadcasting.enabled = false;
        }

        // !this.KnalledgeMapPolicyService => receiveVisualization == true
        if (this.KnalledgeMapPolicyService && !this.KnalledgeMapPolicyService.provider.config.broadcasting.receiveVisualization) {
          return;
        }
        switch (msg.path) {
          case 'config.nodes.showImages':
            if(this.KnalledgeMapViewService)
              this.KnalledgeMapViewService.provider.config.nodes.showImages = msg.value;
            break;
          case 'config.nodes.showTypes':
            if(this.KnalledgeMapViewService)
              this.KnalledgeMapViewService.provider.config.nodes.showTypes = msg.value;
            break;
          case 'config.edges.showNames':
            if(this.KnalledgeMapViewService)
              this.KnalledgeMapViewService.provider.config.edges.showNames = msg.value;
            break;
          case 'config.edges.showTypes':
            if(this.KnalledgeMapViewService)
              this.KnalledgeMapViewService.provider.config.edges.showTypes = msg.value;
            break;
          case 'config.visualization.viewspec':
            if(this.KnalledgeMapViewService)
              this.KnalledgeMapViewService.provider.config.visualization.viewspec = msg.value;
            this.config.visualization.viewspec = msg.value;
            break;
          case 'config.edges.orderBy':
            if(this.KnalledgeMapViewService)
              this.KnalledgeMapViewService.provider.config.edges.orderBy = msg.value;
            this.config.edges.orderBy = msg.value;
            break;
          case 'config.filtering.displayDistance':
            if(this.KnalledgeMapViewService)
              this.KnalledgeMapViewService.provider.config.filtering.displayDistance = msg.value;
            break;
          case 'config.filtering.visbileTypes.ibis':
            if(this.KnalledgeMapViewService)
              this.KnalledgeMapViewService.provider.config.filtering.visbileTypes.ibis = msg.value;
            break;
        }
        this.knalledgeMap.update();
      };

      // var realTimeMapViewspecChanged = function(eventName, newViewspec){
      // 	console.log("[knalledgeMap.controller::realTimeMapViewspecChanged] newViewspec: %s", newViewspec);
      // 	config.tree.viewspec = newViewspec;
      // 	knalledgeMap.update();
      // };

      var mapViewPluginOptions = {
        name: "mapView",
        events: {}
      };

      mapViewPluginOptions.events[this.KnRealTimeBroadcastUpdateMaps] = this.knalledgeMap.update.bind(this.knalledgeMap);

      /**
      TODO:ng2 find equivalent ("fake_id_until_TODO:ng2_solved")
      mapViewPluginOptions.events[this.KnRealTimeBroadcastReloadMaps] = this.loadMapWithId.bind(null, this.$routeParams.id);
      */
      mapViewPluginOptions.events[this.KnRealTimeBroadcastReloadMaps] = this.loadMapWithId.bind(null, "fake_id_until_TODO:ng2_solved");

      mapViewPluginOptions.events[this.KnRealTimeviewConfigChangedEvent] = realTimeviewConfigChanged.bind(this);

      mapViewPluginOptions.events[this.KnRealTimeBehaviourChangedEvent] = realTimeBehaviourChanged.bind(this);

      this.KnAllEdgeRealTimeService.registerPlugin(mapViewPluginOptions);
    }

      // this.subscriptions.push(GlobalEmittersArrayService.get(broadcastingChangedEvent).subscribe('knalledgeMap', function() {
      // 	console.log("[knalledgeMap.controller::$on] event: %s", broadcastingChangedEvent);
      // 	// knalledgeMap.syncingChanged(); NOT USED ANY MORE
      // }));

    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.changeKnalledgeRimaEvent).subscribe('knalledgeMap',
      function(msg) {
        console.log("[knalledgeMap.controller::$on] event: %s", this.changeKnalledgeRimaEvent);
        //msg is of type: {actionType:'what_deleted',node:$scope.node,what:whatId}
        this.knalledgeMap.mapStructure.nodeWhatsManagement(msg);
        this.knalledgeMap.update();
      }));

    this.subscriptions.push(this.GlobalEmittersArrayService.get(this.changeSelectedNodeEvent).subscribe('knalledgeMap', function(vkNode) {
      console.log("[knalledgeMap.controller::$on] event: %s", this.changeSelectedNodeEvent);
      this.knalledgeMap.nodeSelected(vkNode);
    }));

    if (this.RimaService) {
      // TODO:ng2 we need to solve that in a more complex way I think
      // we should make RimaService and its howAmIs to be reactive
      // in a new rx fassion
      /*
      $scope.$watch(function() {
          return this.RimaService.howAmIs;
        },
        function(newValue) {
          //alert("RimaService.howAmIs changed: " + JSON.stringify(newValue));
          if (this.knalledgeMap) this.knalledgeMap.update();
        }, true
      );*/
    }
  }

  init(){
    this.config = {
  		nodes: {
  			punctual: false,
  			svg: {
  				show: false
  			},
  			html: {
  				show: true,
  				dimensions: {
  					sizes: {
  						y: 10,
  						x: 50,
  						width: 150,
  						height: 40
  					}
  				}
  			},
  			labels: {
  				show: true
  			}
  		},
  		edges: {
  			show: true,
  			labels: {
  				show: true
  			}
  		},
  		tree: {
  			viewspec: "viewspec_tree", // "viewspec_tree" // "viewspec_manual",
  			selectableEnabled: false,
  			fixedDepth: {
  				enabled: false,
  				levelDepth: 300
  			},
  			sizing: {
  				setNodeSize: true,
  				nodeSize: [200, 100]
  			},
  			margin: {
  				top: 35,
  				left: 25,
  				right: 100,
  				bottom: 500
  			},
  			scaling: {
  				x: 0.5,
  				y: 0.5
  			},
  			mapService: {
  				enabled: true
  			}
  		},
  		transitions: {
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
  		},
  		keyboardInteraction: {
  			enabled: true
  		},
  		draggingConfig: {
  			enabled: true,
  			draggTargetElement: true,
  			target: {
  				refCategory: '.draggable',
  				opacity: 0.5,
  				zIndex: 10,
  				cloningContainer: null, // getting native dom element from D3 selector (set in code)
  				leaveAtDraggedPosition: false,
  				callbacks: {
  					onend: null // (set in code)
  				}
  			},
  			debug: {
  				origVsClone: false
  			}
  		}
  	};

    // iterativelly goes through the destinationObj and
    // patches it with the sourceObj
    function overwriteConfig(sourceObj, destinationObj) {
      for (var i in destinationObj) {
        if (i in sourceObj) {
          if (typeof destinationObj[i] === 'object') {
            overwriteConfig(sourceObj[i], destinationObj[i]);
          } else {
            destinationObj[i] = sourceObj[i];
          }
        }
      }
    }

    if (this.mapConfig) overwriteConfig(this.mapConfig, this.config);
  }

  /**
   * This is necessary since ng2 injects some object into this.mapData
   * even if parent directive do not provide any mapData
   * Returns true if data exist and are healthy (structurarly) map data
   * @function checkData
   * @param  {knalledge.knalledgeMap.knalledgeMapServices.MapData} data - map data
   * @return {boolean}
   */
  private checkData(data:any) {
    if (!data) return false;
    if (!('map' in data)) {
      console.warn("[directive:knalledgeMap:checkData] strange data: ", data);
      return false;
    };
    return true;
  }

  setData(data:any) {
    if (!this.checkData(data)) return;

    console.log("[setData] ModelMap  nodes(len: %d): ",
      data.map.nodes.length, data.map.nodes);
    console.log("[setData] ModelMap  edges(len: %d): ",
      data.map.edges.length, data.map.edges);

    this.mapData = data;

    var selectedKNodeId = null;
    /**
    TODO:ng2 find equivalent ("fake_id_until_TODO:ng2_solved")
    if (this.$routeParams.node_id) selectedKNodeId = this.$routeParams.node_id;
    */
    if (this.mapData && this.mapData.selectedNode) {
      selectedKNodeId = this.mapData.selectedNode._id;
    }

    if(this.knalledgeMap){
      this.knalledgeMap.processData(data, selectedKNodeId, function() {
      });
    }
  };

  getMapName():string{
    return "FDB"
  }

  get following(): string {
    return "";
  }

  userPanel(){
  }

  toggleOptionsFullscreen(){
    var knalledgeMapDomVisualContainerD3 = null;
    if(this.mapContainer){
      knalledgeMapDomVisualContainerD3 = d3.select(this.mapContainer.nativeElement);
    }else{
      console.error("[knalledgeView.component] Error: this.mapContainer.nativeElement is not available")
    }
  }
}
