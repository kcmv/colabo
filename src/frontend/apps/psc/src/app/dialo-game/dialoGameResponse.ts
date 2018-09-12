import {DialoGameActionType} from './dialoGameAction';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {MyColaboFlowState} from '../colabo-flow/myColaboFlowState';

export class DialoGameResponse{
  player:KNode;
  challengeCards:KNode[]; //the cards the player responses on. He can play/anser on multiple cards (uniting them, etc)
  responseCards:KNode[];  //the cards the player responses with. He can play/anser multiple cards
  playRound:number;
  decorations:any[];
  actionType:DialoGameActionType;
  state:MyColaboFlowState;

  constructor(){
    this.state = new MyColaboFlowState();
  }
}
