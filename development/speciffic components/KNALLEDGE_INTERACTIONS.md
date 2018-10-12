# Loading map

## Preparing structures

Directive `knalledgeMap` (location: `src/frontend/app/components/knalledgeMap/js/directives.js`) creates plugins (`mapPlugins`, ...) (**TODO**: this should be migrated into the plugin space/components), necessary APIs (`kMapClientInterface`, ...), and object instances (`config`, `knalledge.Map`), and registeres and set listeners for events of interest (using the `GlobalEmitterServicesArray` service).

During the creation of the `knalledge.Map` object, it will get the instance of the `knalledge.MapStructure` from the `KnalledgeMapVOsService` service if KnalledgeMapVOsService is responsible for loading the map data (please check under the *Loading map data* chapter), otherwise `knalledge.Map` will create internal `knalledge.MapStructure` instance.

## Loading map data
In the next step, the `knalledgeMap` directive either **1)** gets as an parameter preloaded mapData (This is usually in the case when we already preload or create map data that we want to use the directive to visualize), or **2)** gets mapId and initiates loading process.

In the case mapData is not provided, the directive calls `KnalledgeMapService.getById()` service to get the kMap object. After it gets it, it calls `KnalledgeMapVOsService.loadAndProcessData()` to load and process data. After the loading and processinf process is finished, an event `modelLoadedEvent` is emited that the directive listens for and when it happens it calls interna method `setData` to visualize the loaded map.

```js
if(checkData(model)){
    // console.warn('have $scope.mapData:' + JSON.stringify($scope.mapData));
    setData($scope.mapData);
}else{
    /**
     * Callback after loading map object from the KnalledgeMapService
     * @param  {knalledge.KMap} map - map object
     */
     var gotMap = function(kMap){
         console.log('gotMap:'+JSON.stringify(kMap));
         // this method broadcasts the 'modelLoadedEvent' event after loading and processing kMap
         // this event is subscribed bellow for
         KnalledgeMapVOsService.loadAndProcessData(kMap);
     };

    /**
     * the id of the map to get loaded
     * @type {string}
     */
    var mapId = $routeParams.id;
    console.warn("loading map by mcmMapDirectives: mapId: " + mapId);

    KnalledgeMapService.getById(mapId).$promise.then(gotMap);
}

GlobalEmitterServicesArray.get(modelLoadedEventName).subscribe('knalledgeMap', function(eventModel) {
    // there is only one listener so we can stop further propagation of the event
    // e.stopPropagation();
    console.log("[knalledgeMap.controller::$on] ModelMap  nodes(len: %d): %s",
        eventModel.map.nodes, JSON.stringify(eventModel.map.nodes));
    console.log("[knalledgeMap.controller::$on] ModelMap  edges(len: %d): %s",
        eventModel.map.edges.length, JSON.stringify(eventModel.map.edges));

    // knalledgeMap.placeModels(eventModel);
    model = eventModel;
    setData(model);
});
```

## Visualizing data

The `setData` method of the `knalledgeMap` calls the instance of `knalledge.Map` to process the map data (`processData`).

```js
var setData = function(model){
    if(!checkData(model)) return;
    //knalledgeMap.load("treeData.json");
    knalledgeMap.processData(model, function(){
        // we call the second time since at the moment dimensions of nodes (images, ...) are not known at the first update
        knalledgeMap.update();
        if($scope.mapData && $scope.mapData.selectedNode){
            var vkNode = knalledgeMap.mapStructure.getVKNodeByKId($scope.mapData.selectedNode._id);
            knalledgeMap.mapLayout.clickNode(vkNode, null, true, true, true);
        }
    }, true, true, true);
};
```

### knalledge.Map.processData()

#### knalledge.MapStructure.processData()

**NOTE**: If map data are provided to the `knalledgeMap` directive (and not loaded by directive, with `KnalledgeMapVOsService`) then in the processData() it will call `knalledge.MapStructure.processData()` to process data. In the case `knalledgeMap` directive loads map data with the `KnalledgeMapVOsService` service, than processData for the mapStructure is not called in the knalledge.Map since it is already called in the `KnalledgeMapVOsService.loadAndProcessData()`.

`knalledge.MapStructure.processData()` populates internal `nodesById` and `edgesById` from the provided mapData.

#### knalledge.MapLayout.processData()

`knalledge.Map.processData()` calls `processData()` method of the instance of `knalledge.MapLayout` class (it could be also `knalledge.MapLayoutTree` or `knalledge.MapLayoutGraph`).

`knalledge.MapLayout.processData()` sets the selected node calling the `selectNode()` method and `clientApi.update()` method that resolves into `update()` of the specializations of the `MapVisualization` class (like `MapVisualizationTree.update()`, ...).

##### MapVisualization.update()

MapVisualization.update() first tries few ways to resolve the starting node of the map (if it doesn't receive it from the invoker). Then it calls `knalledge.MapLayout.generateTree()` method and visualizes it. When the whole process is done the callback is invoked.

This callback eventually pops up all the way back to the `knalledgeMap` directive inside of its method `setData()`.

# CLICKING-ON / CHANGING-SELECTED node in a map

![KnAllEdge-interaction-node-changed](documents/diagrams/KnAllEdge-interaction-node-changed.png)
**Figure 1. Node changed interaction** - covering both local and remote changes

+ **RULE**:
    + On any node click anywhere, or selection change, we should identify which node is affected and notify MapStructure about it
    + MapStructure will update local selectedNode and broadcast event about the change
    + anyone interested should listen to it
    + there should not be too many listeners at many levels (`knalledge.Map`, &amp; `knalledge.MapLayout` &amp; `knalledge.MapVisualization`, ...) because it will produce rat-race and probable more refreshing than necessary

(Currently) only `knalledge.Map` listens only for the change and updates all important components:
+ notify back the `knalledge.Map` container (`knalledgeMap` directive)
+ `knalledge.MapVisualization` (which will in turn notify/update (`knalledge.MapLayout`))
+

## TODO:

+ MapStructure should be the one that accepts notification of node click/select/unselect
+ MapStructure then should broadcast info about change of a selectedNode (if any)
+ other entities (like knalledgeMap, Map, MapLayout, MapVisualization, ...) should registered to notification and react according to the change (i.e. visualize another selected node, update graph, reduce visible nodes, ...)
+ Halo should update accordingly as a part of MapVisualization reaction to the selectedNode change, not in the `.on("click", function(d){` callback
    + In this case Halo will react to keyboard navigation, or even broadcasted navigation, since it will allways affect change in the selectedNode in MapStructure, and therefore it will broadcast the change to all interested parties
+ refactor broadcasting node-selected into node-selected/unselected/clicked
