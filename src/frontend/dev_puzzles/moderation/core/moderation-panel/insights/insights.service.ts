import { Injectable } from '@angular/core';
// import {ColaboFlowState, ColaboFlowStates} from './colaboFlowState';
// import {MyColaboFlowState, MyColaboFlowStates} from './myColaboFlowState';

import {ColaboFlowService} from '@colabo-colaboflow/core/lib/colabo-flow.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InsightsService {

  static MAP_ID = "5b96619b86f3cc8057216a03"; //PSC (PTW2018)
  static TOPICHAT_MSG_TYPE:string = 'topiChat.talk.chatMsg';
  cardsPlayedInTheCurrentRound:KNode[] = [];

  constructor(
    private knalledgeNodeService:KnalledgeNodeService,
    private colaboFlowService:ColaboFlowService
  ) {
  }

  getCardsPlayedInTheCurrentRound(forceRefresh:boolean = false):Observable<KNode[]>{
    let result:Observable<KNode[]>;

    if(forceRefresh || this.cardsPlayedInTheCurrentRound.length == 0){
      result = this.knalledgeNodeService.queryInMapofTypeAndContentData(InsightsService.MAP_ID, InsightsService.TOPICHAT_MSG_TYPE, "dialoGameReponse.playRound", this.colaboFlowService.colaboFlowState.playRound)
      .pipe(
        tap(nodesFromServer => this.assignCardsPlayedInTheCurrentRound(nodesFromServer))
      );
      return result;
    }
    else{
      return of(this.cardsPlayedInTheCurrentRound);
    }
  }

  assignCardsPlayedInTheCurrentRound(cards:any):void{
    console.log('assignCardsPlayedInTheCurrentRound', cards);
    this.cardsPlayedInTheCurrentRound = cards;
  }

}
