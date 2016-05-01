(function() { // This prevents problems when concatenating scripts that aren't strict.
        'use strict';

        angular.module('ontovDirectives', ['Config'])
            .directive('ontovSearch', ['$rootScope', '$timeout', '$q', 'ontovDataModel', 'OntovService',
                function($rootScope, $timeout, $q, dataModel, OntovService) {
                    console.log("[ontovSearch] loading directive");
                    return {
                        restrict: 'AE',
                        scope: {
                            'readonly': '=',
                            'node': "="
                        },
                        // ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
                        // expression: http://docs.angularjs.org/guide/expression
                        templateUrl: 'components/ontov/partials/ontov-search.tpl.html',
                        link: function($scope, $element) {
                            $scope.test = "hello";

                            var initVS = function() {
                                // VS is a visual search component (?)
                                // http://documentcloud.github.io/visualsearch/
                                var visualSearch = VS.init({
                                    container: $('.ontov_visual_search'),
                                    query: '',
                                    callbacks: {
                                        // callback after search is is finished by user
                                        search: function(searchString, searchCollection) {
                                            // forming search query based on searchCollection
                                            searchString = "";
                                            searchCollection.forEach(function(pill) {
                                                var category = pill.get("category"),
                                                    value = pill.get("value");
                                                if (category != "text") {
                                                    searchString += " " + category + ":\"" + value + "\"" + ",";
                                                } else {
                                                    searchString += " " + value + ",";
                                                }
                                            });
                                            console.log("[ontov] searchString: ", searchString);
                                            //Remove duplicates in search string
                                            //searchString = _.uniq(searchString.split(" ")).join(" ");

                                            // retrieving nodes that fits the search criteria
                                            // (including also context nodes - like parent nodes
                                            // all the way to the root node)
                                            var viewNodes = dataModel.search(searchString).nodes;

                                            // hide all non-relevant nodes
                                            if (viewNodes.length > 0) {
                                                _.each(mapStructure.nodesById, function(vkNode) {
                                                    vkNode.visible = false;
                                                });
                                            } else {
                                                _.each(mapStructure.nodesById, function(vkNode) {
                                                    delete vkNode.visible;
                                                });
                                            }

                                            for (var vmNodeId in viewNodes) {
                                                for (var nodeId in mapStructure.nodesById) {
                                                    var vkNode = mapStructure.nodesById[nodeId];
                                                    if (!vkNode) continue;
                                                    if (vkNode.kNode._id === viewNodes[vmNodeId]._id) {
                                                        delete vkNode.visible;
                                                    }

                                                }
                                            }
                                            mapUpdate();
                                        },
                                        facetMatches: function(callback) {
                                            // These are the facets that will be autocompleted in an empty input.
                                            var pills = dataModel.getPills();
                                            var pillNames = _.keys(pills);
                                            callback(pillNames);
                                        },
                                        valueMatches: function(facet, searchTerm, callback) {
                                            // These are the values that match specific categories, autocompleted
                                            // in a category's input field.  searchTerm can be used to filter the
                                            // list on the server-side, prior to providing a list to the widget
                                            callback(dataModel.getFacetMatches(facet));
                                        }
									} // end of callbacks
                                }); // end of VS.init

                            }; // end of: initVS = function() {

                            var initVSDelayed = function() {
                                $timeout(function() {
                                    initVS();
                                }, 2000);
                            };

							// jQuery: on DOM loaded
                            // TODO: avoid this in the ng1 space
                            $(document).ready(initVSDelayed);

                            $scope.bindings = {};

                            $scope.nodesByIdNo = 0; $scope.edgesByIdNo = 0;
                            var mapStructure = null;
                            var mapUpdate = null;

                            var mapReferencePromise = OntovService.getReference('map').$promise;
                            var mapApiPromise = OntovService.getApi('map').$promise;
                            var items = $q.all({
                                reference: mapReferencePromise,
                                api: mapApiPromise
                            }).then(function(promiseResults) {
                                mapStructure = promiseResults.reference.items.mapStructure;
                                mapUpdate = promiseResults.api.items.update;

                                $scope.$watch(function() {
                                    return Object.keys(mapStructure.nodesById).length;
                                }, function() {
                                    $scope.nodesByIdNo = Object.keys(mapStructure.nodesById).length;
                                }, true);

                                $scope.$watch(function() {
                                    return Object.keys(mapStructure.edgesById).length;
                                }, function() {
                                    $scope.edgesByIdNo = Object.keys(mapStructure.edgesById).length;
                                }, false);
                            });

                            $scope.reduceDepth = function() {
                                // mapStructure.edgesById = {};
                                console.log("Cutting");
                                var viewNodes = dataModel.getViewModel().nodes;
                                for (var vmNodeId in dataModel.getViewModel().nodes) {
                                    for (var nodeId in mapStructure.nodesById) {
                                        var vkNode = mapStructure.nodesById[nodeId];
                                        if (vkNode.kNode._id === viewNodes[vmNodeId]._id)
                                            vkNode.visible = false;
                                    }
                                }


                                for (var edgeId in mapStructure.edgesById) {
                                    var vkEdge = mapStructure.edgesById[edgeId];
                                    if (vkEdge.kEdge.sourceId == mapStructure.rootNode.kNode._id) continue;

                                    // 1. delete all non-root edges
                                    // delete mapStructure.edgesById[edgeId];

                                    // 2. make invisible all non-root edges
                                    vkEdge.visible = false;

                                    // 3. make invisible all non-root-connected nodes
                                    // mapStructure.getVKNodeByKId(vkEdge.kEdge.targetId)
                                    // 	.visible = false;

                                    mapUpdate();
                                }
                            }; // end of reduceDepth
                        } // end of link
                    } // end of return
                }]); // end of function and directive

            }()); // end of 'use strict';
