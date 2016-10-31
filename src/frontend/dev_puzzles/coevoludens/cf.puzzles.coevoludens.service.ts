import { Injectable, Inject } from '@angular/core';

import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

declare var d3:any;
declare var knalledge:any;
declare var hljs:any;
declare var Reveal:any;
declare var RevealMarkdown:any;

export const PLUGIN_NAME:string = 'PUZZLE_COEVOLUDENS';
export const COEVOLUDENSES_NODE_TYPE:string = 'type_coevoludenss';
export const COEVOLUDENS_NODE_TYPE:string = 'type_coevoludens';
export const COEVOLUDENSES_EDGE_TYPE:string = 'type_coevoludenss';
export const COEVOLUDENS_EDGE_TYPE:string = 'type_coevoludens';
export const SLIDE_EDGE_TYPE:string = 'type_slide';

export const DATA_SEPARATOR_HORIZONTAL:string = '--horizontal--';
export const DATA_SEPARATOR_VERTICAL:string = '--vertical--';
export const DATA_SEPARATOR_NOTES:string = '--notes--';

@Injectable()
export class CfPuzzlesCoevoludensServices {
    puzzleCoevoludensPluginInfo:any;
    store:any = {
      enabled: false,
      initialized: false,
      presenting: false,
      coevoludenss: [

      ],
      currentCoevoludens: null
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
            			.attr("class", "node_coevoludens");
            },

