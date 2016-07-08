(function() { // This prevents problems when concatenating scripts that aren't strict.
    'use strict';
    //this function is strict...

    var enableOntov = true;
    var ontovServices = angular.module('ontovServices', ['ontovDirectives', 'collaboPluginsServices']);

    /**
     * 	factory 'NotificationService'
     */

    var ontovPluginInfo;

    ontovServices
        .run(['$q', 'CollaboPluginsService', function($q, CollaboPluginsService) {

            ontovPluginInfo = {
                name: "Ontov",
                components: {

                },
                references: {
                    mapVOsService: {
                        items: {
                            nodesById: {},
                            edgesById: {},
                        },
                        $resolved: false,
                        callback: null,
                        $promise: null
                    },
                    map: {
                        items: {
                            mapStructure: {
                                nodesById: {},
                                edgesById: {}
                            }
                        },
                        $resolved: false,
                        callback: null,
                        $promise: null
                    }
                },
                apis: {
                    map: {
                        items: {
                            update: null
                        },
                        $resolved: false,
                        callback: null,
                        $promise: null
                    }
                }
            };
            ontovPluginInfo.references.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
                ontovPluginInfo.references.map.callback = function() {
                    ontovPluginInfo.references.map.$resolved = true;
                    resolve(ontovPluginInfo.references.map);
                    // reject('not allowed');
                };
            });

            ontovPluginInfo.apis.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
                ontovPluginInfo.apis.map.callback = function() {
                    ontovPluginInfo.apis.map.$resolved = true;
                    resolve(ontovPluginInfo.apis.map);
                    // reject('not allowed');
                };
            });

            CollaboPluginsService.registerPlugin(ontovPluginInfo);
        }])
        .provider('OntovService', {
            $get: ['CollaboPluginsService' /*, '$rootScope', */ , function(CollaboPluginsService /*, $rootScope*/ ) {

                var provider = {
                    init: function() {},

                    getReferenceItems: function(referenceName) {
                        // wrong reference
                        if (!referenceName in ontovPluginInfo.references) {
                            return null;
                        }

                        // not resolved yet
                        if (!ontovPluginInfo.references[referenceName].$resolved) {}

                        return ontovPluginInfo.references[referenceName].items;
                    },

                    getReference: function(referenceName) {
                        // wrong reference
                        if (!referenceName in ontovPluginInfo.references) {
                            return null;
                        }

                        // not resolved yet
                        if (!ontovPluginInfo.references[referenceName].$resolved) {}

                        return ontovPluginInfo.references[referenceName];
                    },

                    getApi: function(apiName) {
                        // wrong reference
                        if (!apiName in ontovPluginInfo.apis) {
                            return null;
                        }

                        // not resolved yet
                        if (!ontovPluginInfo.apis[apiName].$resolved) {}

                        return ontovPluginInfo.apis[apiName];
                    }
                };
                provider.init();
                return provider;
            }]
        }).service('ontovDataModel', ['$rootScope', '$timeout', '$q', '$http', '$injector', function($rootScope, $timeout, $q, $http, $injector) {
                //http://joelhooks.com/blog/2013/04/24/modeling-data-and-state-in-your-angularjs-application/

                var RimaService = $injector.get('RimaService');
                var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');

                var performSearch = function() {},
                    projectCollection = {},
                    projectSearchCollection = {};

                var viewModel = {
                        "nodeTypes": {
                            "queryNodes": [],
                            "pathNodes": []
                        },
                        "nodes": [],
                        "links": []
                    },
                    knalledgeMap = {
                        kedges: [],
                        knodes: []
                    };

                //Sort graph in topological order
                var topologicalSort = (function() {
                    //https://mgechev.github.io/javascript-algorithms/graphs_others_topological-sort.js.html
                    function topologicalSortHelper(node, visited, temp, graph, result) {
                        temp[node] = true;
                        var neighbors = [],
                            nodeIndex = 0,
                            nodeInstance = {};
                        for (var i = graph.length - 1; i >= 0; i--) {
                            if (graph[i]._id === node) {
                                nodeInstance = graph[i];
                                neighbors = graph[i].getIds('children');
                                nodeIndex = i;
                            }
                        };

                        for (var i = 0; i < neighbors.length; i += 1) {
                            var n = neighbors[i];
                            if (temp[n]) {
                                throw new Error('The graph is not a DAG');
                            }
                            if (!visited[n]) {
                                topologicalSortHelper(n, visited, temp, graph, result);
                            }
                        }
                        temp[node] = false;
                        visited[node] = true;
                        result.push(nodeInstance);
                    }
                    /**
                     * Topological sort algorithm of a directed acyclic graph.<br><br>
                     * Time complexity: O(|E|) where E is a number of edges.
                     */
                    return function(graph) {
                        var result = [];
                        var visited = [];
                        var temp = [];
                        for (var node in graph) {
                            if (!visited[graph[node]._id] && !temp[graph[node]._id]) {
                                topologicalSortHelper(graph[node]._id, visited, temp, graph, result);
                            }
                        }
                        return result.reverse();
                    };
                }());

                //Find shortest path in topological ordered DAG(Directed Acyclic graph)
                var shortPathDAG = (function() {
                    var cost = {}; // A mapping between a node, the cost of it's shortest path, and it's parent in the shortest path
                    function findPath(topSortGraph, sourceNode, destNode) {
                        //http://stackoverflow.com/questions/1482619/shortest-path-for-a-dag

                        // for each vertex v in top_sorted_list:
                        for (var i = 0; i < topSortGraph.length; i++) {
                            //cost[vertex].cost = inf
                            cost[topSortGraph[i]._id] = {};
                            cost[topSortGraph[i]._id].cost = Infinity;
                            //cost[vertex].parent = None
                            cost[topSortGraph[i]._id].parent = null;
                        }
                        cost[sourceNode._id].cost = 0;
                        for (var u = 0; u < topSortGraph.length; u++) {
                            //for each vertex v in top_sorted_list:
                            var edges = topSortGraph[u].childrenLinks;
                            //for each edge e in adjacenies of v:
                            for (var y = 0; y < edges.length; y++) {
                                //if cost[e.dest].cost < cost[v].cost + e.weight:
                                var weight = edges[y].weight ? edges[y].weight : 1; //If edges do not have weights. Set value to 1.
                                if (cost[edges[y].targetId].cost > cost[topSortGraph[u]._id].cost + weight) {
                                    //cost[e.dest].cost =  cost[v].cost + e.weight
                                    cost[edges[y].targetId].cost = cost[topSortGraph[u]._id].cost + weight;
                                    //cost[e.dest].parent = v
                                    cost[edges[y].targetId].parent = topSortGraph[u];
                                }
                            }
                        }
                    }

                    return function(topSortGraph, sourceNode, destNode) {
                        if (!topSortGraph || !sourceNode || !destNode) {
                            return console.log('dataModel::shortPathDAG::"Arguments missing. Aborting.');
                        }
                        findPath(topSortGraph, sourceNode, destNode);
                        var subgraph = [];
                        var target = cost[destNode._id];
                        var temp = target;
                        subgraph.push(destNode);
                        //NB. Only checks single parent nodes
                        while (temp.parent) { //Backtrack target parent chain to find shortest path to source
                            subgraph.push(temp.parent);
                            temp = cost[temp.parent._id];
                            //If source cannot be found. Source is likely on another tree branch.
                            if (!sourceNode) {
                                console.log("dataModel::shortPathDAG:: No source node, source set to root.");
                            }
                        }
                        for (var i in subgraph) {
                            subgraph[i].visible = true;
                        }

                        return subgraph.reverse();
                    };
                }());

                //Listen for map data
                if (enableOntov) { // false avoids error: angular.js:13236 RangeError: Maximum call stack size exceeded
                    $rootScope.$watchGroup([function() {
                        // return Object.keys(ontovPluginInfo.references.map.items.mapStructure.edgesById).length;
                        return Object.keys(ontovPluginInfo.references.mapVOsService.items.edgesById).length;
                    }, function() {
                        // return Object.keys(ontovPluginInfo.references.map.items.mapStructure.nodesById).length;
                        return Object.keys(ontovPluginInfo.references.mapVOsService.items.nodesById).length;
                    }], function(oldVal, newVal, scope) {
                        prepareDataForUpdating();
                    });
                }

                var whoIamIsUpdatedEventName = "whoIamIsUpdatedEvent";
				GlobalEmitterServicesArray.register(whoIamIsUpdatedEventName);
				GlobalEmitterServicesArray.get(whoIamIsUpdatedEventName)
                    .subscribe('ontovDataModel', function(whoAmIs)
                {
				    console.log("[ontovDataModel::%s] whoAmIs: %s", whoIamIsUpdatedEventName, whoAmIs);
                    prepareDataForUpdating();
				});

                function prepareDataForUpdating(){
                    var edgeObj = ontovPluginInfo.references.map.items.mapStructure.edgesById,
                        nodeObj = ontovPluginInfo.references.map.items.mapStructure.nodesById;
                    // we cannot rely on this anymore,
                    // since whoAmIs can also change in RimaService
                    if (true || Object.keys(edgeObj).length != knalledgeMap.kedges.length && Object.keys(nodeObj).length != knalledgeMap.knodes.length) {
                        // http://underscorejs.org/#pluck
                        // making an array of extracted list of property values
                        knalledgeMap.kedges = _.pluck(edgeObj, 'kEdge');
                        knalledgeMap.knodes = _.pluck(nodeObj, 'kNode');

                        for(var kI in knalledgeMap.knodes){
                            var kNode = knalledgeMap.knodes[kI];

                            // adding support for searching through users
                            var whoAmI =
                                RimaService.getUserById(kNode.iAmId);
                            kNode.user =
                                RimaService.getNameFromUser(whoAmI);
                            if(!kNode.user){
                                kNode.user = "[unknown]"
                            }

                            // adding support for searching through whats
                            var whats = kNode.dataContent && kNode.dataContent.rima && kNode.dataContent.rima.whats;
                            kNode.what = [];
                            if(whats && whats.length > 0){
                                // kNode.what = whats[0].name;
                                for(var wI in whats){
                                    kNode.what.push(whats[wI].name);
                                }
                            }
                            // model.get('dataContent').rima.whats;
                            // for(var wI in whats){
                            //     if(whats[wI].name === value) return true;
                            // }

                            // adding support for filtering subtrees
                            kNode.tree = kNode.name;
                        }

                        updateDataModel();
                    }
                }

                //Update model with new data
                function updateDataModel() {
                    console.log("dataModel::KnAllEdge map data received");
                    //Create children and parrent arrays on all nodes

                    buildInheritanceTree(knalledgeMap.knodes, knalledgeMap.kedges);

                    //Perform a topological sort
                    var topSort = topologicalSort(knalledgeMap.knodes);
                    viewModel = setViewModel(topSort, []);


                    //Create our project collection from an array of models
                    // queryEngine - using Backbone?

                    projectCollection = queryEngine.createLiveCollection(topSort);
                    projectSearchCollection = projectCollection.createLiveChildCollection()
                        .setPill('name', {
                            prefixes: ['name:'],
                            callback: function(model, value) {
                                return (model.get('name') === value);
                            }
                        })
                        .setPill('type', {
                            prefixes: ['type:'],
                            callback: function(model, value) {
                                return (model.get('type') === value);
                            }
                        })
                        .setPill('iAmId', {
                            prefixes: ['iAmId:'],
                            callback: function(model, value) {
                                return (model.get('iAmId') === value);
                            }
                        })
                        .setPill('user', {
                            prefixes: ['user:'],
                            callback: function(model, value) {
                                return (model.get('user') === value);
                            }
                        })

                        .setPill('what', {
                            prefixes: ['what:'],
                            callback: function(model, value) {
                                var whats = model.get('what');
                                if(whats && whats.length > 0){
                                    return whats.indexOf(value) >= 0;
                                }
                                return false;
                            }
                        })

                        .setPill('tree', {
                            prefixes: ['tree:'],
                            callback: function(model, value) {
                                function isParent(parents, name){
                                    if(!parents || parents.length <= 0){
                                        return false;
                                    }

                                    var thereIsParent = false;
                                    for(var pI in parents){
                                        if(parents[pI].name === value){
                                            return true;
                                        }

                                        var newParents =
                                        (typeof parents[pI].get === 'function') ?
                                            parents[pI].get('parents') :
                                            parents[pI].parents;

                                        thereIsParent = thereIsParent ||
                                            isParent(newParents, name);
                                    }
                                    return thereIsParent;
                                };

                                var name = model.get('name');
                                if(name == value) return true;
                                var thereIsParent =
                                    isParent(model.get('parents'), value);
                                return thereIsParent;

                            }
                        })

                        .setPill('approvals', {
                            prefixes: ['approvals:'],
                            callback: function(model, value) {
                                null;//return (model.get('approvals') === value);
                            }
                        })

                        .setFilter('search', function(model, searchString) {
                            if (!searchString) {
                                return true;
                            } else {
                                var searchRegex = queryEngine.createSafeRegex(searchString);
                                var pass = searchRegex.test(model.get("description"));
                                return pass;
                            }
                        });

                    var nodes = [];
                    var startIndex = 0;
                    //Done
                    dataModelReady();
                }

                //Attach parent and child references to nodes (for d3)
                function buildInheritanceTree(nodes, edges) {
                    var _nodes = Array.prototype.concat(nodes, []); //Copy
                    for (var y = _nodes.length - 1; y >= 0; y--) {
                        _nodes[y].parents = [],
                            _nodes[y].children = [],
                            _nodes[y].parentsLinks = [],
                            _nodes[y].childrenLinks = [];

                        _nodes[y].getIds = function(property) {
                            var _array = [],
                                _collection = Array.prototype.concat(this[property]);
                            for (var index in _collection) {
                                _array.push(_collection[index]._id);
                            }
                            return _array;
                        }
                    };

                    for (var i = edges.length - 1; i >= 0; i--) {
                        var sourceId = edges[i].sourceId,
                            targetId = edges[i].targetId;

                        var sourceNode = _nodes.filter(function(n) {
                                return n._id === sourceId;
                            })[0],
                            targetNode = _nodes.filter(function(n) {
                                return n._id === targetId;
                            })[0];
                        //Parent(s) are always the source of a link
                        //Child(ren) are always the target of a link
                        if (targetNode && sourceNode) {
                            targetNode.parents.push(sourceNode);
                            targetNode.parentsLinks.push(edges[i]);
                            sourceNode.children.push(targetNode);
                            sourceNode.childrenLinks.push(edges[i]);
                        }

                    }
                    return _nodes;
                }

                //Perform search on collection - return querynodes
                function searchOnCollection(searchString, searchCollection) {
                    var queryNodes = [];
                    for(var mI in searchCollection.models){
                        var modelAttributes =
                            searchCollection.models[mI].attributes;
                        var category = modelAttributes.category;
                        var value = modelAttributes.value.trim();
                        //Check that search string contains at least 1 character
                        if(!category || category.length<=0 || !value || value.length<=0) continue;

                        var searchTerm
                            = category + ':"' + value + '"';

                        var queryNode = projectSearchCollection
                            .setSearchString(searchTerm)
                            .query()
                            .toJSON();

                        queryNodes.push({
                            "type": "queryNode",
                            "queryString": searchTerm,
                            "label": searchTerm,
                            nodes: queryNode
                        });
                    }

                    return queryNodes;
                }

                //Search for paths between query nodes - return pathnodes
                function searchQueryPaths(queryCollection, queryNodes) {
                    if (!queryNodes || queryNodes.length <= 0)
                        return [];
                    var _paths = [],
                        _startIndex = 0;
                    //TODO: Cross check all queries. Currently assumes only one result per query node.
                    for (var i = 0; i < queryNodes.length; i++) {
                        for (var y = 0; y < queryNodes[i].nodes.length; y++) {
                            var node = queryNodes[i].nodes[y];
                            var _path = findPaths(queryCollection, queryCollection[0], node);
                            _paths.push(_path);
                        }

                    }
                    //Find all paths between two nodes
                    function findPaths(topSortGraph, qnOne, qnTwo) {
                        return shortPathDAG(topSortGraph, qnOne, qnTwo);
                    }

                    return _paths;
                }
                //Merges all paths into one graph.
                function mergePaths(paths) {
                    var _paths = Array.prototype.concat(paths, []);
                    var _graph = {},
                        _objGraph = [];

                    while (_paths.length > 0) {
                        var temp = _paths.pop();
                        for (var y = 0; y < temp.length; y++) {
                            _graph[temp[y]._id] = temp[y];
                        }
                    }
                    for (var property in _graph) {
                        _objGraph.push(_graph[property]);
                    }
                    return _objGraph;
                }

                //Top down sort nodes according to given property - returns sorted array
                function sortNodesPath(nodesArray, property) {
                    if (!nodesArray || !nodesArray.length > 0)
                        return [];
                    var sortedArray = _.sortBy(nodesArray, function(item, index, list) {
                        if (item[property])
                            return -item[property].length;
                        else return 0;
                    });
                    return sortedArray;
                }

                //Set result node size relative to paths it contain and other result nodes
                //Assumes top down sorted array - returns resized nodes array
                function setNodesSize(sortedNodeArray) {
                    if (!sortedNodeArray || !sortedNodeArray.length > 0)
                        return [];
                    var resizedNodes = sortedNodeArray;
                    //Largest possible size
                    var _maxSize = 1;
                    //Total paths on biggest result node
                    var _topNode = null;

                    _.each(resizedNodes, function(item, index, list) {
                        if (!_topNode) {
                            item.size = _maxSize;
                            _topNode = item;
                        } else {
                            item.size = item.paths.length / _topNode.paths.length;
                        }
                    });

                    return resizedNodes;
                }

                //Update the view model - returns new view model
                function setViewModel(nodes) {
                    viewModel.nodes = nodes;
                    var links = [];

                    knalledgeMap.kedges.forEach(function(e) {
                        //http://stackoverflow.com/questions/16824308/d3-using-node-attribute-for-links-instead-of-index-in-array
                        // Get the source and target nodes
                        var sourceNode = viewModel.nodes.filter(function(n) {
                                return n._id === e.sourceId;
                            })[0],
                            targetNode = viewModel.nodes.filter(function(n) {
                                return n._id === e.targetId;
                            })[0];

                        // Add the edge to the array
                        if (sourceNode && targetNode)
                            links.push({
                                source: sourceNode,
                                target: targetNode
                            });
                    });

                    viewModel.links = links;

                    return viewModel;
                }

                //Broadcast that viewmodel is ready
                function dataModelReady() {
                    return $rootScope.$broadcast('dataModel::ready');
                }

                //Broadcast viewmodel updated
                function broadcastUpdate() {
                    return $rootScope.$broadcast('dataModel::viewModelUpdate');
                }

                return {
                    search: function(searchString, searchCollection) {
                        //Update viewmodel with search results
                        var _queryNodes = searchOnCollection(searchString, searchCollection);
                        //Set node visibility - KnAllEdge requirement
                        _.each(_queryNodes, function(node) {
                            console.log(node);
                        });
                        var _pathNodes = searchQueryPaths(projectCollection.toJSON(), _queryNodes);
                        var _graph = mergePaths(_pathNodes);

                        // var nodes = [];
                        // for (var index in _pathNodes) {
                        //     nodes = Array.prototype.concat(_pathNodes[index].path, nodes);
                        // }
                        // var _sortedPathNodes = sortNodesPath(_pathNodes, 'paths');
                        // var _resizedNodes = setNodesSize(_sortedPathNodes);
                        // console.log("dataModel.search:: Found %i query nodes and %i path nodes.", _queryNodes.length, _pathNodes.length);

                        //Set dataModel.viewModel
                        _graph = buildInheritanceTree(_graph, knalledgeMap.kedges);
                        setViewModel(_graph);

                        //Tell all views that viewmodel is updated
                        broadcastUpdate();

                        return viewModel;
                    },
                    getPills: function() {
                        return projectSearchCollection.getPills();
                    },
                    getFacetMatches: function(facet) {
                        switch (facet) {
                            //Put any customization of retrieving values from matches facets here
                            default: return _.compact(_.uniq(_.flatten(projectCollection.pluck(facet))));
                        }
                    },
                    getViewModel: function() {
                        return viewModel;
                    }

                };

            }

        ]);
}()); // end of 'use strict';
