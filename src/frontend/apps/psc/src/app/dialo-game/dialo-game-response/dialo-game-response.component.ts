import { Component, OnInit } from '@angular/core';
import {DialoGameService} from '../dialo-game.service';
import {DialoGameResponse} from './dialoGameResponse';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {CardDecorator} from '../card-decorator//cardDecorator';
import {MyColaboFlowStates} from '@colabo-flow/f-core/lib/myColaboFlowState';
import {ColaboFlowService} from '@colabo-flow/f-core/lib/colabo-flow.service';

@Component({
  selector: 'dialo-game-response',
  templateUrl: './dialo-game-response.component.html',
  styleUrls: ['./dialo-game-response.component.css']
})
export class DialoGameResponseComponent implements OnInit {

//  response:DialoGameResponse;
  constructor(
    private dialoGameService: DialoGameService,
    public colaboFlowService: ColaboFlowService
  ) { }

  ngOnInit() {
    //this.response = this.dialoGameService.lastResponse;
    //responseCards[0]
  }

  get response():DialoGameResponse{
    return this.dialoGameService.lastResponse;
  }

  shown():boolean{
    let state:MyColaboFlowStates = this.colaboFlowService.myColaboFlowState.state;
    //console.log('shown',state);
    return !(state === MyColaboFlowStates.NOT_STARTED) && !(state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD);
  }

  getResponseCard():KNode{
    return this.dialoGameService.lastResponse.responseCards[0];
  }

  getChallengeCard():KNode{
    return this.dialoGameService.lastResponse.challengeCards[0];
  }

  // getDecorators():CardDecorator[]{
  //   return this.response.decorators;
  // }

}
