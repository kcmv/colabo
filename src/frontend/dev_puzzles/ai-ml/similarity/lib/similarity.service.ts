import { Injectable } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import { RimaAAAService } from '@colabo-rima/rima_aaa';
import {ColaboFlowService} from '@colabo-colaboflow/core';

@Injectable()
export class SimilarityService {
  constructor(
    private colaboFlowService:ColaboFlowService,
    private rimaAAAService: RimaAAAService
  ){

  }

  static MAP_ID = "5b96619b86f3cc8057216a03"; //PSC (PTW2018)

  sendRequestForSimilarityCalc():void{
    this.rimaAAAService.getRegisteredUsers(SimilarityService.MAP_ID).subscribe(this.usersReceived.bind(this));
  }

  usersReceived(users:any[]):void{
    for(var i:number = 0; i<users.length; i++){
      //requestSimilarity(users[i]._id), SimilarityService.MAP_ID, this.colaboFlowService.colaboFlowState.playRound);
    }
  }
}
