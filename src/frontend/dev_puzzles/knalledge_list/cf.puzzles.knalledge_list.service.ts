import { Injectable, Inject } from '@angular/core';

import {GlobalEmitterServicesArray} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

declare var d3: any;
declare var knalledge: any;

export const PLUGIN_NAME: string = 'PUZZLE_IBIS';

@Injectable()
export class CfPuzzlesKnalledgeListService {
  puzzleIbisPluginInfo: any;
  plugins: any = {
  };
  showConcurrentDepths;
  private mapStructure: any;
  private mapLayout;
  private kMap;

  private addChildNode: Function;
  private nodeVote: Function;
  private mapUpdate: Function;
  private positionToDatum: Function;
  private addKnownEdgeTypes: Function;
  private removeKnownEdgeTypes: Function;
  private addSystemEdgeTypes: Function;
  private removeSystemEdgeTypes: Function;

  /**
  * the namespace for core services for the Notify system
  * @namespace cf.puzzles.ibis.CfPuzzlesKnalledgeListService
  */

  /**
  * Service that is a plugin into knalledge.MapVisualization
  * @class CfPuzzlesKnalledgeListService
  * @memberof cf.puzzles.ibis.CfPuzzlesKnalledgeListService
  */

  constructor(
    @Inject('KnalledgeMapViewService') private knalledgeMapViewService,
    @Inject('KnalledgeMapVOsService') private knalledgeMapVOsService,
    @Inject('KnalledgeMapService') private knalledgeMapService,
    @Inject('RimaService') private rimaService,
    // TODO: remove hardcoded dependencies
    // @Inject('CfPuzzlesIbisService') private cfPuzzlesIbisService,
    @Inject('CollaboPluginsService') private collaboPluginsService
    ) {
    var that: CfPuzzlesKnalledgeListService = this;

    this.mapStructure = this.knalledgeMapVOsService.mapStructure;

    this.showConcurrentDepths = 2;
    var config = {
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

      this.mapLayout = new knalledge.MapLayoutTree(this.mapStructure, this.collaboPluginsService, config.nodes, config.tree, null, null, null);

      var scales = {
          x: null,
          y: null,
          width: null,
          height: null
      };

      var scale = d3.scale.linear()
          .domain([0, 1])
          .range([0, 1]);
      scales.x = scale;
      scales.y = scale;
      scales.width = scale;
      scales.height = scale;

      var mapSize = [1000, 1000];

      this.mapLayout.init(scales, mapSize);

      this.puzzleIbisPluginInfo = {
        name: "puzzles.presentation",
        components: {

        },
        references: {
          map: {
            items: {
              mapStructure: {
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
              update: null,
              nodeSelected: null,
              positionToDatum: null
            },
            $resolved: false,
            callback: null,
            $promise: null
          },
          mapInteraction: {
            items: {
              addChildNode: null,
              nodeVote: null
            },
            $resolved: false,
            callback: null,
            $promise: null
          },
          MapLayoutTree: {
            items: {
              addKnownEdgeTypes: null,
              removeKnownEdgeTypes: null,
              addSystemEdgeTypes: null,
              removeSystemEdgeTypes: null
            },
            $resolved: false,
            callback: null,
            $promise: null
          }
        }
      };

      this.puzzleIbisPluginInfo.references.map.callback = function() {
        that.puzzleIbisPluginInfo.references.map.$resolved = true;
        that.mapStructure = that.puzzleIbisPluginInfo.references.map.items.mapStructure;
      };

      this.puzzleIbisPluginInfo.apis.map.callback = function() {
        that.puzzleIbisPluginInfo.apis.map.$resolved = true;
        that.mapUpdate = that.puzzleIbisPluginInfo.apis.map.items.update;
        that.positionToDatum = that.puzzleIbisPluginInfo.apis.map.items.positionToDatum;
      };

      this.puzzleIbisPluginInfo.apis.mapInteraction.callback = function() {
        that.puzzleIbisPluginInfo.apis.mapInteraction.$resolved = true;
        that.addChildNode = that.puzzleIbisPluginInfo.apis.mapInteraction.items.addChildNode;
        that.nodeVote = that.puzzleIbisPluginInfo.apis.mapInteraction.items.nodeVote;
      };

      this.puzzleIbisPluginInfo.apis.MapLayoutTree.callback = function() {
        that.puzzleIbisPluginInfo.apis.MapLayoutTree.$resolved = true;
        that.addKnownEdgeTypes = that.puzzleIbisPluginInfo.apis.MapLayoutTree.items.addKnownEdgeTypes;
        that.removeKnownEdgeTypes = that.puzzleIbisPluginInfo.apis.MapLayoutTree.items.removeKnownEdgeTypes;
        that.addSystemEdgeTypes = that.puzzleIbisPluginInfo.apis.MapLayoutTree.items.addSystemEdgeTypes;
        that.removeSystemEdgeTypes = that.puzzleIbisPluginInfo.apis.MapLayoutTree.items.removeSystemEdgeTypes;

        that.addKnownEdgeTypes([knalledge.KEdge.TYPE_IBIS_QUESTION, knalledge.KEdge.TYPE_IBIS_IDEA,
          knalledge.KEdge.TYPE_IBIS_ARGUMENT, knalledge.KEdge.TYPE_IBIS_COMMENT]);
        // that.addSystemEdgeTypes([]);
      };

      this.collaboPluginsService.registerPlugin(this.puzzleIbisPluginInfo);
    }

    loadMapWithId(mapId) {
      var that = this;
      /**
       * Callback after loading map object from the KnalledgeMapService
       * @param  {knalledge.KMap} map - map object
       */
      var gotMap = function(kMap) {
        that.kMap = kMap;
        console.log('gotMap:' + JSON.stringify(kMap));
        console.log('KnalledgeMapService.map:', that.knalledgeMapService.map);
        // this method broadcasts the 'modelLoadedEvent' event after loading and processing kMap
        // this event is subscribed bellow for
        that.knalledgeMapVOsService.loadAndProcessData(kMap, function() {
          that.mapLayout.generateTree(that.mapStructure.selectedNode);
          // if ($scope.route) {
          //   // alert("redirecting to: " + $scope.route);
          //   if ($scope.route.indexOf("http") < 0) {
          //     $location.path($scope.route);
          //   } else {
          //     $window.location.href = $scope.route;
          //   }
          // }
        });
      };

      console.warn("loading map by mcmMapDirectives: mapId: " + mapId);

      // TODO: FIX: promise doesn't work well, we need callback
      // this.knalledgeMapService.getById(mapId).$promise.then(gotMap);
      this.knalledgeMapService.getById(mapId, gotMap);
    }

    getSubNodes(parenNode, depth, vkNodesList, prefix){
      if(depth <= this.showConcurrentDepths || this.showConcurrentDepths < 0){
        if(parenNode && parenNode.children){
          for(var i=0; i<parenNode.children.length; i++){
            var child = parenNode.children[i];
            var childPrefix = prefix+(i+1)+".";
            child.prefix = childPrefix;
            vkNodesList.push(child);
            this.getSubNodes(child, depth+1, vkNodesList, childPrefix);
          }
        }
      }
    }

    getNodes(){
      var vkNodesList = [];
      // var vkNodesList = this.mapStructure ? Object.values(this.mapStructure.nodesById) : [];
      this.getSubNodes(this.mapStructure.selectedNode, 1, vkNodesList, "");
      return vkNodesList;
    }

    selectNode(vkNode){
      this.mapStructure.setSelectedNode(vkNode);
    }

    goBack(){
      if(this.mapStructure.selectedNode && this.mapStructure.selectedNode.parent){
        this.mapStructure.setSelectedNode(this.mapStructure.selectedNode.parent);
      }
    }

    getAuthor(vkNode):String{
      var author = null;
      if(this.rimaService.config.showUsers){
        var user = this.rimaService.getUserById(vkNode.kNode.iAmId);
        if(user){
          author = "@" + user.displayName;
        }

      }

      return author;
    }

    getType(vkNode):String{
      var nodeType = null;
      // nodeType = this.cfPuzzlesIbisService.getNodeType(vkNode);
      return nodeType;
    }
  }
