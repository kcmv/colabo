(function() { // This prevents problems when concatenating scripts that aren't strict.
    'use strict';

    var MapLayoutTree = knalledge.MapLayoutTree = function(mapStructure, collaboPluginsService, configNodes, configTree, upperApi, knalledgeState, knAllEdgeRealTimeService, knalledgeMapViewService, rimaService) {
        this.construct("MapLayoutTree", mapStructure, collaboPluginsService, configNodes, configTree, upperApi, knalledgeState, knAllEdgeRealTimeService, knalledgeMapViewService, rimaService);
        this.tree = null;
    };

    // TODO: the quickest solution until find the best and the most performance optimal solution
    // Set up MapLayoutTree to inherit from MapLayout
    MapLayoutTree.prototype = Object.create(knalledge.MapLayout.prototype);

    MapLayoutTree.prototype._super = function() {
        var thisP = Object.getPrototypeOf(this);
        var parentP = Object.getPrototypeOf(thisP);
        return parentP;
    };

    MapLayoutTree.prototype.getChildren = function(d) { //TODO: improve probably, not to compute array each time, but to update it upon changes
        var that = this;
        var children = [];
        if (d.isOpen === false) return children;

        // if(this.mapStructure.getSelectedNode() == d){
        // 	return children;
        // }

        function getPersonalNodeWeight(vkNode) {
            var iAmId = that.rimaService.getActiveUserId();

            var vote = (vkNode.kNode.dataContent && vkNode.kNode.dataContent.ibis && vkNode.kNode.dataContent.ibis.votes && vkNode.kNode.dataContent.ibis.votes[iAmId]) ?
                vkNode.kNode.dataContent.ibis.votes[iAmId] : 0;

            return vote;
        }

        function getNodeWeight(vkNode) {
            var sum = 0;
            if (vkNode.kNode.dataContent && vkNode.kNode.dataContent.ibis && vkNode.kNode.dataContent.ibis.votes) {
                for (var vote in vkNode.kNode.dataContent.ibis.votes) {
                    sum += vkNode.kNode.dataContent.ibis.votes[vote];
                }
            }

            return sum;
        }

        var showUnknownEdges = this.knalledgeMapViewService ? this.knalledgeMapViewService.provider.config.edges.showUnknownEdges : false;
        var orderBy = this.knalledgeMapViewService ? this.knalledgeMapViewService.provider.config.edges.orderBy : 'name';
        for (var i in this.mapStructure.edgesById) {
            var vkEdge = this.mapStructure.edgesById[i];
            // if defined and set to false the vkEdge and its vkNode should not be presented
            if (vkEdge.visible === false) continue;
            if (vkEdge.kEdge.sourceId === d.kNode._id) {
                if (this.systemEdgeTypes.indexOf(vkEdge.kEdge.type) >= 0) continue;
                if (!showUnknownEdges && this.knownEdgeTypes.indexOf(vkEdge.kEdge.type) < 0) continue;

                var vkNode = this.mapStructure.getVKNodeByKId(vkEdge.kEdge.targetId);
                if (vkNode) { //vkNode can be null - e.g. when deleting node (e.g. when deleted from other client 'Presenter') and edge is still not deleted
                    // if defined and set to false the vkNode should not be presented
                    if (vkNode.visible === false) continue;
                    if (this.mapStructure.isNodeVisible(vkNode)) {
                        if (orderBy) {
                            switch (orderBy) {
                                case 'name':
                                    break;
                                case 'vote':
                                    vkNode.weight = getNodeWeight(vkNode);
                                    break;
                                case 'personal_vote':
                                    vkNode.weight = getPersonalNodeWeight(vkNode);
                                    break;
                            }
                        }
                        children.push(vkNode);
                        vkNode.parent = d;
                    }
                }
                // else{
                // 	console.warn('getChildren reached by edge.targetId a node that cannot be found');
                // }
            }
        }
        if (orderBy) {
            children.sort(function(vkNode1, vkNode2) {
                switch (orderBy) {
                    case 'name':
                        var name1 = vkNode1.kNode.name ? vkNode1.kNode.name.toLowerCase() : '';
                        var name2 = vkNode2.kNode.name ? vkNode2.kNode.name.toLowerCase() : '';
                        if (name1 < name2) return -1; //sort string ascending
                        else if (name1 > name2) return 1;
                        else return 0; //default return value (no sorting)
                    case 'vote':
                    case 'personal_vote':
                        return vkNode2.weight - vkNode1.weight;
                }
            });
        }

        return children;
    };

    MapLayoutTree.prototype.init = function(mapSize, scales) {
        this.scales = scales;

        this.tree = d3.layout.tree();
        // we invert x and y since tree grows to the right
        if (this.configTree.sizing.setNodeSize) {
            this.tree.nodeSize([
                this.configTree.sizing.nodeSize[1],
                this.configTree.sizing.nodeSize[0]
            ]);
        } else {
            this.tree.size([mapSize[1], mapSize[0]]);
        }

        this.tree.children(this.getChildren.bind(this));
    };

    // https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal
    // https://github.com/mbostock/d3/wiki/SVG-Shapes#diagonal_projection
    // https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#diagonal
    // https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md
    // https://www.dashingd3js.com/svg-paths-and-d3js
    // factory that returns D3 diagonal function that is responsible to generate diagonal
    // for provided link
    MapLayoutTree.prototype.diagonal = function(that, isShowingFullSizeImage) {
        // determines source point of a diagonal
        var diagonalSource = function(d) {
            //return d.source;
            // here we are creating object with just necessary parameters (x, y)
            var point = { x: d.source.x, y: d.source.y };

            // we adjust source points to scale
            point.x = that.scales.x(point.x);
            point.y = that.scales.y(point.y);

            // if our node is not just a punctual entity (but it has width)
            if (!that.configNodes.punctual) {
                // we need to adjust diagonals' source and target points
                // by shifting points from the center of node to the edges of node
                // we deal here with y-coordinates
                // (because our final tree is rotated to propagete across the x-axis) instead of y-axis
                // (you can see that in the .project() function
                if (d.source.y < d.target.y) {
                    var width = (isShowingFullSizeImage(d)) ?
                        d.source.kNode.dataContent.image.width / 2 : that.configNodes.html.dimensions.sizes.width / 2;
                    point.y += that.scales.width(width) + 0;
                }
            }
            return point;
        }.bind(that);

        var diagonalTarget = function(d) {
            //return d.target;
            var point = { x: d.target.x, y: d.target.y };
            point.x = that.scales.x(point.x);
            point.y = that.scales.y(point.y);

            if (!that.configNodes.punctual) {
                if (d.target.y > d.source.y) {
                    var width = (isShowingFullSizeImage(d)) ?
                        d.target.kNode.dataContent.image.width / 2 : that.configNodes.html.dimensions.sizes.width / 2;
                    point.y -= that.scales.width(width) + 0;
                }
            }
            return point;
        }.bind(that);
        var diagonal = d3.svg.diagonal()
            .source(diagonalSource)
            .target(diagonalTarget)
            // our final tree is rotated to propagete across the x-axis, instead of y-axis
            // therefor we are swapping x and y coordinates here
            .projection(function(d) {
                return [d.y, d.x];
            });
        return diagonal;
    };

    /**
     * @func generateTree
     * - destroying structure of the old tree
    - setting up VkNode
    position and dimension
    */
    MapLayoutTree.prototype.generateTree = function(source) {
        //this.mapStructure.setVisibilityByDistance(this.mapStructure.getSelectedNode(), 2);
        var that = this;
        if (this.nodes) {
            // Normalize for fixed-depth.
            this.nodes.forEach(function(d) {
                // Stash the old positions for transition
                if ('x' in d) d.x0 = d.x;
                if ('y' in d) d.y0 = d.y;
                if ('width' in d) d.width0 = d.width;
                if ('height' in d) d.height0 = d.height;

                delete d.parent;
                delete d.children;
                delete d.depth;
            });
        }

        if (source) {
            // Compute the new tree layout.
            this.nodes = this.tree.nodes(source).reverse();
            this.links = this.tree.links(this.nodes);

            //links are D3.tree-generated objects of type Object: {source, target}
            for (var i in this.links) {
                var link = this.links[i];
                var edges = this.mapStructure.getEdgesBetweenNodes(link.source.kNode, link.target.kNode);
                if (edges && edges[0]) {
                    link.vkEdge = edges[0]; //TODO: see what will happen when we have more links between two nodes
                }
            }

            // calculating node boundaries
            if (this.configTree.sizing.setNodeSize) {
                this.MoveNodesToPositiveSpace(this.nodes);
            }

            var viewspec = this.configTree.viewspec;
            var sizes = this.configNodes.html.dimensions.sizes;
            this.nodes.forEach(function(d) {
                // Normalize for fixed-depth.
                if (that.configTree.fixedDepth.enabled) {
                    var levelDepth = 300;
                    if (that.configTree.fixedDepth.levelDepth) levelDepth = that.configTree.fixedDepth.levelDepth;
                    d.y = d.depth * levelDepth;
                }

                if (d.parent && d.parent == "null") {
                    d.parent = null;
                }

                if (viewspec == "viewspec_manual") {
                    // update x and y to manual coordinates if present
                    if ('xM' in d && typeof d.xM !== 'undefined' && !isNaN(d.xM)) {
                        d.x = d.xM;
                    }
                    if ('yM' in d && typeof d.yM !== 'undefined' && !isNaN(d.yM)) {
                        d.y = d.yM;
                    }

                    // update width and height to manual values if present
                    if ('widthM' in d && typeof d.widthM !== 'undefined' && !isNaN(d.widthM)) {
                        d.width = d.widthM;
                    } else {
                        d.width = sizes.width;
                    }
                    if ('heightM' in d && typeof d.heightM !== 'undefined' && !isNaN(d.heightM)) {
                        d.height = d.heightM;
                    } else {
                        d.height = sizes.height;
                    }

                    // make it sure that x0 and y0 exist for newly entered nodes
                    if (!("x0" in d) || !("y0" in d)) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    }
                    // make it sure that width0 and height0 exist for newly entered nodes
                    if (!("width0" in d)) {
                        d.width0 = d.width;
                    }
                    if (!("height0" in d)) {
                        d.height0 = d.height;
                    }
                }
            });
        } else {
            this.nodes = [];
            this.links = [];
        }
        // this.printTree(this.nodes);
    };

    MapLayoutTree.prototype.printTree = function(nodes) {
        //TODO: should have print only in Debug mode (for performance reason)
        var minX = 0,
            maxX = 0,
            minY = 0,
            maxY = 0;
        if (nodes) {
            console.log("%d nodes", nodes.length);
        } else {
            console.log("nodes are null");
        }

        if (nodes && nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var height = ('height' in node) ? node.height : 0;
                var width = ('width' in node) ? node.width : 0;
                var name = node.kNode ? node.kNode.name : "(no name)";
                //console.log("\tnode [%d] \"%s\": x:%s, y:%s, width:%s, height: %s)", i, name, node.x, node.y, node.width, node.height);
                if (node.x - height / 2 < minX) minX = node.x - height / 2;
                if (node.x + height / 2 > maxX) maxX = node.x + height / 2;
                if (node.y - width / 2 < minY) minY = node.y - width / 2;
                if (node.y + width / 2 > maxY) maxY = node.y + width / 2;
            }
            console.log("Dimensions: (minX: %s, maxX: %s, minY: %s, maxY: %s)", minX, maxX, minY, maxY);
        }
    };

    MapLayoutTree.prototype.MoveNodesToPositiveSpace = function(nodes) {
        var minX = 0,
            maxX = 0,
            minY = 0,
            maxY = 0;
        var node;
        for (var i in nodes) {
            node = nodes[i];
            var height = ('height' in node) ? node.height : 0;
            var width = ('width' in node) ? node.width : 0;
            if (node.x - height / 2 < minX) minX = node.x - height / 2;
            if (node.x + height / 2 > maxX) maxX = node.x + height / 2;
            if (node.y - width / 2 < minY) minY = node.y - width / 2;
            if (node.y + width / 2 > maxY) maxY = node.y + width / 2;
        }
        console.log("Dimensions: (minX: %s, maxX: %s, minY: %s, maxY: %s)", minX, maxX, minY, maxY);
        for (i in nodes) {
            node = nodes[i];
            node.x += -minX + this.configTree.margin.top;
            node.y += -minY + this.configTree.margin.left;
        }
        maxX += -minX + this.configTree.margin.bottom;
        maxY += -minY + this.configTree.margin.right;
        if (this.upperApi) this.upperApi.setDomSize(maxY, maxX);
    };

}()); // end of 'use strict';