import { Injectable } from '@angular/core';
import {ColaboFlowState, ColaboFlowStates} from './colaboFlowState';
import {MyColaboFlowState, MyColaboFlowStates} from './myColaboFlowState';
import { Observable, of } from 'rxjs';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

const COLABO_FLOW_STATE_NODE_ID:string = '5b9f9ff97f07953d41256aff';
@Injectable({
  providedIn: 'root'
})
export class ColaboFlowService {
  public colaboFlowState: ColaboFlowState;
  public myColaboFlowState: MyColaboFlowState;
  public dbDialoGameState: KNode = new KNode(); //without this compiler throws ERR error TS2339: Property 'dataContent' does not exist on type 'never'. for code: this.dbDialoGameState.dataContent = {};

  constructor(
    private knalledgeNodeService:KnalledgeNodeService
  ) {
    this.colaboFlowState = new ColaboFlowState();
    this.myColaboFlowState = new MyColaboFlowState();
    //TODO: we can also load it by type='colaboflow.state'
    this.loadCFState();
    let interval: number = <any>setInterval( ()=>{this.cFStateChanged()}, 2000);
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

  cFStateChangesObserver:any = {};//Observer

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

  loadCFState(){
    this.knalledgeNodeService.getById(COLABO_FLOW_STATE_NODE_ID).subscribe(this.colaboFlowStateLoaded.bind(this));
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

  undo():void{
    this.myColaboFlowState.goBack();
  }
}
