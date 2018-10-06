import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {DialoGameService} from '../dialo-game.service';
import {ColaboFlowService} from '@colabo-colaboflow/core/lib/colabo-flow.service';
import {ColaboFlowState, ColaboFlowStates} from '@colabo-colaboflow/core/lib/colaboFlowState';
import {MyColaboFlowState, MyColaboFlowStates} from '@colabo-colaboflow/core/lib/myColaboFlowState';

@Component({
  selector: 'dialogame-cards',
  templateUrl: './dialogame-cards.component.html',
  styleUrls: ['./dialogame-cards.component.css']
})
export class DialogameCardsComponent implements OnInit {

  cards:any[] = [];

  constructor(
    public snackBar: MatSnackBar,
    private dialoGameService: DialoGameService
  ) { }

  ngOnInit() {
    //TODO: to set-up based on state, later druing the game, upon restarting browser etc, the current state with some other cards should be set up
    this.dialoGameService.colaboFlowService.myColaboFlowState.state = MyColaboFlowStates.CHOSING_CHALLENGE_CARD;
    this.dialoGameService.colaboFlowService.loadCFState().subscribe(this.cFStateLoaded.bind(this));
  }

  cFStateLoaded(state:KNode):void{
    this.dialoGameService.getCards().subscribe(this.cardsReceived.bind(this));
    this.dialoGameService.getSuggestions().subscribe(this.suggestionsReceived.bind(this));
  }

  suggestionsReceived(suggestions:KNode[]):void{
    console.log('DialogameCardsComponent::suggestionsReceived',suggestions);
    suggestions.sort((a,b)=> b.dataContent.similarity_quotient - a.dataContent.similarity_quotient);  //descending sorting by similarity
    this.cardsReceived(suggestions.slice(0,Math.min(DialoGameService.SUGGESTIONS_LIMIT,suggestions.length))); //TODO: it already cut in DialoGameService for bandwidth reasons, yet here we want to cut it for display resaons
  }

  cardsReceived(cards:KNode[]):void{
    console.log('cardsReceived', cards);
    this.cards = cards;
  }

  getStatus():string{
    if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD){
      if(this.dialoGameService.colaboFlowService.colaboFlowState.state === ColaboFlowStates.OPENNING){
        return "Start the dialogue by choosing a question that the dreaming you've done might answer on";
      }else{
        return 'Our Colabo.Space system found these cards played by your co-creators in the previous round best fitting you';
      }

    }
    else if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_RESPONSE_CARD){
      return 'These are your cards to respond';
    }
    else if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR_TYPE){
      if(this.dialoGameService.lastResponse.decorators.length === 0){
          return 'You can decorate your card';
      }else{
        return 'You can continue decorating your card or you can Finish and send it';
      }
    }
    else if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR){
      return 'You have chosen type of decoration';
    }
    return '';
  }

  getAction():string{
    if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD){
      return 'Click the one you want to reply on';
    }
    else if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_RESPONSE_CARD){
      return 'Click the one you want to play';;
    }
    else if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR_TYPE){
      return 'Choose type of decoration';
    }
    else if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_DECORATOR){
      return 'Now choose the specific decoration';
    }
    return '';

  }

  onClick(event:any, card:KNode):void {
    console.log("onClicked",event, card);
    let msg = '';
    if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD){
      msg = "You've selected the challenge card.";
    }
    else if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_RESPONSE_CARD){
      msg = "You've selected your card.";
    }
    // else if(this.dialoGameService.lastResponse !== null && this.dialoGameService.lastResponse.state.state === MyColaboFlowStates.DECORATOR_TYPE_CHOSEN){
    //   msg = "You've selected your card.";
    // }

    let action = '';
    if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_CHALLENGE_CARD){
      action = "Choose your response card!";
    }
    else if(this.dialoGameService.colaboFlowService.myColaboFlowState.state === MyColaboFlowStates.CHOSING_RESPONSE_CARD){
      action = "Choose a decorator for your action";
    }
    // else if(this.dialoGameService.lastResponse !== null && this.dialoGameService.lastResponse.state.state === MyColaboFlowStates.DECORATOR_TYPE_CHOSEN){
    //   action = "You've selected your card.";
    // }

    this.openSnackBar(msg,action);

    this.dialoGameService.cardSelected([card]); //TODO
    this.dialoGameService.getCards().subscribe(this.cardsReceived.bind(this));
  }

  openSnackBar(message: string, action: string) {
    // this.snackBar.open(message, action, {
    //     duration: 3000,
    //   }
    // );
  }

}
