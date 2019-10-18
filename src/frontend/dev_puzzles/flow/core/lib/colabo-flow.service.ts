import { Router, NavigationStart } from "@angular/router";
import { filter } from "rxjs/operators";
// catchError, map,
import { startWith, map, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { ColaboFlowState, ColaboFlowStates } from "./colaboFlowState";
import { MyColaboFlowState, MyColaboFlowStates } from "./myColaboFlowState";
import { Observable, of } from "rxjs";
import { KnalledgeNodeService } from "@colabo-knalledge/f-store_core/knalledge-node.service";
import { KNode } from "@colabo-knalledge/f-core/code/knalledge/kNode";
import { VO } from "@colabo-knalledge/f-core/code/knalledge/VO";
import { RimaAAAService } from "@colabo-rima/f-aaa";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

import * as config from "@colabo-utils/i-config";

import {
  TopiChatClientsOrchestrationService,
  TopiChatClientsOrchestrationEvents,
  TopiChatClientsOrchestrationDefaultEvents,
  TopiChatClientsOrchestrationDefaultPayload,
  TopiChatPluginPackage,
  TopiChatPackage,
  ColaboPubSubPlugin
} from "@colabo-topichat/f-clients-orchestration";

export enum ColaboFlowEvents {
  ColaboFlowStateChange = "tc:colabo-flow-state-change"
}

@Injectable({
  providedIn: "root"
})
export class ColaboFlowService {
  static PARTS_TO_INITIATE: number = 2;
  private partsLeftToInitiate = ColaboFlowService.PARTS_TO_INITIATE;
  static mapId = config.GetGeneral("mapId");
  public static MY_COLABO_FLOW_STATE_TYPE: string = "colaboflow.my.state";
  public static COLABO_FLOW_STATE_TYPE: string = "colaboflow.state";
  protected keepMyStateInterval: any;

  private _colaboFlowState: ColaboFlowState;
  public get colaboFlowState(): ColaboFlowState {
    //when `myCfStateNode` is saved in Db, it gets injected in it
    return this._colaboFlowState;
  }
  public set colaboFlowState(value: ColaboFlowState) {
    this._colaboFlowState = value;
  }

  private _myColaboFlowState: MyColaboFlowState;
  public get myColaboFlowState(): MyColaboFlowState {
    //when `myCfStateNode` is saved in Db, it gets injected in it
    return this._myColaboFlowState;
  }
  public set myColaboFlowState(value: MyColaboFlowState) {
    this._myColaboFlowState = value;
  }

  protected areStatesInitiated: boolean;

  private myCfStateNode: KNode; //keeps `myColaboFlowState` and `colaboFlowState` among other parameters to be saved in the Database

  private colaboFlowStateNode: KNode = new KNode(); //without this compiler throws ERR error TS2339: Property 'dataContent' does not exist on type 'never'. for code: this.colaboFlowStateNode.dataContent = {};
  cFStateChangesObserver: any = {}; //Observer

  colaboFlowInitiatedObserver: any = {}; //Observer
  private initiated: boolean = false;

  navStart: Observable<NavigationStart>;

  constructor(
    private knalledgeNodeService: KnalledgeNodeService,
    protected rimaAAAService: RimaAAAService,
    private topiChatCOrchestrationService: TopiChatClientsOrchestrationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.colaboFlowState = new ColaboFlowState();
    this.myColaboFlowState = new MyColaboFlowState();
    console.log(
      "[ColaboFlowService::constructor] this.router.url",
      this.router.url,
      "route.url",
      this.route.url,
      "state.path",
      this.route.snapshot.url
    );

    // const url: Observable<string> = route.url.pipe(
    //   map(segments => segments.join(""))
    // );
    // url.subscribe((url: string) => {
    // console.log("[ColaboFlowService::constructor] url:", url);
    // let navInit: NavigationStart = new NavigationStart(
    //   1,
    //   "/INIT",
    //   "imperative"
    // );
    this.navStart = router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
      // startWith(navInit) //starting with home page, to start KeepingMyState before the first navigation happens
    ) as Observable<NavigationStart>;
    this.navStart.subscribe(evt => {
      console.log("Navigation Started:", evt);
      this.startKeepingMyState(evt.url);
    });
    // });
    // console.log("[ColaboFlowService::constructor] route", route);
    // router.events.subscribe(evt => {
    //   console.log("navigation event", evt);
    //   if (evt instanceof NavigationStart) {
    //     console.log("Navigation Started:", evt);
    //     this.startKeepingMyState(
    //       evt.url.indexOf("/") === 0 ? evt.url.substring(1) : evt.url
    //     );
    //   }
    // });

    if (!this.rimaAAAService.getUserId()) {
      console.error(
        "[ColaboFlowService::constructor] rimaAAAService.getUserId() NOT DEFINED"
      );
    }
    //load myColaboFlowState:
    this.knalledgeNodeService
      .queryInMapofTypeForUser(
        ColaboFlowService.mapId,
        ColaboFlowService.MY_COLABO_FLOW_STATE_TYPE,
        this.rimaAAAService.getUserId()
      )
      .subscribe(this.myCfStateLoaded.bind(this));

    //TODO: we can also load it by type='colaboflow.state'
    this.loadCFState().subscribe(node => {});
    //let interval: number = <any>setInterval( ()=>{this.cFStateChanged()}, 2000);

    // registering system plugin
    let talkPluginOptions: ColaboPubSubPlugin = {
      name: "topiChat-client-orchestration-colabo-flow-state",
      events: {}
    };
    talkPluginOptions.events[
      TopiChatClientsOrchestrationDefaultEvents.ColaboFlowStateChange
    ] = this.cfStateChanged.bind(this);
    talkPluginOptions.events[
      TopiChatClientsOrchestrationDefaultEvents.ColaboFlowStateChangeReport
    ] = this.cfStateChangedReplay.bind(this);
    this.topiChatCOrchestrationService.registerPlugin(
      TopiChatClientsOrchestrationEvents.Defualt,
      talkPluginOptions
    );
  }

  colaboFlowInitiated(): Observable<any> {
    return this.initiated
      ? of(true)
      : new Observable(this.colaboFlowInitiatedSubscriber.bind(this));
  }

  colaboFlowIsInitiated(): void {
    if (
      --this.partsLeftToInitiate == 0 &&
      typeof this.colaboFlowInitiatedObserver.next === "function" &&
      typeof this.colaboFlowInitiatedObserver.complete === "function"
    ) {
      this.initiated = true;
      this.colaboFlowInitiatedObserver.next(1); //TODO change value
      this.colaboFlowInitiatedObserver.complete();
    }
  }

  //could be done as anonymous, but we made it this way to be more clear the logic of Oberver
  colaboFlowInitiatedSubscriber(observer) {
    //:Observer) {
    console.log("colaboFlowInitiatedSubscriber");
    this.colaboFlowInitiatedObserver = observer;
    return { unsubscribe() {} };
  }

  setMyColaboFlowStateInner(state: MyColaboFlowStates): void {
    this.myColaboFlowState.state = state;
    this.saveMyColaboFlowState();
  }
  myCfStateLoaded(myCfStateNodes: KNode[]): void {
    console.log("myCfStateLoaded", myCfStateNodes);
    let iAmId: string = this.rimaAAAService.getUserId();
    if (!iAmId) {
      console.error(
        "[ColaboFlowService::myCfStateLoaded] this.rimaAAAService.getUserId() NOT DEFINED cannot continue."
      );
      // this.snac
    } else {
      myCfStateNodes = myCfStateNodes.filter(
        myCfStateNode => myCfStateNode.iAmId === iAmId
      );
      console.log("myCfStateLoaded [FILTERED for my iAmId]", myCfStateNodes);
      if (myCfStateNodes !== null && myCfStateNodes.length > 0) {
        this.myCfStateNode = myCfStateNodes[0];
        let whereIam: string = this.myColaboFlowState.whereIam;
        this.node2MyCfState(this.myCfStateNode);
        if (whereIam && whereIam !== "") {
          //to avoid rat-racing: almost surely is `startKeepingMyState` called before this method and the `whereIam` initially set by it gets lost otherwise
          this.myColaboFlowState.whereIam = whereIam;
          this.myCfState2Node(this.myCfStateNode);
          this.keepMyState();
        }
      } else {
        this.myCfStateNode = new KNode();
        this.myCfStateNode.type = ColaboFlowService.MY_COLABO_FLOW_STATE_TYPE;
        this.myCfStateNode.iAmId = iAmId;

        this.myCfStateNode.mapId = ColaboFlowService.mapId;
        this.myCfState2Node(this.myCfStateNode);
        this.knalledgeNodeService
          .create(this.myCfStateNode)
          .subscribe(this.myCfStateCreated.bind(this));
      }
      this.colaboFlowIsInitiated();
    }
    // this.areStatesInitiated = true; //(so far) we don't care if the `myCfStateNode` is properly set up just want to know that when `areStatesInitiated` === true the `myCfStateNode` is not going to be overridden
  }

  myCfStateCreated(node: KNode) {
    console.log("myCfStateCreated");
    this.myCfStateNode = node;
  }

  saveMyColaboFlowState() {
    if (
      this.myCfStateNode != null &&
      this.myCfStateNode != undefined &&
      this.myCfStateNode.state === VO.STATE_SYNCED
    ) {
      let node2Save: KNode = this.myCfState2Node(this.myCfStateNode);
      console.log(
        "saveMyColaboFlowState",
        node2Save.iAmId,
        node2Save.dataContent.MyColaboFlowState.whereIam,
        node2Save
      );
      this.knalledgeNodeService
        .update(node2Save, KNode.UPDATE_TYPE_ALL, null)
        .subscribe(this.myCfStateSaved.bind(this));
      this.sendMyCFChangeByTChat();
    }
  }

  protected keepMyState() {
    // console.log("[keepMyState]", this.myColaboFlowState.whereIam);
    if (this.myCfStateNode != null && this.myCfStateNode != undefined) {
      //&& this.myCfStateNode.state === VO.STATE_SYNCED){
      this.saveMyColaboFlowState();
    } else {
      console.log(
        "[keepMyState] this.myCfStateNode === null || this.myCfStateNode === undefined"
      );
    }
  }

  /**
   * can be reset to new position 'whereIam'
   */
  public startKeepingMyState(whereIam: string = "UNKNOWN"): void {
    if (whereIam === "/") {
      whereIam = "/home";
    } // to avoid interpreting being on home page (index pag) as page being unknown/unset
    whereIam = whereIam.indexOf("/") === 0 ? whereIam.substring(1) : whereIam; //cleaning initial '/'
    console.log("[startKeepingMyState] whereIam", whereIam);
    this.myColaboFlowState.whereIam = whereIam;
    if (this.keepMyStateInterval) {
      clearInterval(this.keepMyStateInterval);
    }
    this.keepMyStateInterval = setInterval(this.keepMyState.bind(this), 3000);
  }

  myCfStateSaved(node: KNode) {
    // console.log("myCfStateSaved");
    if (node) {
      this.myCfStateNode = node;
    }
  }

  sendMyCFChangeByTChat() {
    //TODO:
  }

  /**
   * @description injects local variables `myColaboFlowState` and `colaboFlowState` into `myCfStateNode`
   * @param myCfStateNode
   */
  public myCfState2Node(myCfStateNode: KNode): KNode {
    myCfStateNode.dataContent[
      "MyColaboFlowState"
    ] = this.myColaboFlowState.serialize();
    myCfStateNode.dataContent[
      "ColaboFlowState"
    ] = this.colaboFlowState.serialize();
    return myCfStateNode;
  }

  /**
   * @description extracts `myCfStateNode` into local variables `myColaboFlowState` and `colaboFlowState`
   * @param myCfStateNode
   */
  public node2MyCfState(myCfStateNode: KNode): MyColaboFlowState {
    this.myColaboFlowState.deserialize(
      myCfStateNode.dataContent["MyColaboFlowState"]
    );
    return this.myColaboFlowState;
  }

  loadCFState(): Observable<KNode[]> {
    let result = this.knalledgeNodeService
      .queryInMapofType(
        ColaboFlowService.mapId,
        ColaboFlowService.COLABO_FLOW_STATE_TYPE
      )
      .pipe(tap(nodes => this.colaboFlowStateLoaded(nodes)));
    return result;
  }

  colaboFlowStateLoaded(states: KNode[]): void {
    if (states !== null && states !== undefined && states.length > 0) {
      let state = states[0];
      console.log("colaboFlowStateLoaded:Bef", this.colaboFlowState);
      this.colaboFlowStateNode = state;
      if ("dataContent" in state && "state" in state.dataContent) {
        this.colaboFlowState.state = state.dataContent.state;
      }
      if ("dataContent" in state && "playRound" in state.dataContent) {
        this.colaboFlowState.playRound = state.dataContent.playRound;
      }
      console.log("colaboFlowStateLoaded:Aft", this.colaboFlowState);
    } else {
      console.error("[colaboFlowStateLoaded] ColaboFlowState NOT FOUND ");
    }
    this.colaboFlowIsInitiated();
  }

  /**
   * called by moderator from component
   */
  saveCFState() {
    if (!("dataContent" in this.colaboFlowStateNode)) {
      this.colaboFlowStateNode["dataContent"] = {};
    }
    this.colaboFlowStateNode.dataContent.state = this.colaboFlowState.state;
    this.colaboFlowStateNode.dataContent.playRound = this.colaboFlowState.playRound;

    this.knalledgeNodeService
      .update(this.colaboFlowStateNode, KNode.UPDATE_TYPE_ALL, null)
      .subscribe(this.cFStateSaved.bind(this));
  }

  cFStateSaved(state: KNode): void {
    this.colaboFlowStateNode = state;
  }

  // cFStateChanged():void{
  //   console.log("cFStateChanged");
  //   this.knalledgeNodeService.getById(COLABO_FLOW_STATE_NODE_ID).subscribe(this.colaboFlowStateRELoaded.bind(this));
  // }

  // colaboFlowStateRELoaded(state:KNode):void{
  //   if('dataContent' in state && 'playRound' in state.dataContent){
  //     let oldRound:number = this.colaboFlowState.playRound;
  //     this.colaboFlowStateLoaded(state);
  //     if(oldRound !== this.colaboFlowState.playRound){
  //         this.cFStateChangesReceived(state);
  //     }
  //   }
  // }

  /**
    for components (that want to be informed when the CFState is changed) to subscribe
    @return list of suggested cards (KNode[]) sorted by similarity_quotient in a decreasing direction
  */
  getCFStateChanges(): Observable<KNode> {
    return new Observable(this.cFStateChangesSubscriber.bind(this));
  }

  cFStateChangesSubscriber(observer) {
    //:Observer) {
    console.log("cFStateChangesSubscriber");
    this.cFStateChangesObserver = observer;
    return { unsubscribe() {} };
  }

  cFStateChangesReceived(state: KNode): void {
    console.log("CFService::cFStateChangesReceived:", state);
    this.cFStateChangesObserver.next(state);

    //we call this when we want to finish:
    //this.cFStateChangesReceivedObserver.complete();
  }

  undo(): MyColaboFlowStates {
    let state: MyColaboFlowStates = this.myColaboFlowState.goBack();
    this.saveMyColaboFlowState();
    return state;
  }

  myColaboFlowState_reset(): MyColaboFlowStates {
    let state: MyColaboFlowStates = this.myColaboFlowState.reset();
    this.saveMyColaboFlowState();
    return state;
  }

  myColaboFlowState_nextState(): MyColaboFlowStates {
    let state: MyColaboFlowStates = this.myColaboFlowState.nextState();
    this.saveMyColaboFlowState();
    return state;
  }

  myColaboFlowState_goBack(): MyColaboFlowStates {
    let state: MyColaboFlowStates = this.myColaboFlowState.goBack();
    this.saveMyColaboFlowState();
    return state;
  }

  //TopicChat:
  sendMessage(colaboFlowState: ColaboFlowState) {
    let whoAmI: KNode = this.rimaAAAService.getUser();

    var msgPayload: TopiChatClientsOrchestrationDefaultPayload = {
      from: {
        name: whoAmI.name, // whoAmI.dataContent.firstName
        role: "moderator",
        iAmId: whoAmI._id
      },
      content: {
        data: colaboFlowState
      }
    };
    console.log(
      "[ColaboFlowService:sendMessage] sending message: %s",
      JSON.stringify(msgPayload)
    );
    this.topiChatCOrchestrationService.emit(
      TopiChatClientsOrchestrationEvents.Defualt,
      TopiChatClientsOrchestrationDefaultEvents.ColaboFlowStateChange,
      msgPayload
    );
    // this.messages.push(msg);
  }

  //TopicChat:
  cfStateChanged(
    eventName,
    cOrchestrationPluginPackage: TopiChatPluginPackage,
    tcPackage: TopiChatPackage
  ) {
    // console.log('[ColaboFlowService:cfStateChanged] Client id: %s', tcPackage.clientIdReciever);
    console.log(
      "\t cOrchestrationPluginPackage: %s",
      JSON.stringify(cOrchestrationPluginPackage)
    );
    console.log("\t tcPackage: %s", JSON.stringify(tcPackage));
    let msgPayload: TopiChatClientsOrchestrationDefaultPayload =
      cOrchestrationPluginPackage.payload;
    switch (eventName) {
      // case TopiChatClientsOrchestrationDefaultEvents.Chat:
      //   // this.messages.push(msgPayload);
      //   break;
      // case TopiChatClientsOrchestrationDefaultEvents.ChatReport:
      //   console.log("[TopiChatClientsOrchestrationDefaultEvents.ChatReport] msg: '%s' is saved under _id:'%s'",
      //     (<any>msgPayload).receivedText, (<any>msgPayload)._id);
      //   break;
      case TopiChatClientsOrchestrationDefaultEvents.ColaboFlowStateChange:
        console.log(
          "[ColaboFlowService:cfStateChanged] msg: '%s' is saved under _id:'%s'",
          (<any>msgPayload).receivedText,
          (<any>msgPayload)._id
        );
        break;
    }
  }

  cfStateChangedReplay(
    eventName,
    cOrchestrationPluginPackage: TopiChatPluginPackage,
    tcPackage: TopiChatPackage
  ) {
    // console.log('[ColaboFlowService:cfStateChangedReplay] Client id: %s', tcPackage.clientIdReciever);
    console.log(
      "\t cOrchestrationPluginPackage: %s",
      JSON.stringify(cOrchestrationPluginPackage)
    );
    console.log("\t tcPackage: %s", JSON.stringify(tcPackage));
    let msgPayload: TopiChatClientsOrchestrationDefaultPayload =
      cOrchestrationPluginPackage.payload;
    // this.messages.push(msgPayload);
  }

  //TODO should be moved probably to DialoGameService, but is used from a Puzzle where DialoGameService is not visible
  resetCWCtoUnplayed(cwc: KNode): Observable<any> {
    if ("dataContent" in cwc && "dialoGameReponse" in cwc.dataContent) {
      delete cwc.dataContent.dialoGameReponse;
      return this.knalledgeNodeService.update(
        cwc,
        KNode.UPDATE_TYPE_UNSET_DIALOGAME,
        null
      );
    }
  }
}
