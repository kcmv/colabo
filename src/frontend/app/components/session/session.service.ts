import { Injectable, Inject } from '@angular/core';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
//import {CollaboPluginsService} from 'collabo';
import {Session, SessionPhase, State} from './session';
import {Change, ChangeType, Domain, Event} from '../change/change';
import {ChangeService} from '../change/change.service';

import { Http, HTTP_PROVIDERS, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import {Participant} from './participant';

declare var d3:any;
declare var knalledge;

@Injectable()
export class SessionService {
  //public static MaxId: number = 0;
  //public id:number;

  // plugins:any = {
  //     mapVisualizePlugins: {
  //         service: this,
  //         init: function init() {
  //             var that = this;
  //         },
  //
  //         nodeHtmlEnter: function(nodeHtmlEnter){
  //             var service = this; // keeping reference on the service
  //
  //             // .filter(function(d) { return d.kNode.dataContent && d.kNode.dataContent.image; })
  //             nodeHtmlEnter.append("div")
  //                 .attr("class", "session_decoration")
  //                 // .on("click", function(d){
  //                 //     d3.event.stopPropagation();
  //                 //     service.changeApproval(d);
  //                 //     // d3.select(this).remove();
  //                 //     // d3.select(this).style("display", "none");
  //                 // })
  //                 .html(function(d){
  //                   var label = "<i class='fa fa-user-secret' aria-hidden='true'></i>";
  //                   //var label = "<i class='fa fa-eye-slash' aria-hidden='true'></i>";
  //                   //var label = "<i class='fa fa-eye' aria-hidden='true'></i>";
  //                   return label;
  //                 });
  //         }.bind(this), // necessary for keeping reference on service
  //
  //         nodeHtmlUpdate: function(nodeHtmlUpdate){
  //           var that = this;
  //             nodeHtmlUpdate.select(".session_decoration")
  //                 .style("display", function(d){
  //                     var display = "none";
  //                     // if((d.kNode.gardening && d.kNode.gardening.approval && d.kNode.gardening.approval.state)){
  //                     // 	display = "block";
  //                     // }
  //                     if(that.service.showDecoration(d)){
  //                       display = "block";
  //                     }
  //                     return display;
  //                 })
  //                 // .style("width", '2em')
  //                 // .style("height", '2em')
  //                 .html(function(d){
  //                   var label = "<i class='fa fa-user-secret' aria-hidden='true'></i>";
  //                   //var label = "<i class='fa fa-eye-slash' aria-hidden='true'></i>";
  //                   return label;
  //                 })
  //                 .style("opacity", 1e-6);
  //
  //             var nodeHtmlUpdateTransition = nodeHtmlUpdate.select(".session_decoration").transition().delay(300).duration(500)
  //                 .style("opacity", 0.8);
  //         },
  //
  //         nodeHtmlExit: function(nodeHtmlExit){
  //             nodeHtmlExit.select(".session_decoration")
  //                 .on("click", null);
  //         }
  //     }
  // };

    session: Session = null;
    isSessionCreated: boolean = false;

    //session-panel-settings:
    public showOnlySession: boolean = true;
    private meParticipant:Participant = new Participant();

    private sessionPluginInfo: any;
    private knAllEdgeRealTimeService: any;
    private showSubComponentInBottomPanelEvent: string = "showSubComponentInBottomPanelEvent";

    private initiated:boolean = false;
    private rimaService:any = null;
    private mapVOsService:any = null;
    private apiUrl: string = ""; // "http://127.0.0.1:8888/dbAudits/";


    /**
     * Service constructor
     * @constructor
     */
    constructor(
        @Inject('$injector') private $injector,
        //  @Inject('RimaService') private rimaService,
        @Inject('KnalledgeMapVOsService') private knalledgeMapVOsService,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray,
        @Inject('KnalledgeMapPolicyService') private knalledgeMapPolicyService: KnalledgeMapPolicyService,
        @Inject('CollaboPluginsService') private collaboPluginsService,
        @Inject('ENV') private ENV,
        private http: Http,
        private changeService: ChangeService
        ) {
        let that = this;
        //this.id = ++SessionService.MaxId;
        this.apiUrl = this.ENV.server.backend + "/session/";
        globalEmitterServicesArray.register(this.showSubComponentInBottomPanelEvent);

        this.knAllEdgeRealTimeService = this.$injector.get('KnAllEdgeRealTimeService');
        let requestPluginOptions: any = {
            name: "RequestService",
            events: {
            }
        };
        if (this.knAllEdgeRealTimeService) {
            requestPluginOptions.events[Event.SESSION_CHANGED] = this.receivedSessionChange.bind(this);
            requestPluginOptions.events[Event.SESSION_CREATED] = this.receivedSessionChange.bind(this);
            this.knAllEdgeRealTimeService.registerPlugin(requestPluginOptions);
        }

        this.session = new Session();


        //this.collaboPluginsService = this.$injector.get('CollaboPluginsService');
        // this.sessionPluginInfo = {
        //     name: "session",
        //     components: {
        //
        //     },
        //     references: {
        //         mapVOsService: {
        //             items: {
        //                 nodesById: {},
        //                 edgesById: {},
        //             },
        //             $resolved: false,
        //             callback: null,
        //             $promise: null
        //         },
        //         map: {
        //             items: {
        //                 mapStructure: {
        //                     nodesById: {},
        //                     edgesById: {}
        //                 }
        //             },
        //             $resolved: false,
        //             callback: null,
        //             $promise: null
        //         }
        //     },
        //     apis: {
        //         map: {
        //             items: {
        //                 update: null,
        //                 nodeSelected: null
        //             },
        //             $resolved: false,
        //             callback: null,
        //             $promise: null
        //         },
        //         mapInteraction: {
        //             items: {
        //                 addNode: null
        //             },
        //             $resolved: false,
        //             callback: null,
        //             $promise: null
        //         }
        //     }
        // };
        //
        // // this.sessionPluginInfo.references.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        // this.sessionPluginInfo.references.map.callback = function() {
        //     that.sessionPluginInfo.references.map.$resolved = true;
        //     // resolve(that.sessionPluginInfo.references.map);
        //     // reject('not allowed');
        // };
        // // });
        // //
        // // this.sessionPluginInfo.apis.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        // this.sessionPluginInfo.apis.map.callback = function() {
        //     that.sessionPluginInfo.apis.map.$resolved = true;
        //     // resolve(that.sessionPluginInfo.apis.map);
        //     // reject('not allowed');
        // };
        // // });
        // //
        //
        // this.collaboPluginsService.registerPlugin(this.sessionPluginInfo);
    }

    setSession(): void{
      this.session.creator = this.meParticipant;
      if(this.meParticipant && this.meParticipant.whoAmI){
        this.session.participants[this.meParticipant.whoAmI._id] = this.meParticipant;
      }else{
        this.session.participants[Participant.NON_LOGGED_IN] = Participant.NON_LOGGED_IN;
      }
      let map: any = this.mapVOsService.getMap();
      if(map.state !== knalledge.KMap.STATE_SYNCED){
        console.warn("map.state !== knalledge.KMap.STATE_SYNCED", map, JSON.stringify(map));
        // if(map.$resolved){
        //   this.session.mapId =
        // }
      }
    }

    init(){
      if(!this.initiated){
        this.initiated = true;
        this.rimaService = this.$injector.get('RimaService');
        this.mapVOsService = this.$injector.get('KnalledgeMapVOsService');
        this.meParticipant.whoAmI = this.rimaService.getWhoAmI();
        this.setSession();
      }
    }

    restart(){
      this.session.reset();
      this.setSession();
    }

    create(session:Session, callback?: Function): void{
        this.post(session.toServerCopy())
            .subscribe(
        sessionFromServer => this.sessionCreated(sessionFromServer, callback),
        error => console.error("error: " +
            JSON.stringify(error))
        );
      ;
    }

    sendSession(callback: Function) {

        // this.session.mapId = this.knalledgeMapVOsService.getMapId();
        // this.session.who = this.rimaService.getWhoAmI()._id;
        console.log(this.session);

        if (this.knAllEdgeRealTimeService) {
            let change = new Change();
            change.value = this.session.toServerCopy();
            //change.reference = this.session.question.kNode._id;
            change.type = ChangeType.BEHAVIORAL;
            change.domain = Domain.GLOBAL;
            change.event = this.isSessionCreated ? Event.SESSION_CREATED : Event.SESSION_CHANGED;
            this.knAllEdgeRealTimeService.emit(change.event, change);
            callback(true);
        } else {
            callback(false, 'SERVICE_UNAVAILABLE');
        }
        if(!this.isSessionCreated){
          this.create(this.session);
        }
    }

    public setUpSessionChange(){

      //this.collaboGrammarService.puzzles.session.state = this.session;
      // if(this.session.phase === SessionPhase.INACTIVE){
      //   this.collaboGrammarService.puzzles.session.state = null;
      //   //TODO: hide session Panel or de-inject sessionPanel part from the Panel
      // }else{
      //   this.globalEmitterServicesArray.get(this.showSubComponentInBottomPanelEvent)
      //   .broadcast('KnalledgeMapTools', 'session.SessionPanelComponent');
      // }
    }

    finishSession(){
      this.session.phase = SessionPhase.INACTIVE;
      this.setUpSessionChange();
    }

    private processReferencesInSession(session:Session): Session{
      //TODO:
      // if(typeof session.question === 'string'){
      //   session.question = this.sessionPluginInfo.references.map.items.mapStructure.getVKNodeByKId(session.question);
      // }
      return session;
    }

    private receivedSessionChange(event: string, change: Change) {
        let receivedSession: Session = Session.factory(change.value);
        console.warn("[receivedSessionChange]receivedSession: ", receivedSession);
        this.session = receivedSession;
        // if(this.session.question && this.sessionPluginInfo.references.map.$resolved){
        //   this.session = this.processReferencesInSession(this.session);
        //   this.sessionPluginInfo.apis.map.items.nodeSelected(this.session.question);
        //   this.sessionPluginInfo.apis.map.items.update();
        //   // this.sessionPluginInfo.references.map.items.mapStructure.setSelectedNode(this.session.question);
        //   // this.sessionPluginInfo.apis.map.items.update();
        // }
        this.setUpSessionChange();
    }

    private post(session: Session): Observable<Session> {
        //let body = JSON.stringify(session);
        let body = angular.toJson(session);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.apiUrl, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        //console.error(errMsg); // log to console instead
        this.changeService.logActionLost({'SessionsService' : error, 'errMsg:' : errMsg});
        return Observable.throw(errMsg);
    }

    private processSessionFromServer(sessionFromServer: any): Session {
      var session:Session = Session.factory(sessionFromServer);
      session.state = State.SYNCED;
      //TODO: session = this.processReferences(session);
      return session;
    }

    private sessionCreated(sessionFromServer, callback?: Function):void{
      this.isSessionCreated=true;
      var session:Session = this.processSessionFromServer(sessionFromServer);
      //this.sessions.push(session);
      if(typeof callback === 'function'){callback(session);}
    }

};
