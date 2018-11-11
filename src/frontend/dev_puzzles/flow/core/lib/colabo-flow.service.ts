import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {ColaboFlowState, ColaboFlowStates} from './colaboFlowState';
import {MyColaboFlowState, MyColaboFlowStates} from './myColaboFlowState';
import { Observable, of } from 'rxjs';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {VO} from '@colabo-knalledge/f-core/code/knalledge/VO';
import { RimaAAAService } from '@colabo-rima/f-aaa';

import * as config from '@colabo-utils/i-config';

import {
  TopiChatClientsOrchestrationService, TopiChatClientsOrchestrationEvents,
  TopiChatClientsOrchestrationDefaultEvents, TopiChatClientsOrchestrationDefaultPayload,
  TopiChatPluginPackage, TopiChatPackage, ColaboPubSubPlugin
}
  from '@colabo-topichat/f-clients-orchestration';

export enum ColaboFlowEvents{
	ColaboFlowStateChange = 'tc:colabo-flow-state-change'
}

@Injectable({
  providedIn: 'root'
})
export class ColaboFlowService {
  static PARTS_TO_INITIATE:number = 2;
  private partsLeftToInitiate = ColaboFlowService.PARTS_TO_INITIATE;
  static mapId = config.GetGeneral('mapId');
  public static MY_COLABO_FLOW_STATE_TYPE:string = 'colaboflow.my.state';
  public static COLABO_FLOW_STATE_TYPE:string = 'colaboflow.state';
  
  private _colaboFlowState: ColaboFlowState;
  public get colaboFlowState(): ColaboFlowState {
    return this._colaboFlowState;
  }
  public set colaboFlowState(value: ColaboFlowState) {
    this._colaboFlowState = value;
  }

  private _myColaboFlowState: MyColaboFlowState;
  public get myColaboFlowState(): MyColaboFlowState {
    return this._myColaboFlowState;
  }
  public set myColaboFlowState(value: MyColaboFlowState) {
    this._myColaboFlowState = value;
  }

  private myCfStateNode:KNode;

  private colaboFlowStateNode: KNode = new KNode(); //without this compiler throws ERR error TS2339: Property 'dataContent' does not exist on type 'never'. for code: this.colaboFlowStateNode.dataContent = {};
  cFStateChangesObserver: any = {};//Observer

  colaboFlowInitiatedObserver:any = {};//Observer
  private initiated:boolean = false;

  constructor(
    private knalledgeNodeService:KnalledgeNodeService,
    protected rimaAAAService: RimaAAAService,
    private topiChatCOrchestrationService: TopiChatClientsOrchestrationService
  ) {
    this.colaboFlowState = new ColaboFlowState();
    this.myColaboFlowState = new MyColaboFlowState();

    //load myColaboFlowState:
    this.knalledgeNodeService.queryInMapofTypeForUser(ColaboFlowService.mapId, ColaboFlowService.MY_COLABO_FLOW_STATE_TYPE, this.rimaAAAService.getUserId()).subscribe(this.myCfStateLoaded.bind(this));

    //TODO: we can also load it by type='colaboflow.state'
    this.loadCFState().subscribe(node => {});
    //let interval: number = <any>setInterval( ()=>{this.cFStateChanged()}, 2000);

    // registering system plugin
    let talkPluginOptions: ColaboPubSubPlugin = {
      name: "topiChat-client-orchestration-colabo-flow-state",
      events: {}
    };
    talkPluginOptions.events[TopiChatClientsOrchestrationDefaultEvents.ColaboFlowStateChange] = this.cfStateChanged.bind(this);
    talkPluginOptions.events[TopiChatClientsOrchestrationDefaultEvents.ColaboFlowStateChangeReport] = this.cfStateChangedReplay.bind(this);
    this.topiChatCOrchestrationService.registerPlugin(TopiChatClientsOrchestrationEvents.Defualt, talkPluginOptions);
  }

  colaboFlowInitiated():Observable<any>{
    return this.initiated ? of(true) : new Observable(this.colaboFlowInitiatedSubscriber.bind(this));
  }

  colaboFlowIsInitiated():void{
    if(--this.partsLeftToInitiate == 0 && typeof this.colaboFlowInitiatedObserver.next=== "function" && typeof this.colaboFlowInitiatedObserver.complete=== "function"){
      this.initiated = true;
      this.colaboFlowInitiatedObserver.next(1); //TODO change value
      this.colaboFlowInitiatedObserver.complete();
    }
  }

