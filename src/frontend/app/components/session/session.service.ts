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

const SESSION_BROADCASTING_FREQUENCY:number = 1500; //ms set to 0 to stop it
const PARITICIPANT_BROADCASTING_FREQUENCY:number = 1500; //ms set to 0 to stop it

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
    private PRESENTER_CHANGED: string = "PRESENTER_CHANGED";
    private REQUEST_TO_CHANGE_SESSION_PARAMETER: string = "REQUEST_TO_CHANGE_SESSION_PARAMETER";

    private initiated:boolean = false;
    private rimaService:any = null;
    private mapVOsService:any = null;
    private apiUrl: string = ""; // "http://127.0.0.1:8888/dbAudits/";
    private broadcastingIntervalId;
    private participantbroadcastingIntervalId;

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
        this.globalEmitterServicesArray.register(this.showSubComponentInBottomPanelEvent);
        this.globalEmitterServicesArray.register(this.PRESENTER_CHANGED);
        this.globalEmitterServicesArray.get(this.PRESENTER_CHANGED).subscribe('SessionService', this.presenterChanged.bind(this));

        this.globalEmitterServicesArray.register(this.REQUEST_TO_CHANGE_SESSION_PARAMETER);
        this.globalEmitterServicesArray.get(this.REQUEST_TO_CHANGE_SESSION_PARAMETER).
        subscribe('SessionService', this.changeParameter.bind(this));


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

        let map: any = this.mapVOsService.getMap();
        if(map.state !== knalledge.KMap.STATE_SYNCED){
          console.warn("map.state !== knalledge.KMap.STATE_SYNCED", map, JSON.stringify(map));
          // if(map.$resolved){
          //   this.session.mapId =
          // }
        }
      }else{
        window.alert("you have to be logged in to set up a session");
        return;
        //this.session.participants[Participant.NON_LOGGED_IN] = Participant.NON_LOGGED_IN;
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

    changeParameter(change:any):void{
      switch(change.parameter){
        case 'mustFollowPresenter':
        this.session.mustFollowPresenter = change.value;
        break;
      }
      this.setUpSessionChange();
      this.sendSession();
    }

    presenterChanged(presenterVO: any): void{
      if(presenterVO && presenterVO.source && presenterVO.source === 'receivedSessionChange'){
        return; //presenterChanged is bound to globalEmitterServicesArray.PRESENTER_CHANGED event sent both by receivedSessionChange and ...
        // UI that changes presenter. for UI change it should broadcast change to other, but for receivedSessionChange, ...
        // it shouldn't do anything
      }
      if(presenterVO){
        var newPresenter: knalledge.WhoAmI = presenterVO.user ? this.rimaService.getUserById(presenterVO.user) :
        this.rimaService.getWhoAmI();
        if(newPresenter._id === this.rimaService.getWhoAmIid()){
            this.knalledgeMapPolicyService.get().config.broadcasting.enabled = presenterVO.value;
        }else{
            this.knalledgeMapPolicyService.get().config.broadcasting.enabled = false;
        }
        if(newPresenter){
          if(this.session && !(this.session.phase === SessionPhase.FINISHED || this.session.phase === SessionPhase.INACTIVE) ){

            if(presenterVO.value){ // (!this.session.presenter || this.session.presenter._id !== userId)
              this.session.presenter = newPresenter;
            }else{
              this.session.presenter = null;
            }
          }else{
            window.alert("You have to create a session before changing presenter");
          }
        }
      }
      this.setUpSessionChange();
      this.sendSession();
    }

    sendSession(callback?: Function) {
      if(this.broadcastingIntervalId && (this.session.phase === SessionPhase.FINISHED || this.session.phase === SessionPhase.INACTIVE)){
        clearInterval(this.broadcastingIntervalId);
      }
        // this.session.mapId = this.knalledgeMapVOsService.getMapId();
        // this.session.who = this.rimaService.getWhoAmI()._id;
        console.log(this.session);
        var that = this;
        var rtSend = function(session:Session):void{
          if (that.knAllEdgeRealTimeService) {
            let change = new Change();
            change.value = session.toServerCopy();
            //change.reference = session.question.kNode._id;
            change.type = ChangeType.BEHAVIORAL;
            change.domain = Domain.GLOBAL;
            change.event = that.isSessionCreated ? Event.SESSION_CREATED : Event.SESSION_CHANGED;
            that.knAllEdgeRealTimeService.emit(change.event, change);

            if(window.localStorage){
    					window.localStorage['session'] = JSON.stringify(session);
              console.log("sendSession:: window.localStorage['session']",window.localStorage['session']);
            }
            if(typeof callback === 'function'){callback(true);;}
          } else {
            if(typeof callback === 'function'){callback(false, 'SERVICE_UNAVAILABLE');}
          }
        };


        if(!this.isSessionCreated){
          this.create(this.session, rtSend);
        }else{
          rtSend(this.session);
        }
    }

    get iAmPresenter(): boolean{
      return this.knalledgeMapPolicyService.get().config.broadcasting.enabled;
      //could be done like this too: this.session.presenter._id === this.rimaService.getWhoAmIid()
    }

    public setUpSessionChange(){
      if(this.session.mustFollowPresenter && !this.iAmPresenter){
        this.knalledgeMapPolicyService.get().config.broadcasting.receiveNavigation = true;
      }
      this.knalledgeMapPolicyService.get().config.session = this.session; //used for easy access from KnalledgeMap (e.g main.ts)
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
      if(typeof session.creator === "string"){
        session.creator = this.rimaService.getUserById(session.creator);
      }

      if(typeof session.presenter === "string"){
        session.presenter = this.rimaService.getUserById(session.presenter);
      }
      //TODO:
      // if(typeof session.question === 'string'){
      //   session.question = this.sessionPluginInfo.references.map.items.mapStructure.getVKNodeByKId(session.question);
      // }
      return session;
    }

    private enteredSession() :void{
      this.meParticipant = new Participant();
      //TODO: suppport not logged_in_users
      this.meParticipant.whoAmI = this.rimaService.getWhoAmI();

      if(SESSION_BROADCASTING_FREQUENCY !== 0){
        this.participantbroadcastingIntervalId = setInterval(this.sendParticipant.bind(this), PARITICIPANT_BROADCASTING_FREQUENCY);
      }
    }

    private exitedSession(): void{
      clearInterval(this.participantbroadcastingIntervalId);
    }

    private sendParticipant():void{

    }

    private receivedSessionChange(event: string, change: Change) {
      //TODO: take care that logged out users can be session participants ot to be warned

      let receivedSession: Session = Session.factory(change.value);
      //console.warn("[receivedSessionChange]receivedSession: ", receivedSession);
      if(receivedSession._id !== this.session._id){
        window.alert("You are added to the session '" + receivedSession.name + "'");
      }

      this.session = this.processReferencesInSession(receivedSession);

      if(this.session.presenter){
        //we broadcast it so that other puzzles are notified about it, e.g. BrainstormingService adjust its presentation to it
        this.globalEmitterServicesArray.get(this.PRESENTER_CHANGED)
        .broadcast('SessionService', {'user': this.session.presenter._id, 'value': true, 'source':'receivedSessionChange'});

        if(this.session.presenter._id !== this.rimaService.getWhoAmIid()){
          if(this.knalledgeMapPolicyService.get().config.broadcasting.enabled){
            window.alert("You are not presenter any more");
          }
          this.knalledgeMapPolicyService.get().config.broadcasting.enabled = false;
        }else{
          if(!this.knalledgeMapPolicyService.get().config.broadcasting.enabled){
            window.alert("You have become presenter");
          }
          this.knalledgeMapPolicyService.get().config.broadcasting.enabled = true;
        }
      }
      // if(this.session.question && this.sessionPluginInfo.references.map.$resolved){
      //   this.session = this.processReferencesInSession(this.session);
      //   this.sessionPluginInfo.apis.map.items.nodeSelected(this.session.question);
      //   this.sessionPluginInfo.apis.map.items.update();
      //   // this.sessionPluginInfo.references.map.items.mapStructure.setSelectedNode(this.session.question);
      //   // this.sessionPluginInfo.apis.map.items.update();
      // }
      this.setUpSessionChange();
      this.enteredSession();
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

    // private processSessionFromServer(sessionFromServer: any): Session {
    //   var session:Session = Session.factory(sessionFromServer);
    //   session.state = State.SYNCED;
    //   //TODO: session = this.processReferences(session);
    //   return session;
    // }

    private sessionCreated(sessionFromServer, callback?: Function):void{
      if(SESSION_BROADCASTING_FREQUENCY !== 0){
        this.broadcastingIntervalId = setInterval(this.sendSession.bind(this), SESSION_BROADCASTING_FREQUENCY);
      }
      this.isSessionCreated=true;
      this.session.overrideFromServer(sessionFromServer);

      //this.sessions.push(session);
      if(typeof callback === 'function'){callback(this.session);}
    }

};
