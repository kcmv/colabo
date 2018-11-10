import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {ColaboFlowState, ColaboFlowStates} from './colaboFlowState';
import {MyColaboFlowState, MyColaboFlowStates} from './myColaboFlowState';
import { Observable, of } from 'rxjs';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import { RimaAAAService } from '@colabo-rima/f-aaa';

import {
  TopiChatClientsOrchestrationService, TopiChatClientsOrchestrationEvents,
  TopiChatClientsOrchestrationDefaultEvents, TopiChatClientsOrchestrationDefaultPayload,
  TopiChatPluginPackage, TopiChatPackage, ColaboPubSubPlugin
}
  from '@colabo-topichat/f-clients-orchestration';

const COLABO_FLOW_STATE_NODE_ID:string = '5b9f9ff97f07953d41256aff';

export enum ColaboFlowEvents{
	ColaboFlowStateChange = 'tc:colabo-flow-state-change'
}

@Injectable({
  providedIn: 'root'
})
export class ColaboFlowService {
  public colaboFlowState: ColaboFlowState;
  public myColaboFlowState: MyColaboFlowState;
  public dbDialoGameState: KNode = new KNode(); //without this compiler throws ERR error TS2339: Property 'dataContent' does not exist on type 'never'. for code: this.dbDialoGameState.dataContent = {};
  cFStateChangesObserver: any = {};//Observer

  constructor(
    private knalledgeNodeService:KnalledgeNodeService,
    protected rimaAAAService: RimaAAAService,
    private topiChatCOrchestrationService: TopiChatClientsOrchestrationService
  ) {
    this.colaboFlowState = new ColaboFlowState();
    this.myColaboFlowState = new MyColaboFlowState();
    //TODO: we can also load it by type='colaboflow.state'
    this.loadCFState().subscribe(node => {});
    //let interval: number = <any>setInterval( ()=>{this.cFStateChanged()}, 2000);

    // registering system plugin
    let talkPluginOptions: ColaboPubSubPlugin = {
      name: "topiChat-client-orchestration-colabo-flow-state",
      events: {}
    };
    talkPluginOptions.events[TopiChatClientsOrchestrationDefaultEvents.ColaboFlowStateChange] = this.cfStateChanged.bind(this);
    talkPluginOptions.events[TopiChatClientsOrchestrationDefaultEvents.ColaboFlowStateChangeReply] = this.cfStateChangedReplay.bind(this);
    this.topiChatCOrchestrationService.registerPlugin(TopiChatClientsOrchestrationEvents.Defualt, talkPluginOptions);
  }

  //notification for this service by the 'observing service that the CFState is changed
  cFStateChanged():void{
    console.log("cFStateChanged");
    this.knalledgeNodeService.getById(COLABO_FLOW_STATE_NODE_ID).subscribe(this.colaboFlowStateRELoaded.bind(this));
  }

  colaboFlowStateRELoaded(state:KNode):void{
    if('dataContent' in state && 'playRound' in state.dataContent){
      let oldRound:number = this.colaboFlowState.playRound;
      this.colaboFlowStateLoaded(state);
      if(oldRound !== this.colaboFlowState.playRound){
          this.cFStateChangesReceived(state);
      }
    }
  }

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

  loadCFState():Observable<KNode>{
    let result = this.knalledgeNodeService.getById(COLABO_FLOW_STATE_NODE_ID)
    .pipe(
      tap(node => this.colaboFlowStateLoaded(node))
    );
    return result;
  }

  colaboFlowStateLoaded(state:KNode):void{
    console.log('colaboFlowStateLoaded:Bef', this.colaboFlowState);
    this.dbDialoGameState = state;
    if('dataContent' in state && 'state' in state.dataContent){
      this.colaboFlowState.state = state.dataContent.state;
    }
    if('dataContent' in state && 'playRound' in state.dataContent){
      this.colaboFlowState.playRound = state.dataContent.playRound;
    }
    console.log('colaboFlowStateLoaded:Aft', this.colaboFlowState);
  }

  saveCFState(){
    if(!('dataContent' in this.dbDialoGameState)){
      this.dbDialoGameState['dataContent'] = {};
    }
    this.dbDialoGameState.dataContent.state = this.colaboFlowState.state;
    this.dbDialoGameState.dataContent.playRound = this.colaboFlowState.playRound;

    this.knalledgeNodeService.update(this.dbDialoGameState, KNode.UPDATE_TYPE_ALL, null).subscribe(this.cFStateSaved.bind(this));
  }

  cFStateSaved(state:KNode):void{
    this.dbDialoGameState = state;
  }

  undo():MyColaboFlowStates{
    return this.myColaboFlowState.goBack();
  }

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

  cfStateChanged(eventName, cOrchestrationPluginPackage: TopiChatPluginPackage, tcPackage: TopiChatPackage) {
    // console.log('[ColaboFlowService:cfStateChanged] Client id: %s', tcPackage.clientIdReciever);
    console.log('\t cOrchestrationPluginPackage: %s', JSON.stringify(cOrchestrationPluginPackage));
    console.log('\t tcPackage: %s', JSON.stringify(tcPackage));
    let msgPayload: TopiChatClientsOrchestrationDefaultPayload = cOrchestrationPluginPackage.payload;
    switch (eventName) {
      case TopiChatClientsOrchestrationDefaultEvents.Chat:
        // this.messages.push(msgPayload);
        break;
      case TopiChatClientsOrchestrationDefaultEvents.ChatReport:
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
