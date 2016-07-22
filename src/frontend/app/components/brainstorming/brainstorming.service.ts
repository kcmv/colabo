import { Injectable, Inject } from '@angular/core';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
//import {CollaboPluginsService} from 'collabo';
import {Brainstorming, BrainstormingPhase} from './brainstorming';
import {Change, ChangeType, Domain, Event} from '../change/change';
import {CollaboGrammarService} from '../collaboPlugins/CollaboGrammarService';

declare var d3:any;
declare var knalledge;

@Injectable()
export class BrainstormingService {
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
                  .attr("class", "gardening_approval")
                  .on("click", function(d){
                      d3.event.stopPropagation();
                      service.changeApproval(d);
                      // d3.select(this).remove();
                      // d3.select(this).style("display", "none");
                  })
                  .html(function(d){
                      var label = 'X';//NodeGardened.getApprovalLabel(d.kNode);
                      return label;
                  });
          }.bind(this), // necessary for keeping reference on service

          nodeHtmlUpdate: function(nodeHtmlUpdate){
            var that = this;
              nodeHtmlUpdate.select(".gardening_approval")
                  .style("display", function(d){
                      var display = "none";
                      // if((d.kNode.gardening && d.kNode.gardening.approval && d.kNode.gardening.approval.state)){
                      // 	display = "block";
                      // }
                      if(true){//that.service.interfaceConfig.showInterface){
                        display = "block";
                      }
                      return display;
                  })
                  // .style("width", '2em')
                  // .style("height", '2em')
                  .html(function(d){
                      var label = "X";//NodeGardened.getApprovalLabel(d.kNode);
                      return label;
                  })
                  .style("opacity", 1e-6);

              var nodeHtmlUpdateTransition = nodeHtmlUpdate.select(".gardening_approval").transition().delay(300).duration(500)
                  .style("opacity", 0.8);
          },

          nodeHtmlExit: function(nodeHtmlExit){
              nodeHtmlExit.select(".gardening_approval")
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

        this.collaboPluginsService.registerPlugin(this.brainstormingPluginInfo);
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
        //TODO: hide brainstorming Panel or de-inject brainstormingPanel part from the Panel
      }else{
        this.globalEmitterServicesArray.get(this.showSubComponentInBottomPanelEvent)
        .broadcast('KnalledgeMapTools', 'brainstorming.BrainstormingPanelComponent');
      }
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
