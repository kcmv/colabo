import { Injectable } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {VO} from '@colabo-knalledge/f-core/code/knalledge/VO';
import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KnalledgeEdgeService} from '@colabo-knalledge/f-store_core/knalledge-edge.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {DialoGameResponse} from './dialo-game-response/dialoGameResponse';
import {ColaboFlowService} from '@colabo-flow/f-core/lib/colabo-flow.service';
import {ColaboFlowState, ColaboFlowStates} from '@colabo-flow/f-core/lib/colaboFlowState';
import {MyColaboFlowState, MyColaboFlowStates} from '@colabo-flow/f-core/lib/myColaboFlowState';
import {CardDecorator} from './card-decorator/cardDecorator';

import {
  TopiChatClientsOrchestrationService, TopiChatClientsOrchestrationEvents,
  TopiChatClientsOrchestrationDefaultEvents, TopiChatClientsOrchestrationDefaultPayload,
  TopiChatPluginPackage, TopiChatPackage, ColaboPubSubPlugin
}
  from '@colabo-topichat/f-clients-orchestration';


import * as config from '@colabo-utils/i-config';

import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';

export enum DialoGameActions{};

export const DIALOGAME_OPENING_CARD_TYPE:string = 'const.dialogame.opening-card';
export const TOPICHAT_MSG_TYPE:string = 'topiChat.talk.chatMsg';
export const SERVICE_CWC_SIMLARITIES_TYPE:string = 'service.result.dialogame.cwc_similarities';

@Injectable({
  providedIn: 'root'
})
export class DialoGameService {
  static mapId = config.GetGeneral('mapId');
  static mapIdSDGs = config.GetGeneral('mapIdSDGs');

  static SUGGESTIONS_LIMIT:number = 3;
  public responses:DialoGameResponse[] = [];
  myCards:KNode[] = [];
  private openingCards:KNode[] = [];
  private decoratorType: string ='';

  private suggestionsHistory:KNode[] = [];

  public lastResponse:DialoGameResponse = null;
  // get lastResponse():DialoGameResponse{
  //   return this.responses.length>0 ? this.responses[this.responses.length-1] : null;
  // }

  //playedOn:[]; decorations:[];

  constructor(
    public colaboFlowService: ColaboFlowService,
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private rimaAAAService: RimaAAAService,
    private topiChatCOrchestrationService: TopiChatClientsOrchestrationService
  ) {
    //TODO check this: this.colaboFlowService.getCFStateChanges().subscribe(this.cFStateChanged.bind(this));

    // registering system plugin
    let talkPluginOptions: ColaboPubSubPlugin = {
      name: "topiChat-client-orchestration-colabo-flow-state",
      events: {}
    };
    talkPluginOptions.events[TopiChatClientsOrchestrationDefaultEvents.ColaboFlowStateChange] = this.cfStateChanged.bind(this);
    this.topiChatCOrchestrationService.registerPlugin(TopiChatClientsOrchestrationEvents.Defualt, talkPluginOptions);
    this.colaboFlowService.colaboFlowInitiated().subscribe(this.colaboFlowInitiated.bind(this));
  }

  colaboFlowInitiated():void{
    this.initNewRound();
  }

  cfStateChanged():void{
    console.log("cFStateChanged");
    if(this.waitingForNextRound){
      this.initNewRound();
    }
  }


  private assignMyCards(nodes:any):any{ //KNode[]):void{
    //console.log('assignCards', nodes);
    console.log('decoratorsBef',JSON.stringify(nodes, null, 4));
    this.myCards = [];
    
    for(var i:number = 0; i< nodes.length;i++){
      let myCard:KNode = nodes[i] as KNode;
      if(!(('dataContent' in myCard) && ('dialoGameReponse' in myCard.dataContent))){
        this.myCards.push(myCard);
      }
    }
    if(nodes.length == 0){
      window.alert("We couldn't find your cards to play. It looks like you haven't created them in the CWC process");
    }else{
      if(this.myCards.length == 0){
        window.alert("We couldn't find any remaining cards of yours to play. It looks like you have used all of them in previous playing");
      }
    }

    return this.myCards;

    //this.myCards = nodes;
  }

  getMyCards(forceRefresh:boolean = false):Observable<KNode[]>{
    console.log('getMyCards');
    let result:Observable<KNode[]>;

    if(forceRefresh || this.myCards.length == 0){
      result = this.knalledgeNodeService.queryInMapofTypeForUser(DialoGameService.mapId, TOPICHAT_MSG_TYPE, this.rimaAAAService.getUserId())
      .pipe(
        map(nodesFromServer => this.assignMyCards(nodesFromServer))
      );
      return result;
    }
    else{
      return of(this.myCards);
    }

    /*
    MOCKUP

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

    */
  }

