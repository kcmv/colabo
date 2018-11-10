import { Component, OnInit } from '@angular/core';
import {ColaboFlowService} from '../colabo-flow.service';
import {ColaboFlowState} from '../colaboFlowState';
import {MyColaboFlowState, MyColaboFlowStates} from '../myColaboFlowState';

@Component({
  selector: 'colabo-flow',
  templateUrl: './colabo-flow.component.html',
  styleUrls: ['./colabo-flow.component.css']
})
export class ColaboFlowComponent implements OnInit {

  constructor(
    private colaboFlowService: ColaboFlowService
  ) { }

  ngOnInit() {
  }

  shown():boolean{
    return true;
    // let state:MyColaboFlowStates = this.colaboFlowService.myColaboFlowState.state;
    // console.log('shown',state);
    // return !(state === MyColaboFlowStates.NOT_STARTED) && !(state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD);
  }

  // GetCFState():void{
  //   this.colaboFlowService.cFStateChanged();
  // }

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
