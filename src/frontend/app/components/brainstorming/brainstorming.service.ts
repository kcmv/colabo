import { Injectable, Inject } from '@angular/core';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
//import {CollaboPluginsService} from 'collabo';
import {Brainstorming, BrainstormingPhase, BrainstrormingDecorations} from './brainstorming';
import {Change, ChangeType, Domain, Event} from '../change/change';
import {CollaboGrammarService} from '../collaboPlugins/CollaboGrammarService';

declare var d3:any;
declare var knalledge;

@Injectable()
export class BrainstormingService {
  //public static MaxId: number = 0;
  //public id:number;
  plugins:any = {
      mapVisualizePlugins: {
          service: this,
          init: function init() {
              var that = this;
          },

          nodeHtmlEnter: function(nodeHtmlEnter){
              var service = this; // keeping reference on the service

              // .filter(function(d) { return d.kNode.dataContent && d.kNode.dataContent.image; })
              nodeHtmlEnter.append("div")
                  .attr("class", "brainstorming_decoration")
                  // .on("click", function(d){
                  //     d3.event.stopPropagation();
                  //     service.changeApproval(d);
                  //     // d3.select(this).remove();
                  //     // d3.select(this).style("display", "none");
                  // })
                  .html(function(d){
                    var label = "<i class='fa fa-user-secret' aria-hidden='true'></i>";
                    //var label = "<i class='fa fa-eye-slash' aria-hidden='true'></i>";
                    //var label = "<i class='fa fa-eye' aria-hidden='true'></i>";
                    return label;
                  });
          }.bind(this), // necessary for keeping reference on service

          nodeHtmlUpdate: function(nodeHtmlUpdate){
            var that = this;
              nodeHtmlUpdate.select(".brainstorming_decoration")
                  .style("display", function(d){
                      var display = "none";
                      // if((d.kNode.gardening && d.kNode.gardening.approval && d.kNode.gardening.approval.state)){
                      // 	display = "block";
                      // }
                      if(that.service.showDecoration(d)){
                        display = "block";
                      }
                      return display;
                  })
                  // .style("width", '2em')
                  // .style("height", '2em')
                  .html(function(d){
                    var label = "<i class='fa fa-user-secret' aria-hidden='true'></i>";
                    //var label = "<i class='fa fa-eye-slash' aria-hidden='true'></i>";
                    return label;
                  })
                  .style("opacity", 1e-6);

              var nodeHtmlUpdateTransition = nodeHtmlUpdate.select(".brainstorming_decoration").transition().delay(300).duration(500)
                  .style("opacity", 0.8);
          },

          nodeHtmlExit: function(nodeHtmlExit){
              nodeHtmlExit.select(".brainstorming_decoration")
                  .on("click", null);
          }
      }
  };

    brainstorming: Brainstorming = new Brainstorming();

    //brainstorming-panel-settings:
    public showOnlyBrainstorming: boolean = true;

    private brainstormingPluginInfo: any;
    private knAllEdgeRealTimeService: any;
    private showSubComponentInBottomPanelEvent: string = "showSubComponentInBottomPanelEvent";
    private hideBottomPanelEvent: string = "hideBottomPanelEvent";

    private initiated:boolean = false;
    private rimaService:any = null;

