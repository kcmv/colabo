import { Injectable, Inject } from '@angular/core';

import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

declare var d3:any;
declare var knalledge:any;

export const PLUGIN_NAME:string = 'PUZZLE_PRESENTATION';
export const PRESENTATIONS_NODE_TYPE:string = 'type_presentations';
export const PRESENTATION_NODE_TYPE:string = 'type_presentation';
export const PRESENTATIONS_EDGE_TYPE:string = 'type_presentations';
export const PRESENTATION_EDGE_TYPE:string = 'type_presentation';

@Injectable()
export class CfPuzzlesPresentationServices {
    puzzlePresentationPluginInfo:any;

    plugins:any = {
        mapVisualizePlugins: {
            service: this,
            store: {
              enabled: true,
              presentations: [

              ],
              currentPresentation: null
            },
            init: function init() {
                var that = this;
            },

            nodeHtmlUpdate: function(nodeHtmlUpdate){
              var that = this;

              if(!that.store.enabled) return;

              nodeHtmlUpdate.select(".node_presentation")
            		.style("display", function(d){
            			return (that.service.knalledgeMapViewService.provider.config.nodes.showTypes && d.kNode && d.kNode.type) ? "block" : "none";
            		})
            		.html(function(d){
            			var label = "";
            			if(d.kNode && d.kNode.type){
            				var type = d.kNode.type;
            			}
            			return label;
            		})
            		.on("click", function(d){
            			console.log('presentation clicked for node ',d.kNode.name);
            			d3.event.stopPropagation();
            			that.upperAPI.nodeTypeClicked(d);
            		});
            }
        }
    };

    private mapStructure:any;
    private mapUpdate:Function;
    private positionToDatum:Function;
    private presentationsVKNode:knalledge.VKNode;
    private presentationVKNode:knalledge.VKNode;

    /**
    * the namespace for core services for the Notify system
    * @namespace cf.puzzles.presentation.CfPuzzlesPresentationServices
    */

    /**
    * Service that is a plugin into knalledge.MapVisualization
    * @class CfPuzzlesPresentationServices
    * @memberof cf.puzzles.presentation.CfPuzzlesPresentationServices
    */
    constructor(
      @Inject('KnalledgeMapViewService') private knalledgeMapViewService,
      @Inject('CollaboPluginsService') private collaboPluginsService
    ) {
      var that:CfPuzzlesPresentationServices = this;
      //this.collaboPluginsService = this.$injector.get('CollaboPluginsService');
      this.puzzlePresentationPluginInfo = {
        name: "brainstorming",
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
          }
        }
      };

      // this.puzzlePresentationPluginInfo.references.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
      this.puzzlePresentationPluginInfo.references.map.callback = function() {
        that.puzzlePresentationPluginInfo.references.map.$resolved = true;
        that.mapStructure = that.puzzlePresentationPluginInfo.references.map.items.mapStructure;
        that.presentationsVKNode = that._getPresentationsNode();
        that.presentationVKNode = that._getPresentationNode();
      };
      // });
      //
      // this.puzzlePresentationPluginInfo.apis.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
      this.puzzlePresentationPluginInfo.apis.map.callback = function() {
        that.puzzlePresentationPluginInfo.apis.map.$resolved = true;
        that.mapUpdate = that.puzzlePresentationPluginInfo.apis.map.items.update;
        that.positionToDatum = that.puzzlePresentationPluginInfo.apis.map.items.positionToDatum;
        // resolve(that.puzzlePresentationPluginInfo.apis.map);
      };
      // });
      //

      this.collaboPluginsService.registerPlugin(this.puzzlePresentationPluginInfo);
    }

    presentationAvailable(){
      return !!this.presentationsVKNode;
    }

    _getPresentationsNode(){
      let presentationsNode;
      if(this.mapStructure){
        presentationsNode = this.mapStructure.getVKNodeByType(PRESENTATIONS_NODE_TYPE);
      }
      return presentationsNode;
    }

    _getPresentationNode(){
      let presentationNode;
      if(this.mapStructure){
        presentationNode = this.mapStructure.getVKNodeByType(PRESENTATION_NODE_TYPE);
      }
      return presentationNode;
    }

    _createPresentationsNode (callback?:Function){
      let rootNode = this.mapStructure.rootNode;
      if(!rootNode) return;
      let kEdge = new knalledge.KEdge();
      kEdge.type = PRESENTATIONS_EDGE_TYPE;
      let vkEdge = new knalledge.VKEdge();
      vkEdge.kEdge = kEdge;

      let presentationsKNode = new knalledge.KNode();
      presentationsKNode.type = PRESENTATIONS_NODE_TYPE;
      presentationsKNode.name = "Presentations";
      let presentationsVKNode = new knalledge.VKNode();
      presentationsVKNode.kNode = presentationsKNode;

      this.presentationsVKNode = presentationsVKNode;

      this.mapStructure.createNodeWithEdge(rootNode, vkEdge, presentationsVKNode, callback);
    }

    _createPresentationNode (callback?:Function){
      if(!this.presentationsVKNode) return;
      let kEdge = new knalledge.KEdge();
      kEdge.type = PRESENTATION_EDGE_TYPE;
      let vkEdge = new knalledge.VKEdge();
      vkEdge.kEdge = kEdge;

      let presentationKNode = new knalledge.KNode();
      presentationKNode.type = PRESENTATION_NODE_TYPE;
      presentationKNode.name = "Presentation";
      let presentationVKNode = new knalledge.VKNode();
      presentationVKNode.kNode = presentationKNode;

      this.presentationVKNode = presentationVKNode;

      this.mapStructure.createNodeWithEdge(this.presentationsVKNode, vkEdge, presentationVKNode, callback);
    }

    createPresentation(){

      if(this.mapStructure){
         var vkPresentationsNode = this.mapStructure.getVKNodeByType(PRESENTATIONS_NODE_TYPE);

         if(!vkPresentationsNode){
           this._createPresentationsNode(this._createPresentationNode.bind(this));
         }else{
           this._createPresentationNode();
         }
      }
    }

    restart(){

    }

    finish(){

    }
}
