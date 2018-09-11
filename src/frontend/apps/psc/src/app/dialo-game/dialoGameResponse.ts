import {DialoGameActionType} from './dialoGameAction';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

export const enum DialoGameResponseStatus{
    NOT_STARTED,
    CHALLENGE_CARD_CHOSEN,
    ACTION_CHOSEN,
    RESPONSE_CARD_CHOSEN,
    DECORATIONS_CHOSEN,
    FINISHED
}

export class DialoGameResponse{
  playerId:KNode;
  challengeCards:KNode[]; //the cards the player responses on. He can play/anser on multiple cards (uniting them, etc)
  responseCard:KNode;
  playRound:number;
  decorations:any[];
  actionType:DialoGameActionType;
  status:DialoGameResponseStatus;
}
