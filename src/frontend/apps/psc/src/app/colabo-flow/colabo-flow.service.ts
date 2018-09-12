import { Injectable } from '@angular/core';
import {ColaboFlowState, ColaboFlowStates} from '../colabo-flow/colaboFlowState';

@Injectable({
  providedIn: 'root'
})
export class ColaboFlowService {
  public colaboFlowState: ColaboFlowState;
  constructor() {
    this.colaboFlowState = new ColaboFlowState();
  }
}