  //could be done as anonymous, but we made it this way to be more clear the logic of Oberver
  colaboFlowInitiatedSubscriber(observer) { //:Observer) {
    console.log('colaboFlowInitiatedSubscriber');
    this.colaboFlowInitiatedObserver = observer;
    return {unsubscribe() {}};
  }

  setMyColaboFlowStateInner(state:MyColaboFlowStates):void{
    this.myColaboFlowState.state = state;
    this.saveMyColaboFlowState();
  }
  myCfStateLoaded(myCfStateNodes:KNode[]):void{
    if(myCfStateNodes !== null && myCfStateNodes.length>0){
      this.myCfStateNode = myCfStateNodes[0];
      this.node2MyCfState(this.myCfStateNode);
    }else{
      this.myCfStateNode = new KNode();
      this.myCfStateNode.type = ColaboFlowService.MY_COLABO_FLOW_STATE_TYPE; 
      this.myCfStateNode.iAmId = this.rimaAAAService.getUserId();
      this.myCfStateNode.mapId = ColaboFlowService.mapId;
      this.myCfState2Node(this.myCfStateNode);
      this.knalledgeNodeService.create(this.myCfStateNode).subscribe(this.myCfStateCreated.bind(this));
    }
    this.colaboFlowIsInitiated();
  }

  myCfStateCreated(node:KNode){
    console.log('myCfStateCreated');
    this.myCfStateNode = node;
  }

  saveMyColaboFlowState(){
    if(this.myCfStateNode != null && this.myCfStateNode != undefined && this.myCfStateNode.state === VO.STATE_SYNCED){
      this.knalledgeNodeService.update(this.myCfState2Node(this.myCfStateNode), KNode.UPDATE_TYPE_ALL, null).subscribe(this.myCfStateSaved.bind(this));
      this.sendMyCFChangeByTChat();
    }
  }
  
  myCfStateSaved(node:KNode){
    console.log('myCfStateSaved');
    this.myCfStateNode = node;
  }

  sendMyCFChangeByTChat(){
    //TODO: 
  }

  public myCfState2Node(myCfStateNode:KNode):KNode{
    myCfStateNode.dataContent['MyColaboFlowState'] = this.myColaboFlowState.serialize();
    myCfStateNode.dataContent['ColaboFlowState'] = this.colaboFlowState.serialize();
    return myCfStateNode;
  }

  public node2MyCfState(myCfStateNode:KNode):MyColaboFlowState{
    this.myColaboFlowState.deserialize(myCfStateNode.dataContent['MyColaboFlowState']);
    return this.myColaboFlowState;
  }

  loadCFState():Observable<KNode[]>{
    let result = this.knalledgeNodeService.queryInMapofType(ColaboFlowService.mapId,ColaboFlowService.COLABO_FLOW_STATE_TYPE)
    .pipe(
      tap(nodes => this.colaboFlowStateLoaded(nodes))
    );
    return result;
  }

  colaboFlowStateLoaded(states:KNode[]):void{
      if(states !== null && states  !== undefined && states .length > 0){
        let state = states[0];
        console.log('colaboFlowStateLoaded:Bef', this.colaboFlowState);
        this.colaboFlowStateNode = state;
        if('dataContent' in state && 'state' in state.dataContent){
          this.colaboFlowState.state = state.dataContent.state;
        }
        if('dataContent' in state && 'playRound' in state.dataContent){
          this.colaboFlowState.playRound = state.dataContent.playRound;
        }
        console.log('colaboFlowStateLoaded:Aft', this.colaboFlowState);
      }else{
        console.error('[colaboFlowStateLoaded] ColaboFlowState NOT FOUND ');
      }
      this.colaboFlowIsInitiated();
  }
  
  /**
   * called by moderator from component
   */
  saveCFState(){
    if(!('dataContent' in this.colaboFlowStateNode)){
      this.colaboFlowStateNode['dataContent'] = {};
    }
    this.colaboFlowStateNode.dataContent.state = this.colaboFlowState.state;
    this.colaboFlowStateNode.dataContent.playRound = this.colaboFlowState.playRound;

    this.knalledgeNodeService.update(this.colaboFlowStateNode, KNode.UPDATE_TYPE_ALL, null).subscribe(this.cFStateSaved.bind(this));
  }

