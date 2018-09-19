import { Injectable } from '@angular/core';
import {ColaboFlowState, ColaboFlowStates} from './colaboFlowState';
import {MyColaboFlowState, MyColaboFlowStates} from './myColaboFlowState';

import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

const COLABO_FLOW_STATE_NODE_ID:string = '5b9f9ff97f07953d41256aff';
@Injectable({
  providedIn: 'root'
})
export class ColaboFlowService {
  public colaboFlowState: ColaboFlowState;
  public myColaboFlowState: MyColaboFlowState;
  constructor(
    private knalledgeNodeService:KnalledgeNodeService
  ) {
    this.colaboFlowState = new ColaboFlowState();
    this.myColaboFlowState = new MyColaboFlowState();
    //TODO: we can also load it by type='colaboflow.state'
    this.knalledgeNodeService.getById(COLABO_FLOW_STATE_NODE_ID).subscribe(this.colaboFlowStateLoaded.bind(this));
  }

  colaboFlowStateLoaded(state:KNode):void{
    console.log('colaboFlowStateLoaded:Bef', this.colaboFlowState);
    if('dataContent' in state && 'state' in state.dataContent){
      this.colaboFlowState.state = state.dataContent.state;
    }
    if('dataContent' in state && 'playRound' in state.dataContent){
      this.colaboFlowState.playRound = state.dataContent.playRound;
    }
    console.log('colaboFlowStateLoaded:Aft', this.colaboFlowState);
  }

  undo():void{
    this.myColaboFlowState.goBack();
  }
}