  getCards(forceRefresh:boolean = true):Observable<KNode[]>{
      if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD){
        if(this.colaboFlowService.colaboFlowState.state === ColaboFlowStates.OPENNING){
          return this.getOpeningCards(forceRefresh);
        }
        else if(this.colaboFlowService.colaboFlowState.state === ColaboFlowStates.PLAYING_ROUNDS){
          return this.getSuggestedCards();
        }
      }
      else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_RESPONSE_CARD){
          return this.getMyCards(forceRefresh);
      }
      else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR_TYPE){
        return this.getDecoratorTypes();
      }
      else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR){
        return this.getDecoratorTypes(this.decoratorType);
        //return this.getDecoratorTypes(this.lastResponse.decorators[this.lastResponse.decorators.length - 1].decorator);
      }
    return of([]);
  }

  /**
    for components that want to be informed about suggestions from service
    @return list of suggested cards (KNode[]) sorted by similarity_quotient in a decreasing direction
  */
  getSuggestions():Observable<KNode[]>{
    return new Observable(this.suggestionsSubscriber.bind(this));
  }

  suggestionsReceivedObserver:any = {};//Observer

  suggestionsSubscriber(observer) { //:Observer) {
    console.log('suggestionsSubscriber');
    this.suggestionsReceivedObserver = observer;
    return {unsubscribe() {}};
  }

  suggestionsReceived(suggestions:KNode[]):void{

    console.log('DialoGameService::suggestionsReceived:', suggestions);

    // let suggestionsSorted
    let simQuots:any[] = this.suggestionsHistory[this.suggestionsHistory.length-1].dataContent.result.suggestions;
    for (var sqI:number = 0; sqI <simQuots.length; sqI++){ //Math.min(simQuots.length, DialoGameService.SUGGESTIONS_LIMIT)
      let id = simQuots[sqI].id;
      for(var sugI: number = 0; sugI < suggestions.length; sugI++){
        if(suggestions[sugI]._id == id){
           //TODO: check if this injection interfere with something; we put it this way for easier suggestiions debuging later. Based on this the compoenent will sort suggestions
          suggestions[sugI].dataContent.similarity_quotient = simQuots[sqI].similarity_quotient;
        }
      }
    }

    // let suggestionInfo = this.suggestionsHistory[this.suggestionsHistory.length-1];
    // let
    // dataContent.result.suggestions

    //emitting:
    this.suggestionsReceivedObserver.next(suggestions);

    //we call this when we want to finish:
    //this.suggestionsReceivedObserver.complete();
  }

  private getSuggestedCards():Observable<KNode[]>{
    console.log('getSuggestedCards');
    let result:Observable<KNode[]>;

    // if(forceRefresh || this.openingCards.length == 0){
      result = this.knalledgeNodeService.queryInMapofTypeForUser(DialoGameService.mapIdSDGs, SERVICE_CWC_SIMLARITIES_TYPE,this.rimaAAAService.getUserId())
      .pipe(
        tap(nodesFromServer => this.suggestedCardsReceived(nodesFromServer))
      );
      return result;
    // }
    // else{
    //   return of(this.openingCards);
    // }
  }

  /*
    format of the data: list of 5 elements in the format {cwc_card._id, similarity_quotient}
  output data the list is stored by creating a new knode
  node.type = 'service.result.dialogame.cwc_similarities'; mapId = MAP_ID
  node.dataContent.result = {suggestions : list, playRound : PLAY_ROUND; iAmId :
  AID}
  */
  private suggestedCardsReceived(suggestionNodes:KNode[]):void{ //KNode[]):void{
    console.log('[suggestedCardsReceived] suggestionNodes', suggestionNodes);
    let suggestionFound:boolean = false;
    if(suggestionNodes!== null && suggestionNodes!==undefined && suggestionNodes.length>0){
      //we get suggestions for all the rounds; extracting for the current round:
      for(var s:number = 0; s<suggestionNodes.length; s++){
        if(suggestionNodes[s]['dataContent']['result'].playRound === (this.colaboFlowService.colaboFlowState.playRound-1)){
          let suggestion:KNode  = suggestionNodes[s];
          console.log('[suggestedCardsReceived] suggestion (for the current round)', suggestion);
          suggestionFound = true;
          suggestion.dataContent.result.suggestions.sort((a,b)=> b.similarity_quotient - a.similarity_quotient); //descending sorting by similarity
          console.log('suggestedCardsReceived [after sorting]', suggestion.dataContent.result.suggestions);
  
          let suggestions:any[] = suggestion.dataContent.result.suggestions;
  
          this.suggestionsHistory.push(suggestion);
          console.log('suggestions',suggestions);
          let cardIds:string[] = [];
          for(var i:number=0; i< Math.min(suggestions.length, DialoGameService.SUGGESTIONS_LIMIT); i++){ //we limit number of cards to lower Net usage
            cardIds.push(suggestions[i].id);
          }
          if(cardIds.length){
            this.getCardsByIds(cardIds).subscribe(this.cardsByIdsReceived.bind(this));
          }else{
            this.cardsByIdsReceived([]);
          }
          //this.assignSuggestedCards()
          break;
        }
      }  
    }

    if(!suggestionFound){
      window.alert("We haven't found suggested cards for you yet");
    }
  }

  cardsByIdsReceived(nodes:any):void{
    console.log('cardsByIdsReceived', nodes);
    this.suggestionsReceived(nodes);
  }

  getCardsByIds(ids:string[]):Observable<KNode[]>{
    return this.knalledgeNodeService.queryByIds(ids);
    //mockup:
  }

  private assignSuggestedCards(nodes:any):void{ //KNode[]):void{
    //console.log('assignCards', nodes);
    this.openingCards = nodes;
  }

  getDecoratorTypes(type:string=null):Observable<KNode[]>{
    return of(CardDecorator.getDecorators(type));
  }

  // deleteDecorator(cardId:string, decorator:string):void{
  //   for(var i:number = 0; i < this.myCards.length; i++){
  //     if(this.myCards[i]._id === cardId){
  //       if(this.response !== null && 'decorators' in this.response){
  //         let decorators:any[] = this.response.decorators;
  //         return decorators.length > 0;
  //       }
  //     }
  //   }
  // }

  private getOpeningCards(forceRefresh:boolean = false):Observable<KNode[]>{
    let result:Observable<KNode[]>;
    if(forceRefresh || this.openingCards.length == 0){
      //TODO: check if 'mapIdSDGs' or 'mapId'
      result = this.knalledgeNodeService.queryInMapofType(DialoGameService.mapIdSDGs, DIALOGAME_OPENING_CARD_TYPE)
      .pipe(
        tap(nodesFromServer => this.assignOpenningCards(nodesFromServer))
      );
      return result;
    }
    else{
      return of(this.openingCards);
    }
  }

  private assignOpenningCards(nodes:any):void{ //KNode[]):void{
    //console.log('assignCards', nodes);
    this.openingCards = nodes;
  }

  private getOpeningCardsMockup():Observable<KNode[]>{
    let cards:KNode[] = [];
    let card:KNode;
    for(var i:number = 0; i<17;i++){
      card = new KNode();
      card.name = "How the future looks when this goal is fulfilled?";
      if(card.dataContent === null){ card.dataContent = {};}
      card.dataContent.img = "assets/images/sdgs/s/sdg" + (i+1) + '.jpg';
      cards.push(card);
    }
    //console.log('getOpeningCards', cards);
    return of(cards);
  }

  cardSelected(cards: KNode[]){
    if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD){
      //let response:DialoGameResponse = this.lastResponse;
      //this.responses.push(response);
      if(this.lastResponse === null || this.lastResponse === undefined){
        window.alert('please refresh the page in browser');
      }
      this.lastResponse.challengeCards = cards;
      this.colaboFlowService.setMyColaboFlowStateInner(MyColaboFlowStates.CHOSING_RESPONSE_CARD);
    }
    else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_RESPONSE_CARD){
      //MyCards:
      this.lastResponse.responseCards = cards;
      this.colaboFlowService.setMyColaboFlowStateInner(MyColaboFlowStates.CHOSING_DECORATOR_TYPE);
    }
    else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR_TYPE){
      this.decoratorType = cards[0].name;
      //this.lastResponse.decorators.push(new CardDecorator(cards[0].name)); //TODO: hardcoded decoration of the last decorator
      this.colaboFlowService.setMyColaboFlowStateInner(MyColaboFlowStates.CHOSING_DECORATOR);
    }
    else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR){
      let decorators = this.lastResponse.decorators;
      let alreadyDecorated: boolean = false;
      for(var i:number = 0; i < decorators.length; i++){
          if(decorators[i].decorator === cards[0].name){
            alreadyDecorated = true;
          }
      }

      if(alreadyDecorated){
        alert('You have already added this decorator.');
      }else{
        let decorator:CardDecorator = new CardDecorator(cards[0].name);
        this.lastResponse.decorators.push(decorator);
        //this.lastResponse.decorators[this.lastResponse.decorators.length - 1].decorator = cards[0].name; //TODO: hardcoded decoration of the last decorator
        this.colaboFlowService.setMyColaboFlowStateInner(MyColaboFlowStates.CHOSING_DECORATOR_TYPE);
      }
    }
  }

  undo():MyColaboFlowStates{
    let state:MyColaboFlowStates = this.colaboFlowService.undo();
    if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD){
      this.initNewRound();
    }
    else if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_RESPONSE_CARD){
      //MyCards:
      this.lastResponse.responseCards = [];
    }
    return state;
  }

  waitingForNextRound():boolean{
    return this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.FINISHED;
  }

  playing():boolean{
    return !(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.FINISHED) && !(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.PREVIEWING);
  }

  previewing():boolean{
    return this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.PREVIEWING;
  }

  // private goToNextRound():void{
  //   //this.colaboFlowService.myColaboFlowState.nextState();
  //
  //   this.initNextRound();
  // }

  private initNewRound():void{
    console.log('initNewRound');
    this.lastResponse = new DialoGameResponse(this.rimaAAAService);
    this.lastResponse.player = this.rimaAAAService.getUser();

    this.colaboFlowService.myColaboFlowState_reset();
    this.colaboFlowService.myColaboFlowState_nextState();
    //this.colaboFlowService.colaboFlowState.nextState();
    this.lastResponse.playRound = this.colaboFlowService.colaboFlowState.playRound;
    console.log('initNewRound',MyColaboFlowState.stateName(this.colaboFlowService.myColaboFlowState.state));
    this.getCards().subscribe(function(result:any){});
    //subscribe(this.cardsReceived.bind(this));
  }

  saveDialoGameResponse():void{
    let dialoGameResponse:DialoGameResponse = this.lastResponse;
    //let node:KNode = new KNode();
    let node:KNode = dialoGameResponse.responseCards[0]; //TODO: cover cases when user respondes with more than 1 card
    //console.log('node from the response Card', node);

    node.mapId = DialoGameService.mapId;
    node.iAmId = dialoGameResponse.player._id;
    //node.name = playedCard.name;

    //node.type = DialoGameResponse.TYPE_DIALOGAME_RESPONSE; //TODO - so far we don't want to change the type to preserve 'topiChat.talk.chatMsg' that is being required still
  //  console.log('dialoGameResponse', JSON.stringify(dialoGameResponse));

    let edge:KEdge = new KEdge();
    edge.mapId = DialoGameService.mapId;
    edge.type = DialoGameResponse.TYPE_DIALOGAME_RESPONSE;
    // if(!('dataContent' in edge)) {edge.dataContent = {};}
    edge.dataContent.playRound = this.colaboFlowService.colaboFlowState.playRound;
    edge.sourceId = dialoGameResponse.challengeCards[0]._id; //TODO: cover cases when user responds on more than 1 card
    if(node.dataContent === null){ node.dataContent = {};}

    node.dataContent.dialoGameReponse = dialoGameResponse.toServerCopy();
    console.log('dialoGameResponse.toServerCopy',node.dataContent.dialoGameReponse);

    console.log('edge', edge);
    console.log('node', node);

    let nodeSaved = function(savedNode:KNode):void{
        let edgeSaved = function(edgeSaved:KEdge):void{
          console.log('KEdge of the played (Card) created');
          this.colaboFlowService.setMyColaboFlowStateInner(MyColaboFlowStates.FINISHED);
          this.responses.push(this.lastResponse);
          //this.goToNextRound();
        }
        console.log('KNode (Card) saved', savedNode);
        edge.targetId = savedNode._id; //dialoGameResponse.responseCards[0]._id; //TODO - do it after saving kNode (in the case kNode.state = VO.STATE_LOCAL -- not saved yet)
        this.knalledgeEdgeService.create(edge).subscribe(edgeSaved.bind(this));
    }
    if(node.state == VO.STATE_LOCAL){
      console.log('KNode is local - creating');
      this.knalledgeNodeService.create(node).subscribe(nodeSaved.bind(this));
    }
    else{
      console.log('KNode is synced - updating');
      this.knalledgeNodeService.update(node, KNode.UPDATE_TYPE_ALL, null).subscribe(nodeSaved.bind(this));
    }
  }

  canUndo():boolean{
    return (this.colaboFlowService.myColaboFlowState.state !== MyColaboFlowStates.CHOSING_CHALLENGE_CARD);
  }

  canFinish():boolean{
    return this.colaboFlowService.myColaboFlowState.isBasicMovePlayed();
  }
}
