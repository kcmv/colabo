# Storage classes

## KnalledgeMapService

+ namespace: `knalledge.knalledgeMap.knalledgeMapServices`
+ location: `src/frontend/app/components/knalledgeMap/js/services.js`

The knalledge service for dealing with KMap entities and saving them to the server

## KnalledgeMapVOsService (mapService)

+ namespace: `knalledge.knalledgeMap.knalledgeMapServices`
+ location: `src/frontend/app/components/knalledgeMap/js/services.js`

Top most service for accessing KnAllEdge backend. It treats KnAllEdge data unified through map.

## MapStructure

+ namespace: `knalledge`
+ location: `src/frontend/app/js/knalledge/mapStructure.js`

It contains `VkEdge`s and `VkNodes` in `nodesById` and `edgesById`, retrospectively.

All top logic of the KnAllEdge system should manipulate with map, nodes and edges through this structure,
rather than through the lower level knalledge services (like KnalledgeMapVOsService, etc)

# VIsualization classes

## MapLayout

+ namespace: `knalledge`
+ location: `src/frontend/app/js/knalledge/mapLayout.js`

Deals with layout of the KnAllEdge map. It has specialized classes that provides different KnAllEdge map layouts

### MapLayoutTree

### MapLayoutGraph

**NOTE**: Not fully implemented

### MapLayoutFlat

**NOTE**: Not fully implemented