  cFStateSaved(state:KNode):void{
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
  getCFStateChanges():Observable<KNode>{
    return new Observable(this.cFStateChangesSubscriber.bind(this));
  }

  cFStateChangesSubscriber(observer) { //:Observer) {
    console.log('cFStateChangesSubscriber');
    this.cFStateChangesObserver = observer;
    return {unsubscribe() {}};
  }

  cFStateChangesReceived(state:KNode):void{
    console.log('CFService::cFStateChangesReceived:', state);
    this.cFStateChangesObserver.next(state);

    //we call this when we want to finish:
    //this.cFStateChangesReceivedObserver.complete();
  }

  undo():MyColaboFlowStates{
    let state:MyColaboFlowStates = this.myColaboFlowState.goBack();
    this.saveMyColaboFlowState();
    return state;
  }

  myColaboFlowState_reset():MyColaboFlowStates{
    let state:MyColaboFlowStates = this.myColaboFlowState.reset();
    this.saveMyColaboFlowState();
    return state;
  }

  myColaboFlowState_nextState():MyColaboFlowStates{
    let state:MyColaboFlowStates = this.myColaboFlowState.nextState();
    this.saveMyColaboFlowState();
    return state;
  }

  myColaboFlowState_goBack():MyColaboFlowStates{
    let state:MyColaboFlowStates = this.myColaboFlowState.goBack();
    this.saveMyColaboFlowState();
    return state;
  }

  //TopicChat:
  sendMessage(colaboFlowState: ColaboFlowState) {
    let whoAmI: KNode = this.rimaAAAService.getUser();

    var msgPayload: TopiChatClientsOrchestrationDefaultPayload = {
      from: {
        name: whoAmI.name, // whoAmI.dataContent.firstName
        role: 'moderator',
        iAmId: whoAmI._id
      },
      content: {
        data: colaboFlowState
      }
    };
    console.log('[ColaboFlowService:sendMessage] sending message: %s', JSON.stringify(msgPayload));
    this.topiChatCOrchestrationService.emit(TopiChatClientsOrchestrationEvents.Defualt,
      TopiChatClientsOrchestrationDefaultEvents.ColaboFlowStateChange, msgPayload);
    // this.messages.push(msg);
  }

  //TopicChat:
  cfStateChanged(eventName, cOrchestrationPluginPackage: TopiChatPluginPackage, tcPackage: TopiChatPackage) {
    // console.log('[ColaboFlowService:cfStateChanged] Client id: %s', tcPackage.clientIdReciever);
    console.log('\t cOrchestrationPluginPackage: %s', JSON.stringify(cOrchestrationPluginPackage));
    console.log('\t tcPackage: %s', JSON.stringify(tcPackage));
    let msgPayload: TopiChatClientsOrchestrationDefaultPayload = cOrchestrationPluginPackage.payload;
    switch (eventName) {
      // case TopiChatClientsOrchestrationDefaultEvents.Chat:
      //   // this.messages.push(msgPayload);
      //   break;
      // case TopiChatClientsOrchestrationDefaultEvents.ChatReport:
      //   console.log("[TopiChatClientsOrchestrationDefaultEvents.ChatReport] msg: '%s' is saved under _id:'%s'",
      //     (<any>msgPayload).receivedText, (<any>msgPayload)._id);
      //   break;
      case TopiChatClientsOrchestrationDefaultEvents.ColaboFlowStateChange:
        console.log("[ColaboFlowService:cfStateChanged] msg: '%s' is saved under _id:'%s'",
        (<any>msgPayload).receivedText, (<any>msgPayload)._id);
      break;
    }
  }
  
  cfStateChangedReplay(eventName, cOrchestrationPluginPackage: TopiChatPluginPackage, tcPackage: TopiChatPackage) {
    // console.log('[ColaboFlowService:cfStateChangedReplay] Client id: %s', tcPackage.clientIdReciever);
    console.log('\t cOrchestrationPluginPackage: %s', JSON.stringify(cOrchestrationPluginPackage));
    console.log('\t tcPackage: %s', JSON.stringify(tcPackage));
    let msgPayload: TopiChatClientsOrchestrationDefaultPayload = cOrchestrationPluginPackage.payload;
    // this.messages.push(msgPayload);
  }
}