    /**
     * Service constructor
     * @constructor
     */
    constructor(
        @Inject('$injector') private $injector,
        //  @Inject('RimaService') private rimaService,
        // @Inject('KnalledgeMapVOsService') private knalledgeMapVOsService,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray,
        @Inject('KnalledgeMapPolicyService') private knalledgeMapPolicyService: KnalledgeMapPolicyService,
        @Inject('CollaboPluginsService') private collaboPluginsService,
        private collaboGrammarService : CollaboGrammarService
        ) {
        let that = this;
        //this._id = ++BrainstormingService.MaxId;
        globalEmitterServicesArray.register(this.showSubComponentInBottomPanelEvent);

        this.knAllEdgeRealTimeService = this.$injector.get('KnAllEdgeRealTimeService');
        let requestPluginOptions: any = {
            name: "RequestService",
            events: {
            }
        };
        if (this.knAllEdgeRealTimeService) {
            requestPluginOptions.events[Event.BRAINSTORMING_CHANGED] = this.receivedBrainstormingChange.bind(this);
            this.knAllEdgeRealTimeService.registerPlugin(requestPluginOptions);
        }

        //this.collaboPluginsService = this.$injector.get('CollaboPluginsService');
        this.brainstormingPluginInfo = {
            name: "brainstorming",
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
                        update: null,
                        nodeSelected: null
                    },
                    $resolved: false,
                    callback: null,
                    $promise: null
                },
                mapInteraction: {
                    items: {
                        addNode: null,
                        updateNodeDecoration: null
                    },
                    $resolved: false,
                    callback: null,
                    $promise: null
                },
                ontov: {
                    items: {
                        setSearch: null,
                        getSearch: null
                    },
                    $resolved: false,
                    callback: null,
                    $promise: null
              }
            }
        };

        // this.brainstormingPluginInfo.references.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        this.brainstormingPluginInfo.references.map.callback = function() {
            that.brainstormingPluginInfo.references.map.$resolved = true;
            // resolve(that.brainstormingPluginInfo.references.map);
            // reject('not allowed');
        };
        // });
        //
        // this.brainstormingPluginInfo.apis.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        this.brainstormingPluginInfo.apis.map.callback = function() {
            that.brainstormingPluginInfo.apis.map.$resolved = true;
            // resolve(that.brainstormingPluginInfo.apis.map);
            // reject('not allowed');
        };
        // });
        //

        this.brainstormingPluginInfo.apis.ontov.callback = function() {
            that.brainstormingPluginInfo.apis.ontov.$resolved = true;

            /*
            // this is an example:
            that.brainstormingPluginInfo.apis.ontov.items.setSearch([
              // If you put more than one it will be OR (union)
              // AND is not supported (if we need it we need to talk :) )
              // {
              //   category: 'Type',
              //   value: 'type_ibis_question'
              // }

              // for some reason this doesn't filter
              // {
              //   category: 'iAmId',
              //   value: '556760847125996dc1a4a241'
              // }

              // {
              //   category: 'Tree',
              //   value: 'Ideological model' // node name
              // }
              //



            ]);
            */
        };

        this.collaboPluginsService.registerPlugin(this.brainstormingPluginInfo);
    }

    init(){
      if(!this.initiated){
        this.initiated = true;
        this.rimaService = this.$injector.get('RimaService');
      }
    }

    restart(){
      let question = this.brainstorming.question;
      this.brainstorming.reset();
      this.brainstorming.question = question;
    }

    filterOntov(searchObj) {
      if(this.brainstormingPluginInfo.apis.ontov.items.setSearch){
        this.brainstormingPluginInfo.apis.ontov.items.setSearch(searchObj);
      }
    }


    amIPresenter(): boolean {
      return this.knalledgeMapPolicyService.get().config.broadcasting.enabled;
    }

    checkAndSetupQuestion(): boolean {
      if (!this.brainstormingPluginInfo.references.map.$resolved) return false;

      var node = this.brainstormingPluginInfo.references.map.items.mapStructure.getSelectedNode();
      if(!node) {return false;}
      this.brainstorming.question = node;
      return (this.brainstorming.question.kNode.type === knalledge.KNode.TYPE_IBIS_QUESTION);
    }

    showDecoration(node: any): boolean {
      return this.isPrivateNode(node)
      && this.brainstorming && (this.brainstorming.phase === BrainstormingPhase.IDEAS_GENERATION ||
      this.brainstorming.phase === BrainstormingPhase.SHARING_IDEAS);
    }

    isPrivateNode(node: any): boolean {
        return node.kNode.decorations && node.kNode.decorations.brainstorming === BrainstrormingDecorations.PRIVATE_BRAINSTORMING;
    }

    sendBrainstorming(callback: Function) {

        // this.brainstorming.mapId = this.knalledgeMapVOsService.getMapId();
        // this.brainstorming.who = this.rimaService.getWhoAmI()._id;
        console.log(this.brainstorming);

        if (this.knAllEdgeRealTimeService) {
            let change = new Change();
            change.value = this.brainstorming.toServerCopy();
            change.reference = this.brainstorming.question.kNode._id;
            change.type = ChangeType.BEHAVIORAL;
            change.domain = Domain.GLOBAL;
            change.event = Event.BRAINSTORMING_CHANGED;
            this.knAllEdgeRealTimeService.emit(change.event, change);
            callback(true);
        } else {
            callback(false, 'SERVICE_UNAVAILABLE');
        }
    }

    public setUpBrainstormingChange(){
      this.collaboGrammarService.puzzles.brainstorming.state = this.brainstorming;
      if(this.brainstorming.phase === BrainstormingPhase.INACTIVE){
        this.collaboGrammarService.puzzles.brainstorming.state = null;
        //TODO: should we de-inject brainstormingPanel part from the Panel?
        this.globalEmitterServicesArray.get(this.hideBottomPanelEvent)
        .broadcast('KnalledgeMapTools', 'brainstorming.BrainstormingPanelComponent');
      }else{
        this.globalEmitterServicesArray.get(this.showSubComponentInBottomPanelEvent)
        .broadcast('KnalledgeMapTools', 'brainstorming.BrainstormingPanelComponent');
      }
      if(this.brainstorming.phase === BrainstormingPhase.SHARING_IDEAS && this.knalledgeMapPolicyService.get().config.session &&
      this.knalledgeMapPolicyService.get().config.session.presenter){ //filter to presenter's ideas who shares them
        this.filterOntov([
          {
            category: 'iAmId',
            value: this.knalledgeMapPolicyService.get().config.session.presenter._id
          }
        ]);
      }
      this.brainstormingPluginInfo.apis.map.items.update();
    }

    finishBrainstorming(){
      this.brainstorming.phase = BrainstormingPhase.INACTIVE;
      this.setUpBrainstormingChange();
    }

    focusToQuestion(){
      //console.log("brainstormingService.focusToQuestion()");
      if(this.brainstorming.question && this.brainstormingPluginInfo.references.map.$resolved){
        this.brainstormingPluginInfo.apis.map.items.nodeSelected(this.brainstorming.question);
        this.brainstormingPluginInfo.apis.map.items.update();
      }
    }

    addNewIdea(){
      console.log("brainstormingService.addNewIdea()");
      this.focusToQuestion();
      this.brainstormingPluginInfo.apis.mapInteraction.items.addNode(this.brainstorming.question);
    }

    presentNextIdea() {
      var ideas: any[] = this.brainstormingPluginInfo.references.map.items.mapStructure.getChildrenNodes(this.brainstorming.question);
      for(var i:number = 0; i < ideas.length; i++){
        var idea = ideas[i];
        if(this.brainstormingPluginInfo.references.map.items.mapStructure.isNodeOfActiveUser(idea) && this.isPrivateNode(idea)){
          console.log(idea.kNode.type,idea.kNode.iAmId);
          this.brainstormingPluginInfo.apis.mapInteraction.items.updateNodeDecoration(idea,'brainstorming');
          this.brainstormingPluginInfo.apis.map.items.nodeSelected(idea);
          //delete idea.kNode.decorations.brainstorming;

          // this.brainstormingPluginInfo.references.map.items.mapStructure.
          // updateNode(node, knalledge.MapStructure.UPDATE_NODE_VISUAL_OPEN, idea);
          break;
        }
      }
    }

    private processReferencesInBrainStorming(brainstorming:Brainstorming): Brainstorming{
      if(typeof brainstorming.question === 'string'){
        brainstorming.question = this.brainstormingPluginInfo.references.map.items.mapStructure.getVKNodeByKId(brainstorming.question);
      }
      return brainstorming;
    }

    private receivedBrainstormingChange(event: string, change: Change) {
        let receivedBrainstorming: Brainstorming = Brainstorming.factory(change.value);
        console.warn("[receivedBrainstormingChange]receivedBrainstorming: ", receivedBrainstorming);
        this.brainstorming = receivedBrainstorming;
        if(this.brainstorming.question && this.brainstormingPluginInfo.references.map.$resolved){
          this.brainstorming = this.processReferencesInBrainStorming(this.brainstorming);
          this.brainstormingPluginInfo.apis.map.items.nodeSelected(this.brainstorming.question);
          this.brainstormingPluginInfo.apis.map.items.update();
          // this.brainstormingPluginInfo.references.map.items.mapStructure.setSelectedNode(this.brainstorming.question);
          // this.brainstormingPluginInfo.apis.map.items.update();
        }
        this.setUpBrainstormingChange();
    }

};
