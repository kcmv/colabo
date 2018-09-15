import { Injectable } from '@angular/core';
import {ColaboFlowState, ColaboFlowStates} from '../colabo-flow/colaboFlowState';
import {MyColaboFlowState, MyColaboFlowStates} from '../colabo-flow/myColaboFlowState';

@Injectable({
  providedIn: 'root'
})
export class ColaboFlowService {
  public colaboFlowState: ColaboFlowState;
  public myColaboFlowState: MyColaboFlowState;
  constructor() {
    this.colaboFlowState = new ColaboFlowState();
    this.myColaboFlowState = new MyColaboFlowState();
  }

  undo():void{
    this.myColaboFlowState.goBack();
  }
}
