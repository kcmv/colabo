import { Injectable } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {DialoGameResponse} from './dialoGameResponse';
import {ColaboFlowService} from '../colabo-flow/colabo-flow.service';
import {ColaboFlowState, ColaboFlowStates} from '../colabo-flow/colaboFlowState';
import {MyColaboFlowState, MyColaboFlowStates} from '../colabo-flow/myColaboFlowState';
import {CardDecorator} from './card-decorator/cardDecorator';
import { environment } from '../../environments/environment';

export enum DialoGameActions{};

export const DIALOGAME_OPENING_CARD_TYPE:string = 'const.dialogame.opening-card';

//export const MAP_ID:string = '5b96619b86f3cc8057216a03';

@Injectable({
  providedIn: 'root'
})
export class DialoGameService {
  public responses:DialoGameResponse[] = [];
  myCards:KNode[] = [];
  private openingCards:KNode[] = [];


  //playedOn:[]; decorations:[];

  constructor(
    private knalledgeNodeService: KnalledgeNodeService,
    private colaboFlowService: ColaboFlowService
  ) { }

  getMyCards(forceRefresh:boolean = false):Observable<KNode[]>{
    let result:Observable<KNode[]>;
    let id_str = '5b8bf3f23663ad0d5425e870';
    let myCWCpearls:string[] = ['sun is always here','girls are playing in the garden','love is here'];
    if(forceRefresh || this.myCards.length == 0){
      let card:KNode;
      for(var i in myCWCpearls){
        card = new KNode();
        card.name = myCWCpearls[i];
        card._id = '5b8bf3f23663ad0d5425e878' + i;
        card.iAmId = '5b97c7ab0393b8490bf5263c';
        // if(card.dataContent === null){ card.dataContent = {};}
        // card.dataContent.img = "assets/images/sdgs/s/sdg" + (i+1) + '.jpg';
        this.myCards.push(card);
      }
    }
    //
    //   // {_id:'5b8bf3f23663ad0d5425e878', name:'sun is always here', iAmId: '5b8bf3f23663ad0d5425e86d'},
    //   // {_id:'5b8bf3f23663ad0d5425e879', name:'girls are playing in the garden', iAmId: '5b812567a7a78a1ba15ba0d8'},
    //   // {_id:'5b8bf3f23663ad0d5425e87A', name:'love is here', iAmId: '5b8bf3f23663ad0d5425e86d'}];
    //
    //   this.myCards =
    //   [
    //
    //   ]);
    //   return of(this.myCards);
    //   //TODO:
    //   // result = this.knalledgeNodeService.queryInMapofType(environment.mapId, DIALOGAME_OPENING_CARD_TYPE)
    //   // .pipe(
    //   //   tap(nodesFromServer => this.assignOpenningCards(nodesFromServer))
    //   // );
    //   // return result;
    // }
    // else{
    //   return of(this.myCards);
    // }
    return of(this.myCards);
  }

  get lastResponse():DialoGameResponse{
    return this.responses.length>0 ? this.responses[this.responses.length-1] : null;
  }

  getCards(forceRefresh:boolean = false):Observable<KNode[]>{
    if(this.colaboFlowService.colaboFlowState.state === ColaboFlowStates.OPENNING){
      if(this.lastResponse === null || this.lastResponse.state.state === MyColaboFlowStates.NOT_STARTED){
        return this.getOpeningCards(forceRefresh);
      }
      else{
        if(this.lastResponse.state.state === MyColaboFlowStates.CHALLENGE_CARD_CHOSEN){
          return this.getMyCards(forceRefresh);
        }
        else if(this.lastResponse.state.state === MyColaboFlowStates.RESPONSE_CARD_CHOSEN){
          return this.getDecoratorTypes();
        }
      }
    }
    else{
      return of([]);
    }
  }

  getDecoratorTypes():Observable<KNode[]>{
    return of(CardDecorator.getDecorators());
  }

  getOpeningCards(forceRefresh:boolean = false):Observable<KNode[]>{
    let result:Observable<KNode[]>;
    if(forceRefresh || this.openingCards.length == 0){
      result = this.knalledgeNodeService.queryInMapofType(environment.mapId, DIALOGAME_OPENING_CARD_TYPE)
      .pipe(
        tap(nodesFromServer => this.assignOpenningCards(nodesFromServer))
      );
      return result;
    }
    else{
      return of(this.openingCards);
    }
  }

  assignOpenningCards(nodes:any):void{ //KNode[]):void{
    console.log('assignCards', nodes);
    this.openingCards = nodes;
  }

  getOpeningCardsMockup():Observable<KNode[]>{
    let cards:KNode[] = [];
    let card:KNode;
    for(var i:number = 0; i<17;i++){
      card = new KNode();
      card.name = "How the future looks when this goal is fulfilled?";
      if(card.dataContent === null){ card.dataContent = {};}
      card.dataContent.img = "assets/images/sdgs/s/sdg" + (i+1) + '.jpg';
      cards.push(card);
    }
    console.log('getOpeningCards', cards);
    return of(cards);
  }

  // challengeCardSelected
  cardSelected(cards: KNode[]){
  //TODO:
    if(this.colaboFlowService.colaboFlowState.state === ColaboFlowStates.OPENNING){
      if(this.lastResponse === null || this.lastResponse.state.state === MyColaboFlowStates.NOT_STARTED){ //OPENING CARD IS CHOSEN:
        let response:DialoGameResponse = new DialoGameResponse();
        response.challengeCards = cards;
        response.state.state = MyColaboFlowStates.CHALLENGE_CARD_CHOSEN; //TOOO
        this.responses.push(response);
      }
      else{
        if(this.lastResponse !== null && this.lastResponse.state.state === MyColaboFlowStates.CHALLENGE_CARD_CHOSEN){
          //MyCards:
          this.lastResponse.responseCards = cards;
          this.lastResponse.state.state = MyColaboFlowStates.RESPONSE_CARD_CHOSEN;
        }
      }
    }

  }
}
