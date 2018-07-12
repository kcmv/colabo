import { Injectable, Inject } from '@angular/core';

import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

declare var d3: any;
declare var knalledge: any;

export const PLUGIN_NAME: string = 'PUZZLE_IBIS';

@Injectable()
export class CfPuzzlesIbisService {
  puzzleIbisPluginInfo: any;
  plugins: any = {
    mapVisualizePlugins: {
      service: this,
      init: function init() {
        var that = this;
      },

      nodeHtmlEnter: function(nodeHtmlEnter) {
        var that = this;

        // TODO: we cannot optimize
        // if(this.knalledgeMapViewService.provider.config.nodes.showTypes){
        nodeHtmlEnter
          .append("div")
          .attr("class", "node_type");
      },

      nodeHtmlUpdate: function(nodeHtmlUpdate) {
        var that = this;
        nodeHtmlUpdate.select(".node_type")
          .style("display", function(d) {
          return (that.service.knalledgeMapViewService.provider.config.nodes.showTypes && d.kNode && d.kNode.type) ? "block" : "none";
        })
          .html(function(d) {
            return that.service.getNodeType(d);
        })
          .on("click", function(d) {
          console.log('type clicked for node ', d.kNode.name);
          d3.event.stopPropagation();
          that.upperAPI.nodeTypeClicked(d);
        });
      }
    }
  };
  private mapStructure: any;
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
  * @namespace cf.puzzles.ibis.CfPuzzlesIbisService
  */

  /**
  * Service that is a plugin into knalledge.MapVisualization
  * @class CfPuzzlesIbisService
  * @memberof cf.puzzles.ibis.CfPuzzlesIbisService
  */
  constructor(
    @Inject('KnalledgeMapViewService') private knalledgeMapViewService,
    @Inject('CollaboPluginsService') private collaboPluginsService
    ) {
    var that: CfPuzzlesIbisService = this;

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

  getNodeType(vkNode){
    var label = "";
    if (vkNode.kNode && vkNode.kNode.type) {
      var type = vkNode.kNode.type;
      switch (type) {
        case "type_ibis_question":
                type = "ibis:QUESTION";
                break;
        case "type_ibis_idea":
                type = "ibis:IDEA";
                break;
        case "type_ibis_argument":
                type = "ibis:ARGUMENT";
                break;
        case "type_ibis_comment":
                type = "ibis:COMMENT";
                break;
        case "type_knowledge":
                type = "kn:KnAllEdge";
                break;

        case "model_component":
                type = "csdms:COMPONENT";
                break;
        case "object":
                type = "csdms:OBJECT";
                break;
        case "variable":
                type = "csdms:VARIABLE";
                break;
        case "assumption":
                type = "csdms:ASSUMPTION";
                break;
        case "grid_desc":
                type = "csdms:GRID DESC";
                break;
        case "grid":
                type = "csdms:GRID";
                break;
        case "process":
                type = "csdms:PROCESS";
                break;
      }
      label = "%" + type;
    }
    return label;
  }

  createNodeQuestion() {
    if (!this.mapStructure.getSelectedNode()) {
      window.alert('You have to select a node which you are addressing your comment to.');
      return; // no parent node selected
    }

    if (this.addChildNode) this.addChildNode(knalledge.KNode.TYPE_IBIS_QUESTION, knalledge.KEdge.TYPE_IBIS_QUESTION);
  }

  createNodeIdea() {
    if (this.addChildNode) this.addChildNode(knalledge.KNode.TYPE_IBIS_IDEA, knalledge.KEdge.TYPE_IBIS_IDEA);
  }


  createNodeArgument() {
    if (this.addChildNode) this.addChildNode(knalledge.KNode.TYPE_IBIS_ARGUMENT, knalledge.KEdge.TYPE_IBIS_ARGUMENT);
  }

  createNodeComment() {
    if (this.addChildNode) this.addChildNode(knalledge.KNode.TYPE_IBIS_COMMENT, knalledge.KEdge.TYPE_IBIS_COMMENT);
  }

  voteNodeUp() {
    if (this.nodeVote) this.nodeVote(+1);
  }

  voteNodeDown() {
    if (this.nodeVote) this.nodeVote(-1);
  }
}
