import { Injectable } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {VO} from '@colabo-knalledge/knalledge_core/code/knalledge/VO';
import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {DialoGameResponse} from './dialo-game-response/dialoGameResponse';
import {ColaboFlowService} from '../colabo-flow/colabo-flow.service';
import {ColaboFlowState, ColaboFlowStates} from '../colabo-flow/colaboFlowState';
import {MyColaboFlowState, MyColaboFlowStates} from '../colabo-flow/myColaboFlowState';
import {CardDecorator} from './card-decorator/cardDecorator';
import { environment } from '../../environments/environment';
import { RimaAAAService } from '@colabo-rima/rima_aaa/rima-aaa.service';

export enum DialoGameActions{};

export const DIALOGAME_OPENING_CARD_TYPE:string = 'const.dialogame.opening-card';
export const TOPICHAT_MSG_TYPE:string = 'topiChat.talk.chatMsg';


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
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private rimaAAAService: RimaAAAService
  ) { }

  getMyCards(forceRefresh:boolean = false):Observable<KNode[]>{
    console.log('getMyCards');
    let result:Observable<KNode[]>;

    if(forceRefresh || this.myCards.length == 0){
      result = this.knalledgeNodeService.queryInMapofTypeForUser(environment.mapId, TOPICHAT_MSG_TYPE, "5b97c7ab0393b8490bf5263c") //TODO!! set regular user
      .pipe(
        tap(nodesFromServer => this.assignOpenningCards(nodesFromServer))
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
    //console.log('assignCards', nodes);
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
    //console.log('getOpeningCards', cards);
    return of(cards);
  }

  // challengeCardSelected
  cardSelected(cards: KNode[]){
  //TODO:
    if(this.colaboFlowService.colaboFlowState.state === ColaboFlowStates.OPENNING){
      if(this.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD){ //OPENING CARD IS CHOSEN:
        let response:DialoGameResponse = new DialoGameResponse();
        response.player = this.rimaAAAService.getUser();
        response.playRound = this.colaboFlowService.colaboFlowState.playRound;

        //TODO:
        if(response.player === null){
        console.warn('NOT LOGGED IN - DEMO USER USED');
         response.player = KNode.factory(
           {
              "_id" : "5b97c7ab0393b8490bf5263c",
              "name" : "Test",
              "type" : "rima.user",
              "iAmId" : "556760847125996dc1a4a24f",
              "ideaId" : 0,
              "dataContent" : {
                  "hash" : "b4523dcbb2c79cb2347abfe3ac1d10d5d831abd664909d7c45a9d296ab9ee96f701894fe29a702984e92ba4d2fa9cda552ab98e06da1244ce644e7866dd80d52",
                  "salt" : "480501a1e8fcf0f213a488489c10ea05",
                  "email" : "test_user@gmail.com",
                  "lastName" : "User",
                  "firstName" : "Test"
              },
              "mapId" : "5b96619b86f3cc8057216a03",
              "updatedAt" : "2018-09-11T13:48:27.641+0000",
              "createdAt" : "2018-09-11T13:48:27.624+0000",
              "visual" : {
                  "isOpen" : false
              },
              "isPublic" : true,
              "version" : 1,
              "activeVersion" : 1,
              "__v" : 0
            }
         )
        }


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

  saveDialoGameResponse():void{
    let dialoGameResponse:DialoGameResponse = this.lastResponse;
    //let node:KNode = new KNode();
    let node:KNode = dialoGameResponse.responseCards[0]; //TODO: cover cases when user respondes with more than 1 card
    //console.log('node from the response Card', node);

    node.mapId = environment.mapId;
    node.iAmId = dialoGameResponse.player._id;
    //node.name = playedCard.name;

    //node.type = DialoGameResponse.TYPE_DIALOGAME_RESPONSE; //TODO - so far we don't want to change the type to preserve 'topiChat.talk.chatMsg' that is being required still
    console.log('dialoGameResponse', JSON.stringify(dialoGameResponse));

    let edge:KEdge = new KEdge();
    edge.mapId = environment.mapId;
    edge.type = DialoGameResponse.TYPE_DIALOGAME_RESPONSE;
    edge.sourceId = dialoGameResponse.challengeCards[0]._id; //TODO: cover cases when user responds on more than 1 card
    if(node.dataContent === null){ node.dataContent = {};}

    node.dataContent.dialoGameReponse = dialoGameResponse.toServerCopy();
    console.log('dialoGameResponse.toServerCopy',node.dataContent.dialoGameReponse);

    console.log('edge', edge);
    console.log('node', node);

    let nodeSaved = function(savedNode:KNode):void{
        console.log('KNode (Card) saved', savedNode);
        edge.targetId = savedNode._id; //dialoGameResponse.responseCards[0]._id; //TODO - do it after saving kNode (in the case kNode.state = VO.STATE_LOCAL -- not saved yet)
        this.knalledgeEdgeService.create(edge).subscribe(function(result){
            console.log('KEdge of the played (Card) created');
        });
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
