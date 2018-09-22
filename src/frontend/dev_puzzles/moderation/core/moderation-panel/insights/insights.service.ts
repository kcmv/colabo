import { Injectable } from '@angular/core';
// import {ColaboFlowState, ColaboFlowStates} from './colaboFlowState';
// import {MyColaboFlowState, MyColaboFlowStates} from './myColaboFlowState';

import { RimaAAAService } from '@colabo-rima/rima_aaa/rima-aaa.service';
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
  cardsPlayed:KNode[][] = new Array<Array<KNode>>(); //first dimension are rounds, second are all cards in that round
  registeredUsers:KNode[] = [];

  constructor(
    private knalledgeNodeService:KnalledgeNodeService,
    private colaboFlowService:ColaboFlowService,
    private rimaAAAService: RimaAAAService
  ) {
  }

  getRegisteredUsers(forceRefresh:boolean = false):Observable<KNode[]>{
    let result:Observable<KNode[]>;

    if(forceRefresh || this.registeredUsers.length == 0){
      result = this.rimaAAAService.getRegisteredUsers(InsightsService.MAP_ID)
      .pipe(
        tap(nodesFromServer => this.assignRegisteredUsers(nodesFromServer))
      );
      return result;
    }
    else{
      return of(this.registeredUsers);
    }
  }

  assignRegisteredUsers(users:any):void{
    console.log('assignRegisteredUsers', users);
    this.registeredUsers = users;
  }

 getCardsPlayedInTheRound(round:number, forceRefresh:boolean = false):Observable<KNode[]>{
    let result:Observable<KNode[]> ;

    if(forceRefresh || this.cardsPlayed.length == 0 || (typeof this.cardsPlayed[round] === 'undefined') || this.cardsPlayed[round].length == 0){
      result = this.knalledgeNodeService.queryInMapofTypeAndContentData(InsightsService.MAP_ID, InsightsService.TOPICHAT_MSG_TYPE, "dialoGameReponse.playRound", round)
      .pipe(
        tap(nodesFromServer => this.assignCardsPlayedInTheRound(round, nodesFromServer))
      );
      return result;
    }
    else{
      if(typeof this.cardsPlayed[round] === 'undefined'){this.cardsPlayed[round] = []}
      return of(this.cardsPlayed[round]);
    }
  }

/*
  be aware that this method will reaturn false also in the case when users are not loaded yet
*/
hasUserPlayedInTheRound(userId:string, round:number):boolean{
  if(typeof this.cardsPlayed[round] === 'undefined'){return false;}

  for(var i:number = 0; i<this.cardsPlayed[round].length;i++){
    if(this.cardsPlayed[round][i].iAmId == userId){
      return true;
    }
  }
  return false;
}

  assignCardsPlayedInTheRound(round:number, cards:any):void{
    console.log('assignCardsPlayedInTheCurrentRound', round, cards);
    if(typeof this.cardsPlayed[round] === 'undefined'){this.cardsPlayed[round] = []}
    this.cardsPlayed[round] = cards;
  }

}
