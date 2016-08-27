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
      enabled: false,
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
    private addKnownEdgeTypess:Function;
    private removeKnownEdgeTypess:Function;
    private addSystemEdgeTypess:Function;
    private removeSystemEdgeTypess:Function;

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

      this.puzzlePresentationPluginInfo = {
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
          MapLayoutTree: {
            items: {
              addKnownEdgeTypess: null,
              removeKnownEdgeTypess: null,
              addSystemEdgeTypess: null,
              removeSystemEdgeTypess: null
            },
            $resolved: false,
            callback: null,
            $promise: null
          }
        }
      };

      this.puzzlePresentationPluginInfo.references.map.callback = function() {
        that.puzzlePresentationPluginInfo.references.map.$resolved = true;
        that.mapStructure = that.puzzlePresentationPluginInfo.references.map.items.mapStructure;
      };

      this.puzzlePresentationPluginInfo.apis.map.callback = function() {
        that.puzzlePresentationPluginInfo.apis.map.$resolved = true;
        that.mapUpdate = that.puzzlePresentationPluginInfo.apis.map.items.update;
        that.positionToDatum = that.puzzlePresentationPluginInfo.apis.map.items.positionToDatum;
      };

      this.puzzlePresentationPluginInfo.apis.MapLayoutTree.callback = function() {
        that.puzzlePresentationPluginInfo.apis.MapLayoutTree.$resolved = true;
        that.addKnownEdgeTypess = that.puzzlePresentationPluginInfo.apis.MapLayoutTree.items.addKnownEdgeTypess;
        that.removeKnownEdgeTypess = that.puzzlePresentationPluginInfo.apis.MapLayoutTree.items.removeKnownEdgeTypess;
        that.addSystemEdgeTypess = that.puzzlePresentationPluginInfo.apis.MapLayoutTree.items.addSystemEdgeTypess;
        that.removeSystemEdgeTypess = that.puzzlePresentationPluginInfo.apis.MapLayoutTree.items.removeSystemEdgeTypess;
      };

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
        let presentationNode = this._getPresentationNode();
        if(!presentationNode) return false;

        var edges = this.mapStructure.getEdgesBetweenNodes(presentationNode.kNode, vkNode.kNode);
        if(edges && edges.length > 0) return true;
      }
      return false;
    }

    addNodeToSlides(vkNode, callback?){
      var that:CfPuzzlesPresentationServices = this;
      if(!vkNode || !this.mapStructure || this.isNodeInSlides(vkNode)){
        if(callback) callback(null);
      }else{
        let presentationNode = this._getPresentationNode();
        if(!presentationNode){
          if(callback) callback(null);
        }else{
          let kEdge = new knalledge.KEdge();
          kEdge.type = SLIDE_EDGE_TYPE;
          let vkEdge = new knalledge.VKEdge();
          vkEdge.kEdge = kEdge;

          if(!callback){
            callback = function(){
              if(that.mapUpdate) that.mapUpdate();
            }
          }
          this.mapStructure.createNodeWithEdge(presentationNode, vkEdge, vkNode, callback);
        }
      }
    }

    removeNodeFromSlides(vkNode, callback?){
      var that:CfPuzzlesPresentationServices = this;
      if(!vkNode || !this.mapStructure || !this.isNodeInSlides(vkNode)){
        if(callback) callback(null);
      }else{
        let presentationNode = this._getPresentationNode();
        if(!presentationNode){
          if(callback) callback(null);
        }else{
          var edges = this.mapStructure.getEdgesBetweenNodes(presentationNode.kNode, vkNode.kNode, SLIDE_EDGE_TYPE);
          if(edges.length <= 0){
            callback(null);
          }else{
            let presentationEdge = edges[0];
            if(!callback){
              callback = function(){
                if(that.mapUpdate) that.mapUpdate();
              }
            }
            this.mapStructure.deleteEdge(presentationEdge, callback);
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
      let that:CfPuzzlesPresentationServices = this;
      let callback = function(){
        if(that.mapUpdate) that.mapUpdate();
      }

      if(!this._getPresentationsNode()){
        this._createPresentationsNode(function(){
        this._createPresentationNode(callback);
        }.bind(this));
      }else{
        this._createPresentationNode(callback);
      }
    }

    enable(){
      var that:CfPuzzlesPresentationServices = this;
      this.store.enabled = true;
      this.addKnownEdgeTypess([PRESENTATIONS_EDGE_TYPE, PRESENTATION_EDGE_TYPE]);
      this.addSystemEdgeTypess([SLIDE_EDGE_TYPE]);
      if(that.mapUpdate) that.mapUpdate();
    }

    disable(){
      var that:CfPuzzlesPresentationServices = this;
      this.store.enabled = false;
      this.removeKnownEdgeTypess([PRESENTATIONS_EDGE_TYPE, PRESENTATION_EDGE_TYPE]);
      this.removeSystemEdgeTypess([SLIDE_EDGE_TYPE]);
      if(that.mapUpdate) that.mapUpdate();
    }

    getSelectedItem(){
      if(this.mapStructure){
        return this.mapStructure.getSelectedNode();
      }else{
        return null;
      }
    }

    getSlides(){
      let slides = [];
      if(this.mapStructure){
        let presentationNode = this._getPresentationNode();
        slides = this.mapStructure.getChildrenNodes(presentationNode, SLIDE_EDGE_TYPE);
      }
      return slides;
    }

    addSlide(){
      if(this.mapStructure){
        let vkNode = this.mapStructure.getSelectedNode();
        this.addNodeToSlides(vkNode);
      }
    }

    removeSlide(){
      if(this.mapStructure){
        let vkNode = this.mapStructure.getSelectedNode();
        this.removeNodeFromSlides(vkNode);
      }
    }
}
