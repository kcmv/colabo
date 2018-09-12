import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {DialoGameService} from '../dialo-game.service';
import {ColaboFlowService} from '../../colabo-flow/colabo-flow.service';
import {ColaboFlowState, ColaboFlowStates} from '../../colabo-flow/colaboFlowState';
import {MyColaboFlowState, MyColaboFlowStates} from '../../colabo-flow/myColaboFlowState';


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
    this.dialoGameService.getCards().subscribe(this.cardsReceived.bind(this));
  }

  cardsReceived(cards:KNode[]):void{
    this.cards = cards;
  }

  getStatus():string{
    if(this.dialoGameService.lastResponse === null || this.dialoGameService.lastResponse.state.state === MyColaboFlowStates.NOT_STARTED){
      return 'We\'ve found these performance cards for you.';
    }
    if(this.dialoGameService.lastResponse != null || this.dialoGameService.lastResponse.state.state === MyColaboFlowStates.CHALLENGE_CARD_CHOSEN){
      return 'These are your cards to respond';
    }
    return '';
  }

  getAction():string{
    if(this.dialoGameService.lastResponse === null || this.dialoGameService.lastResponse.state.state === MyColaboFlowStates.NOT_STARTED){
      return 'Click the one you want to reply on';
    }
    if(this.dialoGameService.lastResponse != null || this.dialoGameService.lastResponse.state.state === MyColaboFlowStates.CHALLENGE_CARD_CHOSEN){
      return 'Click the one you want to play';;
    }
    return '';

  }


  onClick(event:any, card:KNode):void {
    console.log("onClicked",event, card);
    let msg = '';
    if(this.dialoGameService.lastResponse === null || this.dialoGameService.lastResponse.state.state === MyColaboFlowStates.NOT_STARTED){
      msg = "You've selected the challenge card.";
    }
    if(this.dialoGameService.lastResponse !== null && this.dialoGameService.lastResponse.state.state === MyColaboFlowStates.CHALLENGE_CARD_CHOSEN){
      msg = "You've selected your card.";
    }

    let action = '';
    if(this.dialoGameService.lastResponse === null || this.dialoGameService.lastResponse.state.state === MyColaboFlowStates.NOT_STARTED){
      action = "Choose your response card!";
    }
    if(this.dialoGameService.lastResponse !== null && this.dialoGameService.lastResponse.state.state === MyColaboFlowStates.CHALLENGE_CARD_CHOSEN){
      action = "Choose a decorator for your action";
    }

    this.openSnackBar(msg,action);

    this.dialoGameService.cardSelected([card]); //TODO
    this.dialoGameService.getCards().subscribe(this.cardsReceived.bind(this));
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
        duration: 2000,
      }
    );
  }

}
