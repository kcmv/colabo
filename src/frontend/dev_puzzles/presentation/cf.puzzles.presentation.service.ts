import { Injectable, Inject } from '@angular/core';

import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

declare var d3:any;
declare var knalledge:any;

export const PLUGIN_NAME:string = 'PUZZLE_PRESENTATION';
export const PRESENTATIONS_NODE_TYPE:string = 'type_presentations';
export const PRESENTATION_NODE_TYPE:string = 'type_presentation';
export const PRESENTATIONS_EDGE_TYPE:string = 'type_presentations';
export const PRESENTATION_EDGE_TYPE:string = 'type_presentation';
export const SLIDE_EDGE_TYPE:string = 'type_slide';

@Injectable()
export class CfPuzzlesPresentationServices {
    puzzlePresentationPluginInfo:any;
    store:any = {
      enabled: true,
      presentations: [

      ],
      currentPresentation: null
    };

    plugins:any = {
        mapVisualizePlugins: {
            service: this,
            init: function init() {
                var that = this;
            },

            nodeHtmlEnter: function(nodeHtmlEnter){
              var that = this;

              nodeHtmlEnter
            		.append("div")
            			.attr("class", "node_presentation");
            },

            nodeHtmlUpdate: function(nodeHtmlUpdate){
              var that = this;

              nodeHtmlUpdate.select(".node_presentation")
            		.style("display", function(d){
            			return (that.service.store.enabled) ? "block" : "none";
            		})
            		.html(function(d){
            			var label = "";
            			if(that.service.isNodeInSlides(d)){
            				label = "S";
            			}else{
                    label = "-";
                  }
            			return label;
            		})
            		.on("click", function(d){
            			console.log('presentation clicked for node ',d.kNode.name);
            			d3.event.stopPropagation();
                  if(that.service.isNodeInSlides(d)){
                    that.service.removeNodeFromSlides(d);
            			}else{
                    that.service.addNodeToSlides(d);
                  }
            		});
            }
        }
    };

    private mapStructure:any;
    private mapUpdate:Function;
    private positionToDatum:Function;

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
      return this._getPresentationsNode() && this._getPresentationNode();
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

    isNodeInSlides(vkNode){
      if(vkNode && this.mapStructure){
        let presentationNode = this.mapStructure.getVKNodeByType(PRESENTATION_NODE_TYPE);
        if(!presentationNode) return false;

        var edges = this.mapStructure.getEdgesBetweenNodes(presentationNode.kNode, vkNode.kNode);
        if(edges && edges.length > 0) return true;
      }
      return false;
    }

    addNodeToSlides(vkNode, callback){
      if(!vkNode || !this.mapStructure || this.isNodeInSlides(vkNode)){
        if(callback) callback(null);
      }else{
        let presentationNode = this.mapStructure.getVKNodeByType(PRESENTATION_NODE_TYPE);
        if(!presentationNode){
          if(callback) callback(null);
        }else{
          let kEdge = new knalledge.KEdge();
          kEdge.type = SLIDE_EDGE_TYPE;
          let vkEdge = new knalledge.VKEdge();
          vkEdge.kEdge = kEdge;

          this.mapStructure.createNodeWithEdge(presentationNode, vkEdge, vkNode, callback);
        }
      }
    }

    removeNodeFromSlides(vkNode, callback){
      if(!vkNode || !this.mapStructure || !this.isNodeInSlides(vkNode)){
        if(callback) callback(null);
      }else{
        let presentationNode = this.mapStructure.getVKNodeByType(PRESENTATION_NODE_TYPE);
        if(!presentationNode){
          if(callback) callback(null);
        }else{
          var edges = this.mapStructure.getEdgesBetweenNodes(presentationNode.kNode, vkNode.kNode, SLIDE_EDGE_TYPE);
          if(edges.length <= 0){
            callback(null);
          }else{
            let presentationEdge = edges[0];
            this.mapStructure.deleteEdge(presentationEdge);
          }
        }
      }
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

      this.mapStructure.createNodeWithEdge(rootNode, vkEdge, presentationsVKNode, callback);
    }

    _createPresentationNode (callback?:Function){
      let presentationsVKNode = this._getPresentationsNode();
      if(!presentationsVKNode) return;

      let kEdge = new knalledge.KEdge();
      kEdge.type = PRESENTATION_EDGE_TYPE;
      let vkEdge = new knalledge.VKEdge();
      vkEdge.kEdge = kEdge;

      let presentationKNode = new knalledge.KNode();
      presentationKNode.type = PRESENTATION_NODE_TYPE;
      presentationKNode.name = "Presentation";
      let presentationVKNode = new knalledge.VKNode();
      presentationVKNode.kNode = presentationKNode;

      this.mapStructure.createNodeWithEdge(presentationsVKNode, vkEdge, presentationVKNode, callback);
    }

    createPresentation(){
       if(!this._getPresentationsNode()){
         this._createPresentationsNode(function(){
           this._createPresentationNode();
         }.bind(this));
       }else{
         this._createPresentationNode();
       }
    }

    enable(){
      this.store.enabled = true;
    }

    disable(){
      this.store.enabled = false;
    }

    restart(){

    }

    finish(){

    }
}
