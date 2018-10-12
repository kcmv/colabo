// external from the JS world
declare var knalledge;

/**
 * Deals with knalledge.Map and helps loading map
 */
export class MapLoader {
    private status: string;
    private editingNodeHtml: any = null;
    private model;
    private onMapLoadedCallback;

    constructor(private mapId: string, private KnalledgeMapService, private KnalledgeMapVOsService, private GlobalEmittersArrayService) {
    }

    init() {
        var that = this;

        var modelLoadedEventName = "modelLoadedEvent";
        this.GlobalEmittersArrayService.register(modelLoadedEventName);
        this.GlobalEmittersArrayService.get(modelLoadedEventName).subscribe('knalledge.MapLoader', function(eventModel) {
            // there is only one listener so we can stop further propagation of the event
            // e.stopPropagation();

            console.info("[knalledge.MapLoader] ModelMap  nodes(len: %d): ",
                eventModel.map.nodes.length, eventModel.map.nodes);
            console.info("[knalledge.MapLoader] ModelMap  edges(len: %d): ",
                eventModel.map.edges.length, eventModel.map.edges);

            // knalledgeMap.placeModels(eventModel);
            this.model = eventModel;
            // this.setData(this.model);
            if(typeof this.onMapLoadedCallback === 'function'){
                this.onMapLoadedCallback(this.model);
            }
        }.bind(this));

        this.loadMapWithId(this.mapId);
    }

    onMapLoaded(callback){
        this.onMapLoadedCallback = callback;
    }

    // $timeout(function(){
    //     delayedFunc();
    // }, 500);

    /**
     * Loads map with specific map id
     * @param  {string} mapId the id of the map to be loaded
     */
    loadMapWithId(mapId){
        /**
         * Callback after loading map object from the this.KnalledgeMapService
         * @param  {knalledge.KMap} map - map object
         */
        var gotMap = function(kMap){
            console.log('gotMap:'+JSON.stringify(kMap));
            console.log('this.KnalledgeMapService.map:', this.KnalledgeMapService.map);
            // this method broadcasts the 'modelLoadedEvent' event after loading and processing kMap
            // this event is subscribed bellow for
            this.KnalledgeMapVOsService.loadAndProcessData(kMap, function(){
                console.info("[MapLoader] loaded map data");
                // if($scope.route){
                //     // alert("redirecting to: " + $scope.route);
                //     if($scope.route.indexOf("http") < 0){
                //         $location.path($scope.route);
                //     }else{
                //         $window.location.href = $scope.route;
                //     }
                // }
            });
        };

        console.info("[MapLoader] loading map for mapId: ",
            this.mapId);

        // TODO: FIX: promise doesn't work well, we need callback
        // this.KnalledgeMapService.getById(mapId).$promise.then(gotMap);
        this.KnalledgeMapService.getById(this.mapId, gotMap.bind(this));
    }

    /**
     * This is necessary since ng2 injects some object into $scope.mapData
     * even if parent directive do not provide any mapData
     * Returns true if data exist and are healthy (structurarly) map data
     * @function checkData
     * @param  {knalledge.knalledgeMap.knalledgeMapServices.MapData} data - map data
     * @return {boolean}
     */
    checkData(data){
        // if(!model) return false;
        // if(!('map' in model)){
        //     console.warn("[directive:knalledgeMap:checkData] strange data: ", data);
        //     return false;
        // };
        // return true;
    }

    setData(model){
        // if(!checkData(model)) return;
        // var selectedKNodeId = null;
        // if($routeParams.node_id) selectedKNodeId = $routeParams.node_id;
        // if($scope.mapData && $scope.mapData.selectedNode){
        //     selectedKNodeId = $scope.mapData.selectedNode;
        // }
        //
        // var knalledgeMap = new knalledge.Map(
        //     d3.select($element.find(".knalledge_map_container").get(0)),
        //     config, kMapClientInterface, null,
        //         config.tree.mapService.enabled ? KnalledgeMapVOsService : null,
        //         // if $scope.mapData is set, we do not use
        //         // KnalledgeMapVOsService.mapStructure,
        //         // but let knalledge.Map to create a new mapStructure and build VKs from Ks
        //         checkData($scope.mapData) ? null :
        //             KnalledgeMapVOsService.mapStructure,
        //         CollaboPluginsService, RimaService,
        //         IbisTypesService, NotifyService, mapPlugins,
        //         KnalledgeMapViewService, SyncingService,
        //         KnAllEdgeRealTimeService,
        //         KnalledgeMapPolicyService, injector, Plugins);
        // knalledgeMap.init();
        //
        // knalledgeMap.processData(model, selectedKNodeId, function(){
        //     // we call the second time since at the moment dimensions of nodes (images, ...) are not known at the first update
        //     // TODO: we need to avoid this and reduce map processing
        //     // knalledgeMap.update();
        //     // if(
        //     // 	($scope.mapData && $scope.mapData.selectedNode)
        //     // 	|| $routeParams.node_id){
        //     // 	var vkNode = knalledgeMap.mapStructure.getVKNodeByKId($scope.mapData.selectedNode._id);
        //     // 	knalledgeMap.mapLayout.selectNode(vkNode, null, true, true, true);
        //     // }
        // });
    }

    delayedFunc(){
        // this.init();
        // if(this.checkData(model)){
        //     // console.warn('have $scope.mapData:' + JSON.stringify($scope.mapData));
        //     this.setData($scope.mapData);
        // }else{
        //     this.loadMapWithId($routeParams.id);
        // }
    }
}

if (typeof knalledge !== 'undefined') knalledge.MapLoader = MapLoader;
