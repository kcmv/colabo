import { Component, OnInit } from '@angular/core';
import {ColaboFlowService, ColaboFlowEvents, TopiChatPackage, ColaboPubSubPlugin} from '../colabo-flow.service';
import {ColaboFlowState} from '../colaboFlowState';
import {MyColaboFlowState} from '../myColaboFlowState';
import {RimaAAAService} from '@colabo-rima/f-aaa';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';

@Component({
  selector: 'colabo-flow-m',
  templateUrl: './colabo-flow-m.component.html',
  styleUrls: ['./colabo-flow-m.component.css']
})
export class ColaboFlowMComponent implements OnInit {

  constructor(
    private colaboFlowService: ColaboFlowService,
    protected rimaAAAService:RimaAAAService
  ) { }

  ngOnInit() {
    // registering system plugin
    let colaboFlowOptions:ColaboPubSubPlugin = {
        name: "colaboFlow",
        events: {}
    };
    colaboFlowOptions.events[ColaboFlowEvents.ColaboFlowStateChange] = this.colaboFlowStateChanged.bind(this);
    this.colaboFlowService.registerPlugin(colaboFlowOptions);
  }

  colaboFlowStateChanged(eventName, msg, tcPackage:TopiChatPackage):void {
      console.log('[colaboFlowStateChanged] Client id: %s', tcPackage.clientIdReciever);
    console.log('\t payload: %s', JSON.stringify(tcPackage.payload));
  }

  nextState():void{
    this.colaboFlowService.colaboFlowState.nextState();
    this.colaboFlowService.saveCFState();
    this.sendMessage(this.colaboFlowService.colaboFlowState);
  }

  sendMessage(colaboFlowState:ColaboFlowState){
      let whoAmI:KNode = this.rimaAAAService.getUser();

      var msg:any = {
        meta: {
          timestamp: Math.floor(new Date().getTime() / 1000)
        },
        from: {
          name: whoAmI.name, // whoAmI.dataContent.firstName
          role: 'moderator',
          iAmId: whoAmI._id
        },
        content: {
          colaboFlowState: colaboFlowState
        }
      };
      console.log('[ColaboFlowMComponent:sendMessage] sending message: %s', colaboFlowState);
      this.colaboFlowService.emit(ColaboFlowEvents.ColaboFlowStateChange, msg);
      // this.messages.push(msg);
      // this.messageContent = "";
  }

  previousState():void{
    this.colaboFlowService.colaboFlowState.previousState();
    this.colaboFlowService.saveCFState();
  }

  cfState():string{
    //console.log('cfState', ColaboFlowState.stateName(this.colaboFlowService.colaboFlowState.state));
    return ColaboFlowState.stateName(this.colaboFlowService.colaboFlowState.state) + '('+ this.colaboFlowService.colaboFlowState.state +')';
  }

  myCfState():string{
    return MyColaboFlowState.stateName(this.colaboFlowService.myColaboFlowState.state) + '('+ this.colaboFlowService.myColaboFlowState.state +')';;
  }

  round():number{
    return this.colaboFlowService.colaboFlowState.playRound;
  }

}
