import { Injectable, Inject } from '@angular/core';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
//import {CollaboPluginsService} from 'collabo';
import {Session, SessionPhase} from './session';
import {Change, ChangeType, Domain, Event} from '../change/change';
import {CollaboGrammarService} from '../collaboPlugins/CollaboGrammarService';

declare var d3:any;
declare var knalledge;

@Injectable()
export class SessionService {
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
                  .attr("class", "session_decoration")
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
              nodeHtmlUpdate.select(".session_decoration")
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

              var nodeHtmlUpdateTransition = nodeHtmlUpdate.select(".session_decoration").transition().delay(300).duration(500)
                  .style("opacity", 0.8);
          },

          nodeHtmlExit: function(nodeHtmlExit){
              nodeHtmlExit.select(".session_decoration")
                  .on("click", null);
          }
      }
  };

    session: Session = new Session();

    //session-panel-settings:
    public showOnlySession: boolean = true;

    private sessionPluginInfo: any;
    private knAllEdgeRealTimeService: any;
    private showSubComponentInBottomPanelEvent: string = "showSubComponentInBottomPanelEvent";

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
        //this.id = ++SessionService.MaxId;
        globalEmitterServicesArray.register(this.showSubComponentInBottomPanelEvent);

        this.knAllEdgeRealTimeService = this.$injector.get('KnAllEdgeRealTimeService');
        let requestPluginOptions: any = {
            name: "RequestService",
            events: {
            }
        };
        if (this.knAllEdgeRealTimeService) {
            requestPluginOptions.events[Event.SESSSION_CHANGED] = this.receivedSessionChange.bind(this);
            this.knAllEdgeRealTimeService.registerPlugin(requestPluginOptions);
        }

        //this.collaboPluginsService = this.$injector.get('CollaboPluginsService');
        this.sessionPluginInfo = {
            name: "session",
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
                        addNode: null
                    },
                    $resolved: false,
                    callback: null,
                    $promise: null
                }
            }
        };

        // this.sessionPluginInfo.references.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        this.sessionPluginInfo.references.map.callback = function() {
            that.sessionPluginInfo.references.map.$resolved = true;
            // resolve(that.sessionPluginInfo.references.map);
            // reject('not allowed');
        };
        // });
        //
        // this.sessionPluginInfo.apis.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        this.sessionPluginInfo.apis.map.callback = function() {
            that.sessionPluginInfo.apis.map.$resolved = true;
            // resolve(that.sessionPluginInfo.apis.map);
            // reject('not allowed');
        };
        // });
        //

        this.collaboPluginsService.registerPlugin(this.sessionPluginInfo);
    }

    init(){
      if(!this.initiated){
        this.initiated = true;
        this.rimaService = this.$injector.get('RimaService');
      }
    }

    restart(){
      let question = this.session.question;
      this.session.reset();
      this.session.question = question;
    }

    amIPresenter(): boolean {
      return this.knalledgeMapPolicyService.get().config.broadcasting.enabled;
    }

    checkAndSetupQuestion(): boolean {
      if (!this.sessionPluginInfo.references.map.$resolved) return false;

      var node = this.sessionPluginInfo.references.map.items.mapStructure.getSelectedNode();
      if(!node) {return false;}
      this.session.question = node;
      return (this.session.question.kNode.type === knalledge.KNode.TYPE_IBIS_QUESTION);
    }

    showDecoration(node: any): boolean {
      return this.isPrivateNode(node)
      && this.session && (this.session.phase === SessionPhase.IDEAS_GENERATION ||
      this.session.phase === SessionPhase.SHARING_IDEAS);
    }

    isPrivateNode(node: any): boolean {
        return node.kNode.decorations && node.kNode.decorations.session === BrainstrormingDecorations.PRIVATE_SESSSION;
    }

    sendSession(callback: Function) {

        // this.session.mapId = this.knalledgeMapVOsService.getMapId();
        // this.session.who = this.rimaService.getWhoAmI()._id;
        console.log(this.session);

        if (this.knAllEdgeRealTimeService) {
            let change = new Change();
            change.value = this.session.toServerCopy();
            change.reference = this.session.question.kNode._id;
            change.type = ChangeType.BEHAVIORAL;
            change.domain = Domain.GLOBAL;
            change.event = Event.SESSSION_CHANGED;
            this.knAllEdgeRealTimeService.emit(change.event, change);
            callback(true);
        } else {
            callback(false, 'SERVICE_UNAVAILABLE');
        }
    }

    public setUpSessionChange(){
      this.collaboGrammarService.puzzles.session.state = this.session;
      if(this.session.phase === SessionPhase.INACTIVE){
        this.collaboGrammarService.puzzles.session.state = null;
        //TODO: hide session Panel or de-inject sessionPanel part from the Panel
      }else{
        this.globalEmitterServicesArray.get(this.showSubComponentInBottomPanelEvent)
        .broadcast('KnalledgeMapTools', 'session.SessionPanelComponent');
      }
    }

    finishSession(){
      this.session.phase = SessionPhase.INACTIVE;
      this.setUpSessionChange();
    }

    focusToQuestion(){
      //console.log("sessionService.focusToQuestion()");
      if(this.session.question && this.sessionPluginInfo.references.map.$resolved){
        this.sessionPluginInfo.apis.map.items.nodeSelected(this.session.question);
        this.sessionPluginInfo.apis.map.items.update();
      }
    }

    addNewIdea(){
      console.log("sessionService.addNewIdea()");
      this.focusToQuestion();
      this.sessionPluginInfo.apis.mapInteraction.items.addNode(this.session.question);
    }

    presentNextIdea() {
      var ideas: any[] = this.sessionPluginInfo.references.map.items.mapStructure.getChildrenNodes(this.session.question);
      for(var i:number = 0; i < ideas.length; i++){
        var idea = ideas[i];
        if(this.sessionPluginInfo.references.map.items.mapStructure.isNodeOfActiveUser(idea) && this.isPrivateNode(idea)){
          console.log(idea.kNode.type,idea.kNode.iAmId);
          this.sessionPluginInfo.apis.map.items.nodeSelected(idea);
          delete idea.kNode.decorations.session;
          // this.sessionPluginInfo.references.map.items.mapStructure.
          // updateNode(node, knalledge.MapStructure.UPDATE_NODE_VISUAL_OPEN, idea);
          break;
        }
      }
    }

    private processReferencesInSession(session:Session): Session{
      if(typeof session.question === 'string'){
        session.question = this.sessionPluginInfo.references.map.items.mapStructure.getVKNodeByKId(session.question);
      }
      return session;
    }

    private receivedSessionChange(event: string, change: Change) {
        let receivedSession: Session = Session.factory(change.value);
        console.warn("[receivedSessionChange]receivedSession: ", receivedSession);
        this.session = receivedSession;
        if(this.session.question && this.sessionPluginInfo.references.map.$resolved){
          this.session = this.processReferencesInSession(this.session);
          this.sessionPluginInfo.apis.map.items.nodeSelected(this.session.question);
          this.sessionPluginInfo.apis.map.items.update();
          // this.sessionPluginInfo.references.map.items.mapStructure.setSelectedNode(this.session.question);
          // this.sessionPluginInfo.apis.map.items.update();
        }
        this.setUpSessionChange();
    }

};
