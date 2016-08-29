import { Injectable, Inject } from '@angular/core';

import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

declare var d3:any;
declare var knalledge:any;
declare var hljs:any;
declare var Reveal:any;
declare var RevealMarkdown:any;

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

      this.initPresentation();
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

    generatePresentationHolder(callback){
      // $('#presentation').remove();
      // var presentation = $("<div id='presentation'></div>")
      // $('body').append(presentation);

      var presentation = $('#presentation');
      // $('#presentation .slides').remove();
      // var slides = $("<div class='slides'></div>");
      // $('#presentation').append(slides);
      // presentation.append(slides);
      var slides = $('#presentation .slides');
      slides.empty();

      if(callback){
        window.setTimeout(function(){
          callback(slides);
        }, 500);
      }
    }

    _generatePresentationSlidesDemo(slides, callback){
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

    generatePresentationSlides(slidesDom, callback){
      var slides = this.getSlides();

      for(var sI=0; sI<slides.length; sI++){
        var slide = slides[sI];

        // slide 1
        var section = $("<section></section>");
        slidesDom.append(section);
        section.attr('data-markdown', '');
        section.attr('data-separator-vertical', '--vertical--');

        var script = $("<script></script>");
        section.append(script);
        script.attr('type', 'text/template');

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

    generatePresentation(callback){
      this.generatePresentationHolder(function(slides){
        this.generatePresentationSlides(slides, function(){
          this.updateReveal(function(){
            if(callback) callback();
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }

    initPresentation(callback?){
      $('#presentation').remove();
      var presentation = $("<div class='reveal' id='presentation' style='display: none;'></div>")
      $('body').append(presentation);

      var slides = $("<div class='slides'></div>");
      presentation.append(slides);

      window.setTimeout(startReveal.bind(this), 1500);

      function startReveal(){
        Reveal.initialize({
          // Display controls in the bottom right corner
          controls: true,
          // Display a presentation progress bar
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
          // Loop the presentation
          loop: false,
          // Change the presentation direction to be RTL
          rtl: false,
          // Randomizes the order of slides each time the presentation loads
          shuffle: false,
          // Turns fragments on and off globally
          fragments: true,
          // Flags if the presentation is running in an embedded mode,
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
            { src: '../../dev_puzzles/presentation/lib/reveal.js/plugin/markdown/marked.js' },
            { src: '../../dev_puzzles/presentation/lib/reveal.js/plugin/markdown/markdown.js' },
            { src: '../../dev_puzzles/presentation/lib/reveal.js/plugin/notes/notes.js', async: true },
            { src: '../../dev_puzzles/presentation/lib/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
          ]
        });

        window.setTimeout(function(){
          Reveal.configure({
            keyboard: {
              // 13: 'next', // go to the next slide when the ENTER key is pressed
              27: this.hidePresentation.bind(this),
              // 32: null // don't do anything when SPACE is pressed (i.e. disable a reveal.js default binding)
            }
          });

          if(callback){
            window.setTimeout(callback, 500);
          }
        }.bind(this), 1500);

      }
    }

    showPresentation(){
      this.generatePresentation(function(){
        console.log("hiding id='container'");
        $('#container').css('display','none');
        $('#presentation').css('display','block');
        console.log("Reveal-ing");

        Reveal.sync();
        Reveal.slide(0);
      }.bind(this));
    }

    hidePresentation(){
      $('#container').css('display','block');
      $('#presentation').css('display','none');
    }
}
