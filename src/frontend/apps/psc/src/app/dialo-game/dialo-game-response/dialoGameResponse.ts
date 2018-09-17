import {CardDecorator} from '../card-decorator/cardDecorator';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {MyColaboFlowState} from '../../colabo-flow/myColaboFlowState';

export class DialoGameResponse{

  static TYPE_DIALOGAME_RESPONSE = "dialogame.response";
  player:KNode;
  challengeCards:KNode[] = []; //the cards the player responses on. He can play/anser on multiple cards (uniting them, etc)
  responseCards:KNode[] = [];  //the cards the player responses with. He can play/anser multiple cards
  playRound:number;
  decorators:CardDecorator[] = [];
  //state:MyColaboFlowState;

  constructor(){
    //this.state = new MyColaboFlowState();
  }

  toServerCopy():any {
  	let dialoGameResponseFS:any = {};
    dialoGameResponseFS.decorators = [];
    for(let i in this.decorators){
      dialoGameResponseFS.decorators.push(this.decorators[i].decorator);
    }
    dialoGameResponseFS.challengeCards = []
    for(let i in this.challengeCards){
      dialoGameResponseFS.challengeCards.push(this.challengeCards[i]._id);
    }
    dialoGameResponseFS.playRound = this.playRound;

  	// if (this.dataContent && this.dataContent.rima && this.dataContent.rima.whats) {
  	// 	let whats = this.dataContent.rima.whats;
  	// 	this.dataContent.rima.whats = [];
  	// }
  	// /* copying all non-system and non-function properties */
    // let id;
  	// for (id in this) {
  	// 	if (id[0] === '$') continue;
  	// 	if (id === 'parents' || id === 'children') continue;
  	// 	if (id === 'parentsLinks' || id === 'childrenLinks' || id === 'tree' || id === 'what' || id === 'user') continue; //Ontov local objects
  	// 	if (typeof this[id] == 'function') continue;
  	// 	//console.log("cloning: %s", id);
  	// 	if (this[id] !== undefined) { //JSON.parse breaks at "undefined"
  	// 		dialoGameResponseFS[id] = (JSON.parse(JSON.stringify(this[id])));
  	// 	}
  	// }
  	// if (whats) {
  	// 	let whatsNew = [];
  	// 	/* copying all non-system and non-function properties */
  	// 	for (let wI in whats) {
  	// 		let what = whats[wI];
  	// 		let whatNew = {};
  	// 		whatsNew.push(whatNew);
  	// 		for (id in what) {
  	// 			if (id[0] == '$') continue;
  	// 			if (typeof what[id] == 'function') continue;
  	// 			//console.log("cloning: %s", id);
  	// 			whatNew[id] = (JSON.parse(JSON.stringify(what[id])));
  	// 		}
  	// 	}
  	// 	this.dataContent.rima.whats = whats;
  	// 	dialoGameResponseFS.dataContent.rima.whats = whatsNew;
  	// }
    //
    // //TODO:NG2: done in super(), but overriden in the current method
  	// /* deleting properties that should be set created to default value on server */
  	// if (dialoGameResponseFS.createdAt === undefined || dialoGameResponseFS.createdAt === null) {
  	// 	delete dialoGameResponseFS.createdAt;
  	// }
  	// if (dialoGameResponseFS.updatedAt === undefined || dialoGameResponseFS.updatedAt === null) {
  	// 	delete dialoGameResponseFS.updatedAt;
  	// }
    //
  	// if (dialoGameResponseFS.state == VO.STATE_LOCAL) {
  	// 	delete dialoGameResponseFS._id;
  	// }
    //
  	// /* deleting local-frontend parameters */
  	// delete dialoGameResponseFS.state;

  	return dialoGameResponseFS;
  }
}
