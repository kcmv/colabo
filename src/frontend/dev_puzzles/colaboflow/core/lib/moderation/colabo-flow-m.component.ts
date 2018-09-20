import { Component, OnInit } from '@angular/core';
import {ColaboFlowService} from '../colabo-flow.service';
import {ColaboFlowState} from '../colaboFlowState';
import {MyColaboFlowState} from '../myColaboFlowState';

@Component({
  selector: 'colabo-flow-m',
  templateUrl: './colabo-flow-m.component.html',
  styleUrls: ['./colabo-flow-m.component.css']
})
export class ColaboFlowMComponent implements OnInit {

  constructor(
    private colaboFlowService: ColaboFlowService
  ) { }

  ngOnInit() {
  }

  nextState():void{
    this.colaboFlowService.colaboFlowState.nextState();
  }

  previousState():void{
    this.colaboFlowService.colaboFlowState.previousState();
  }

  cfState():string{
    //console.log('cfState', ColaboFlowState.stateName(this.colaboFlowService.colaboFlowState.state));
    return ColaboFlowState.stateName(this.colaboFlowService.colaboFlowState.state);
  }

  myCfState():string{
    return MyColaboFlowState.stateName(this.colaboFlowService.myColaboFlowState.state);
  }

  round():number{
    return this.colaboFlowService.colaboFlowState.playRound;
  }

}
