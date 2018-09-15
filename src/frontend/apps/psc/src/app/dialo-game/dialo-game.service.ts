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
    public colaboFlowService: ColaboFlowService,
    private knalledgeNodeService: KnalledgeNodeService
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
      if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD){
        return this.getOpeningCards(forceRefresh);
      }
      else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_RESPONSE_CARD){
          return this.getMyCards(forceRefresh);
      }
      else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR_TYPE){
        return this.getDecoratorTypes();
      }
      else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR){
        return this.getDecoratorTypes(this.lastResponse.decorators[this.lastResponse.decorators.length - 1].decorator);
      }
    }
    return of([]);
  }

  getDecoratorTypes(type:string=null):Observable<KNode[]>{
    return of(CardDecorator.getDecorators(type));
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
      if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD){ //OPENING CARD IS CHOSEN:
        let response:DialoGameResponse = new DialoGameResponse();
        response.challengeCards = cards;
        this.responses.push(response);
        this.colaboFlowService.myColaboFlowState.state = MyColaboFlowStates.CHOSING_RESPONSE_CARD;
      }
      else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_RESPONSE_CARD){
        //MyCards:
        this.lastResponse.responseCards = cards;
        this.colaboFlowService.myColaboFlowState.state = MyColaboFlowStates.CHOSING_DECORATOR_TYPE;
      }
      else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR_TYPE){
        this.lastResponse.decorators[this.lastResponse.decorators.length - 1] = new CardDecorator(cards[0].name); //TODO: hardcoded decoration of the last decorator
        this.colaboFlowService.myColaboFlowState.state = MyColaboFlowStates.CHOSING_DECORATOR;
      }
      else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR){
        this.lastResponse.decorators[this.lastResponse.decorators.length - 1].decorator = cards[0].name; //TODO: hardcoded decoration of the last decorator
        this.colaboFlowService.myColaboFlowState.state = MyColaboFlowStates.PREVIEWING;
      }
    }

  }

  undo():void{
    this.colaboFlowService.undo();
  }
}