            nodeHtmlUpdate: function(nodeHtmlUpdate){
              var that = this;

              nodeHtmlUpdate.select(".node_coevoludens")
            		.style("display", function(d){
            			return (that.service.store.enabled) ? "block" : "none";
            		})
                // 'S' for node contained in coevoludens, and '-' for node outside coevoludens
            		.html(function(d){
            			var label = "";
            			if(that.service.isNodeInSlides(d)){
            				label = "S";
            			}else{
                    label = "-";
                  }
            			return label;
            		})
                // toggle node presence in coevoludens
            		.on("click", function(d){
            			console.log('coevoludens clicked for node ',d.kNode.name);
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
    private mapNodeSelected:Function;
    private positionToDatum:Function;
    private addKnownEdgeTypes:Function;
    private removeKnownEdgeTypes:Function;
    private addSystemEdgeTypes:Function;
    private removeSystemEdgeTypes:Function;
    private slideChangedEventListenerBinded:Function;
    private disableKeyboard:Function;
    private enableKeyboard:Function;

    /**
    * the namespace for core services for the Notify system
    * @namespace cf.puzzles.coevoludens.CfPuzzlesCoevoludensServices
    */

    /**
    * Service that is a plugin into knalledge.MapVisualization
    * @class CfPuzzlesCoevoludensServices
    * @memberof cf.puzzles.coevoludens.CfPuzzlesCoevoludensServices
    */
    constructor(
      @Inject('KnalledgeMapViewService') private knalledgeMapViewService,
      @Inject('CollaboPluginsService') private collaboPluginsService
    ) {
      var that:CfPuzzlesCoevoludensServices = this;

      // access to CF internals through plugin mechanism
      this.puzzleCoevoludensPluginInfo = {
        name: "puzzles.coevoludens",
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
              positionToDatum: null,
              disableKeyboard: null,
              enableKeyboard: null
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

      this.puzzleCoevoludensPluginInfo.references.map.callback = function() {
        that.puzzleCoevoludensPluginInfo.references.map.$resolved = true;
        that.mapStructure = that.puzzleCoevoludensPluginInfo.references.map.items.mapStructure;
      };

      this.puzzleCoevoludensPluginInfo.apis.map.callback = function() {
        that.puzzleCoevoludensPluginInfo.apis.map.$resolved = true;
        that.mapUpdate = that.puzzleCoevoludensPluginInfo.apis.map.items.update;
        that.mapNodeSelected = that.puzzleCoevoludensPluginInfo.apis.map.items.nodeSelected;
        that.positionToDatum = that.puzzleCoevoludensPluginInfo.apis.map.items.positionToDatum;
        that.disableKeyboard = that.puzzleCoevoludensPluginInfo.apis.map.items.disableKeyboard;
        that.enableKeyboard = that.puzzleCoevoludensPluginInfo.apis.map.items.enableKeyboard;
      };

      this.puzzleCoevoludensPluginInfo.apis.MapLayoutTree.callback = function() {
        that.puzzleCoevoludensPluginInfo.apis.MapLayoutTree.$resolved = true;
        that.addKnownEdgeTypes = that.puzzleCoevoludensPluginInfo.apis.MapLayoutTree.items.addKnownEdgeTypes;
        that.removeKnownEdgeTypes = that.puzzleCoevoludensPluginInfo.apis.MapLayoutTree.items.removeKnownEdgeTypes;
        that.addSystemEdgeTypes = that.puzzleCoevoludensPluginInfo.apis.MapLayoutTree.items.addSystemEdgeTypes;
        that.removeSystemEdgeTypes = that.puzzleCoevoludensPluginInfo.apis.MapLayoutTree.items.removeSystemEdgeTypes;
      };

      this.collaboPluginsService.registerPlugin(this.puzzleCoevoludensPluginInfo);

      this.slideChangedEventListenerBinded = this.slideChangedEventListener.bind(this);
    }

    getStore():any{
      return this.store;
    }

    isCoevoludensAvailable(){
      return this._getCoevoludenssNode() && this._getCoevoludensNode();
    }

    // get coevoludenss' holder node (there might be many coevoludenss)
    _getCoevoludenssNode(){
      let coevoludenssNode;
      if(this.mapStructure){
        coevoludenssNode = this.mapStructure.getVKNodeByType(COEVOLUDENSES_NODE_TYPE);
      }
      return coevoludenssNode;
    }

    // get node that holds 'default' coevoludens (note, there might be many of them but currently we are supporting only one)
    _getCoevoludensNode(){
      let coevoludensNode;
      if(this.mapStructure){
        coevoludensNode = this.mapStructure.getVKNodeByType(COEVOLUDENS_NODE_TYPE);
      }
      return coevoludensNode;
    }

    // is node in the currently selected coevoludens
    isNodeInSlides(vkNode){
      if(vkNode && this.mapStructure){
        let coevoludensNode = this._getCoevoludensNode();
        if(!coevoludensNode) return false;

        var edges = this.mapStructure.getEdgesBetweenNodes(coevoludensNode.kNode, vkNode.kNode);
        if(edges && edges.length > 0) return true;
      }
      return false;
    }

    // add node to the currently selected coevoludens
    private addNodeToSlides(vkNode, slidePosition, callback?){
      var that:CfPuzzlesCoevoludensServices = this;
      if(!vkNode || !this.mapStructure || this.isNodeInSlides(vkNode)){
        if(callback) callback(null);
      }else{
        let coevoludensNode = this._getCoevoludensNode();
        if(!coevoludensNode){
          if(callback) callback(null);
        }else{
          let kEdge = new knalledge.KEdge();
          kEdge.type = SLIDE_EDGE_TYPE;
          if(typeof slidePosition !== 'number'){
            let vkEdges = this.mapStructure.getChildrenEdges(coevoludensNode, SLIDE_EDGE_TYPE);
            slidePosition = vkEdges.length;
          }
          if(typeof slidePosition === 'number') kEdge.value = slidePosition;
          let vkEdge = new knalledge.VKEdge();
          vkEdge.kEdge = kEdge;

          if(!callback){
            callback = function(){
              if(that.mapUpdate) that.mapUpdate();
            }
          }
          // add an edge between the coevoludens and vkNode
          // (= add node to coevoludens)
          this.mapStructure.createNodeWithEdge(coevoludensNode, vkEdge, vkNode, callback);
        }
      }
    }

    // remove node from the currently selected coevoludens
    private removeNodeFromSlides(vkNode, callback?){
      var that:CfPuzzlesCoevoludensServices = this;
      if(!vkNode || !this.mapStructure || !this.isNodeInSlides(vkNode)){
        if(callback) callback(null);
      }else{
        let coevoludensNode = this._getCoevoludensNode();
        if(!coevoludensNode){
          if(callback) callback(null);
        }else{
          // check if there is edge between the coevoludens and vkNode
          var edges = this.mapStructure.getEdgesBetweenNodes(coevoludensNode.kNode, vkNode.kNode, SLIDE_EDGE_TYPE);
          if(edges.length <= 0){
            callback(null);
          }else{
            let coevoludensEdge = edges[0];
            if(!callback){
              callback = function(){
                if(that.mapUpdate) that.mapUpdate();
              }
            }
            this.mapStructure.deleteEdge(coevoludensEdge, callback);
          }
        }
      }
    }

    // create coevoludenss node for map without coevoludenss node
    _createCoevoludenssNode (callback?:Function){
      let rootNode = this.mapStructure.rootNode;
      if(!rootNode) return;
      let kEdge = new knalledge.KEdge();
      kEdge.type = COEVOLUDENSES_EDGE_TYPE;
      let vkEdge = new knalledge.VKEdge();
      vkEdge.kEdge = kEdge;

      let coevoludenssKNode = new knalledge.KNode();
      coevoludenssKNode.type = COEVOLUDENSES_NODE_TYPE;
      coevoludenssKNode.name = "Coevoludenss";
      let coevoludenssVKNode = new knalledge.VKNode();
      coevoludenssVKNode.kNode = coevoludenssKNode;

      this.mapStructure.createNodeWithEdge(rootNode, vkEdge, coevoludenssVKNode, callback);
    }

    // create coevoludens node for map without any coevoludens, or simply adding a new coevoludens
    private _createCoevoludensNode (callback?:Function){
      let coevoludenssVKNode = this._getCoevoludenssNode();
      if(!coevoludenssVKNode) return;

      let kEdge = new knalledge.KEdge();
      kEdge.type = COEVOLUDENS_EDGE_TYPE;
      let vkEdge = new knalledge.VKEdge();
      vkEdge.kEdge = kEdge;

      let coevoludensKNode = new knalledge.KNode();
      coevoludensKNode.type = COEVOLUDENS_NODE_TYPE;
      coevoludensKNode.name = "Coevoludens";
      let coevoludensVKNode = new knalledge.VKNode();
      coevoludensVKNode.kNode = coevoludensKNode;

      this.mapStructure.createNodeWithEdge(coevoludenssVKNode, vkEdge, coevoludensVKNode, callback);
    }

    // similar to _createCoevoludensNode but for external call and for double checking existance of presentaiton node
    // (since we are currently supporting only one), etc
    createCoevoludens(){
      let that:CfPuzzlesCoevoludensServices = this;
      let callback = function(){
        if(that.mapUpdate) that.mapUpdate();
      }

      if(!this._getCoevoludenssNode()){
        this._createCoevoludenssNode(function(){
        this._createCoevoludensNode(callback);
        }.bind(this));
      }else{
        this._createCoevoludensNode(callback);
      }
    }

    // enable coevoludens puzzle
    enable(){

      var that:CfPuzzlesCoevoludensServices = this;
      if(!this.store.initialized){
        this.initCoevoludens();
        this.store.initialized = true;
      }
      this.store.enabled = true;
      this.addKnownEdgeTypes([COEVOLUDENSES_EDGE_TYPE, COEVOLUDENS_EDGE_TYPE]);
      this.addSystemEdgeTypes([SLIDE_EDGE_TYPE]);
      this._orderSlidesAndUpdateEdgeValues();
      if(that.mapUpdate) that.mapUpdate();
    }

    // disable coevoludens puzzle
    disable(){
      var that:CfPuzzlesCoevoludensServices = this;
      this.store.enabled = false;
      this.removeKnownEdgeTypes([COEVOLUDENSES_EDGE_TYPE, COEVOLUDENS_EDGE_TYPE]);
      this.removeSystemEdgeTypes([SLIDE_EDGE_TYPE]);
      if(that.mapUpdate) that.mapUpdate();
    }

    _sortEdgesByWeight(eA, eB):Number{
      // ensure that numbers are always placed first
      if(typeof eA.kEdge.value !== 'number') return 1;
      if(typeof eB.kEdge.value !== 'number') return -1;

      return eA.kEdge.value - eB.kEdge.value;
    }

    /**
    Ensures that all edges of all nodes that are part of slideshow have value (order)
    and that those values are forming an uniform array [0, 1, 2, ..., (slides_no-1)]
    */
    _orderSlidesAndUpdateEdgeValues(callback?){
      if(this.mapStructure){
        let coevoludensNode = this._getCoevoludensNode();
        if(!coevoludensNode){
          if(callback) callback(null);
          return;
        }

        let vkEdges = this.mapStructure.getChildrenEdges(coevoludensNode, SLIDE_EDGE_TYPE);
        vkEdges.sort(this._sortEdgesByWeight);
        for(let i=0; i<vkEdges.length; i++){
          let vkEdge = vkEdges[i];
          // we need a strictly ordered array of edges
          if(typeof vkEdge.kEdge.value !== 'number' || vkEdge.kEdge.value !== i){
            this.mapStructure.updateEdge(vkEdge, knalledge.MapStructure.UPDATE_EDGE_VALUE, i);
          }
        }
      }
    }

    // interface to mapStructure's method
    getSelectedItem(){
      if(this.mapStructure){
        return this.mapStructure.getSelectedNode();
      }else{
        return null;
      }
    }

    // get all nodes that belongs to coevoludens
    getSlides(){
      let slides = [];
      if(this.mapStructure){
        let coevoludensNode = this._getCoevoludensNode();
        if(coevoludensNode){
          let vkEdges = this.mapStructure.getChildrenEdges(coevoludensNode, SLIDE_EDGE_TYPE);
          vkEdges.sort(this._sortEdgesByWeight);
          for(let i=0; i<vkEdges.length; i++){
            let vkEdge = vkEdges[i];
            slides.push(this.mapStructure.getVKNodeByKId(vkEdge.kEdge.targetId));
          }
        }
      }
      return slides;
    }

    // adds currently selected node to coevoludens
    addSlide(){
      if(this.mapStructure){
        let vkNode = this.mapStructure.getSelectedNode();
        let coevoludensNode = this._getCoevoludensNode();
        if(coevoludensNode){
          let vkEdges = this.mapStructure.getChildrenEdges(coevoludensNode, SLIDE_EDGE_TYPE);
          this.addNodeToSlides(vkNode, vkEdges.length);
        }
      }
    }

    // removes currently selected node from coevoludens
    removeSlide(){
      if(this.mapStructure){
        let vkNode = this.mapStructure.getSelectedNode();
        this.removeNodeFromSlides(vkNode);
        this._orderSlidesAndUpdateEdgeValues();
      }
    }

    // creates place holder for slides for Reveal.js
    private generateCoevoludensHolder(callback){
      // $('.coevoludens-display').remove();
      // var coevoludens = $("<div id='coevoludens'></div>")
      // $('body').append(coevoludens);

      var coevoludens = $('.coevoludens-display');
      // $('.coevoludens-display .slides').remove();
      // var slides = $("<div class='slides'></div>");
      // $('.coevoludens-display').append(slides);
      // coevoludens.append(slides);
      var slides = $('.coevoludens-display .slides');
      slides.empty();

      if(callback){
        window.setTimeout(function(){
          callback(slides);
        }, 500);
      }
    }

    // generates 2 demo slides for Reveal.js
    private _generateCoevoludensSlidesDemo(slides, callback){
      // slide 1
      var section = $("<section></section>");
      slides.append(section);
      section.attr('data-markdown', '');

      var script = $("<script></script>");
      section.append(script);
      script.attr('type', 'text/template');

      var slideContent =
      "and here is the image\r\n" +
      "<img src='https://cdn.psychologytoday.com/sites/default/files/field_blog_entry_images/flower-887443_960_720.jpg' width='200px' height='200px'>\r\n" +
      "and here is the list\r\n" +
      "+ hopa\r\n" +
      "+ cupa\r\n" +
      "+ and some intended links\r\n" +
      "	+ [CS link](http://www.CollaboScience.com)\r\n" +
      "	+ [CA link](http://www.CollaboArte.com)\r\n" +
      "	+ [CF link](https://github.com/Cha-OS/KnAllEdge/)\r\n";

      script.html(slideContent);

      // slide 2
      var section = $("<section></section>");
      slides.append(section);
      section.attr('data-markdown', '');

      var script = $("<script></script>");
      section.append(script);
      script.attr('type', 'text/template');

      var slideContent =
      "`range = maximum - minimum`\r\n\r\n" +

      "**not robust** and it's very **sensitive** to **outliers** or extremely large or small values\r\n" +
      "[Link](http://www.CollaboScience.com)\r\n" +
      "and here is the image\r\n" +
      "![Life](https://cdn.psychologytoday.com/sites/default/files/field_blog_entry_images/flower-887443_960_720.jpg)\r\n";

      script.html(slideContent);

      if(callback){
        window.setTimeout(callback, 500);
      }
    }

    // generates slides ready for Reveal.js to present them
    generateCoevoludensSlides(slidesDom, callback){
      var slides = this.getSlides();

      for(var sI=0; sI<slides.length; sI++){
        var slide = slides[sI];

        // slide 1
        // each slide is contained in section
        var section = $("<section></section>");
        slidesDom.append(section);

        // we need to tell that slide is in markdown format so markdown plugin will render it
        section.attr('data-markdown', '');
        // DATA_SEPARATOR_VERTICAL in node's property will split the node preperty content into two vertical slides
        // or more if more separators are added
        section.attr('data-separator-vertical', DATA_SEPARATOR_VERTICAL);
        // DATA_SEPARATOR_HORIZONTAL in node's property will split node preperty content into two horizontal slides
        // or more if more separators are added
        section.attr('data-separator', DATA_SEPARATOR_HORIZONTAL);
        // https://github.com/hakimel/reveal.js#speaker-notes
        // --notes-- in node's property will create node content that will not be visible in coevoludens
        // but only to the presenter
        section.attr('data-separator-notes', DATA_SEPARATOR_NOTES);

        // markdown content is wrapped in extra script template wrapper
        var script = $("<script></script>");
        section.append(script);
        script.attr('type', 'text/template');

        // TODO: we need to add node embeded photo
        var slideContent =
          "# " + slide.kNode.name + "\r\n\r\n";
        if(slide.kNode.dataContent && slide.kNode.dataContent.property &&
          slide.kNode.dataContent.propertyType === 'text/markdown'){
          slideContent += slide.kNode.dataContent.property;
        }
        // vkNode.kNode.dataContent.propertyType

        script.html(slideContent);
      }

      if(callback){
        window.setTimeout(callback, 500);
      }
    }

    slideMoveUp (callback?){
      if(this.mapStructure){
        let coevoludensNode = this._getCoevoludensNode();
        if(!coevoludensNode){
          if(callback) callback(null);
          return;
        }

        let slideVkNode = this.mapStructure.getSelectedNode();
        let slideVkEdge = this.mapStructure.getEdge(coevoludensNode.id, slideVkNode.id);

        let vkEdges = this.mapStructure.getChildrenEdges(coevoludensNode, SLIDE_EDGE_TYPE);
        vkEdges.sort(this._sortEdgesByWeight);
        for(let i=0; i<vkEdges.length; i++){
          let vkEdge = vkEdges[i];
          if(vkEdge === slideVkEdge && i>0){
            // swap positions of two slides (edges)
            this.mapStructure.updateEdge(slideVkEdge, knalledge.MapStructure.UPDATE_EDGE_VALUE,
              slideVkEdge.kEdge.value-1);
            this.mapStructure.updateEdge(vkEdges[i-1], knalledge.MapStructure.UPDATE_EDGE_VALUE,
              vkEdges[i-1].kEdge.value+1);
          }
        }
      }
    }

    slideMoveDown (callback?){
      if(this.mapStructure){
        let coevoludensNode = this._getCoevoludensNode();
        if(!coevoludensNode){
          if(callback) callback(null);
          return;
        }

        let slideVkNode = this.mapStructure.getSelectedNode();
        let slideVkEdge = this.mapStructure.getEdge(coevoludensNode.id, slideVkNode.id);

        let vkEdges = this.mapStructure.getChildrenEdges(coevoludensNode, SLIDE_EDGE_TYPE);
        vkEdges.sort(this._sortEdgesByWeight);
        for(let i=0; i<vkEdges.length; i++){
          let vkEdge = vkEdges[i];
          if(vkEdge === slideVkEdge && i<(vkEdges.length-1)){
            // swap positions of two slides (edges)
            this.mapStructure.updateEdge(slideVkEdge, knalledge.MapStructure.UPDATE_EDGE_VALUE,
              slideVkEdge.kEdge.value+1);
            this.mapStructure.updateEdge(vkEdges[i+1], knalledge.MapStructure.UPDATE_EDGE_VALUE,
              vkEdges[i+1].kEdge.value-1);
          }
        }
      }
    }

    // ask Reveal and markdown plugin to rerender and update itself according to new slides
    updateReveal(callback){
      RevealMarkdown.initialize();
      window.setTimeout(function(){
        RevealMarkdown.convertSlides();

        window.setTimeout(function(){

          try{
            RevealMarkdown.slidify();
          }catch(e){
            console.error("Error with RevealMarkdown.slidify:", e);
          }finally {
            window.setTimeout(function(){
              Reveal.sync();

              if(callback){
                window.setTimeout(callback, 500);
              }
            }, 500);
          }

        }, 500);
      }, 500);
    }

    // generate coevoludens from slides inside the coevoludens
    generateCoevoludens(callback){
      this.generateCoevoludensHolder(function(slides){
        this.generateCoevoludensSlides(slides, function(){
          this.updateReveal(function(){
            if(callback) callback();
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }

    // init coevoludens for the first time
    // add Reveal.js coevoludens holder (remove if it already existed)
    // configure Reveal.js, ...
    // NOTE: this is not idempotent
    initCoevoludens(callback?){
      var coevoludens = $('.coevoludens-display');
      coevoludens.empty();

      var slides = $("<div class='slides'></div>");
      coevoludens.append(slides);

      window.setTimeout(startReveal.bind(this), 1500);

      function startReveal(){
        Reveal.initialize({
          // Display controls in the bottom right corner
          controls: true,
          // Display a coevoludens progress bar
          progress: true,
          // Display the page number of the current slide
          slideNumber: 'c/t',
          // Enable keyboard shortcuts for navigation
          keyboard: true,
          // Enable the slide overview mode
          overview: true,
          // Vertical centering of slides
          center: true,
          // Enables touch navigation on devices with touch input
          touch: true,
          // Loop the coevoludens
          loop: false,
          // Change the coevoludens direction to be RTL
          rtl: false,
          // Randomizes the order of slides each time the coevoludens loads
          shuffle: false,
          // Turns fragments on and off globally
          fragments: true,
          // Flags if the coevoludens is running in an embedded mode,
          // i.e. contained within a limited portion of the screen
          embedded: true,
          // Flags if we should show a help overlay when the questionmark
          // key is pressed
          help: true,
          history: false,
          // Flags if speaker notes should be visible to all viewers
          showNotes: false,
          // Number of milliseconds between automatically proceeding to the
          // next slide, disabled when set to 0, this value can be overwritten
          // by using a data-autoslide attribute on your slides
          autoSlide: 0,
          // Stop auto-sliding after user input
          autoSlideStoppable: true,
          // Use this method for navigation when auto-sliding
          autoSlideMethod: Reveal.navigateNext,
          // Enable slide navigation via mouse wheel
          mouseWheel: true,
          // Hides the address bar on mobile devices
          hideAddressBar: true,
          // Opens links in an iframe preview overlay
          previewLinks: true,
          // Transition style
          transition: 'concave', // none/fade/slide/convex/concave/zoom
          // Transition speed
          transitionSpeed: 'default', // default/fast/slow
          // Transition style for full page slide backgrounds
          backgroundTransition: 'concave', // none/fade/slide/convex/concave/zoom
          // Number of slides away from the current that are visible
          viewDistance: 3,
          // Parallax background image
          parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"
          // Parallax background size
          parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"
          // Number of pixels to move the parallax background per slide
          // - Calculated automatically unless specified
          // - Set to 0 to disable movement along an axis
          parallaxBackgroundHorizontal: null,
          parallaxBackgroundVertical: null,

          // More info https://github.com/hakimel/reveal.js#dependencies
          dependencies: [
            { src: '../../dev_puzzles/coevoludens/lib/reveal.js/plugin/markdown/marked.js' },
            { src: '../../dev_puzzles/coevoludens/lib/reveal.js/plugin/markdown/markdown.js' },
            { src: '../../dev_puzzles/coevoludens/lib/reveal.js/plugin/notes/notes.js', async: true },
            { src: '../../dev_puzzles/coevoludens/lib/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
          ]
        });

        window.setTimeout(function(){
          Reveal.configure({
            keyboard: {
              // 13: 'next', // go to the next slide when the ENTER key is pressed
              // makes ESC to switch off coevoludens mode
              // we still have 'O' to se overlay mode
              27: this.hideCoevoludens.bind(this),
              // 32: null // don't do anything when SPACE is pressed (i.e. disable a reveal.js default binding)
            }
          });

          if(callback){
            window.setTimeout(callback, 500);
          }
        }.bind(this), 1500);

      }
    }

    // triggers coevoludens mode
    showCoevoludens(slideId?:number){
      if(typeof slideId !== 'number') slideId = 0;
      this.store.presenting = true;

      this.generateCoevoludens(function(){
        console.log("hiding id='container'");
        $('.main-content').css('display','none');
        $('.main-content').css('display','none');
        $('.coevoludens-display').css('display','block');
        $('body').addClass('reveal');
        console.log("Reveal-ing");

        Reveal.sync();

        Reveal.addEventListener( 'slidechanged', this.slideChangedEventListenerBinded);
        this.disableKeyboard();
        Reveal.slide(slideId);
      }.bind(this));
    }

    slideChangedEventListener( event ) {
        // event.previousSlide, event.currentSlide, event.indexh, event.indexv
        var presentingVkNode = this.getNodeFromSlidePosition(event.indexh);
        if(this.mapStructure){
          if(presentingVkNode && this.mapStructure.getSelectedNode() !== presentingVkNode){
            this.mapNodeSelected(presentingVkNode);
          }
        }
    }

    // returns indexh position
    getSlidePositionForSlideNode(positionedSlideNode):number{
      let slides = this.getSlides();
      let positionedSlideId = 0;
      // returns total cumulative position
      // var re = new RegExp('('+DATA_SEPARATOR_HORIZONTAL+'|'+DATA_SEPARATOR_VERTICAL+')', "g");
      // returns indexh position
      var re = new RegExp(DATA_SEPARATOR_HORIZONTAL, "g");

      for(let s=0; s<slides.length; s++){
        var slide=slides[s];
        if(slide === positionedSlideNode) break;

        positionedSlideId++;
        var contentType = slide.kNode.dataContent.propertyType;
        var content = slide.kNode.dataContent.property;
        if(contentType === 'text/markdown'){
          var count = (content.match(re) || []).length;
          positionedSlideId += count;
        }
      }
      return positionedSlideId;
    }

    // gets indexh as input
    getNodeFromSlidePosition(positionedSlideId){
      let slides = this.getSlides();
      // slide id of the node that is currently processed
      let processingSlideStartingSlideId = 0;
      // returns total cumulative position
      // var re = new RegExp('('+DATA_SEPARATOR_HORIZONTAL+'|'+DATA_SEPARATOR_VERTICAL+')', "g");
      // returns indexh position
      var re = new RegExp(DATA_SEPARATOR_HORIZONTAL, "g");

      for(let s=0; s<slides.length; s++){
        var slide=slides[s];

        processingSlideStartingSlideId++;
        var contentType = slide.kNode.dataContent.propertyType;
        var content = slide.kNode.dataContent.property;
        if(contentType === 'text/markdown'){
          var count = (content.match(re) || []).length;
          processingSlideStartingSlideId += count;
        }
        if(processingSlideStartingSlideId > positionedSlideId) break;
      }
      return slide;
    }


    showCoevoludensFromCurrentSlide(){
      let slideId = 0;
      if(this.mapStructure){
        let slideVkNode = this.mapStructure.getSelectedNode();
        slideId = this.getSlidePositionForSlideNode(slideVkNode);

      }

      this.showCoevoludens(slideId);
    }

    // switches off coevoludens mode
    hideCoevoludens(){
      this.store.presenting = false;
      $('.main-content').css('display','block');
      $('.coevoludens-display').css('display','none');
      $('body').removeClass('reveal');
      Reveal.removeEventListener('slidechanged', this.slideChangedEventListenerBinded);
      this.enableKeyboard();
    }
}
