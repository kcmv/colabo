import { Injectable } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import { RimaAAAService } from '@colabo-rima/f-aaa';
import {ColaboFlowService} from '@colabo-flow/f-core';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import { catchError, map, tap } from 'rxjs/operators';

import * as config from '@colabo-utils/i-config';

import {ColaboFlowTopiChatService, ColaboFlowTopiChatEvents, TopiChatPackage, ColaboPubSubPlugin} from '@colabo-flow/f-topichat';
import { Observable, of } from 'rxjs';

@Injectable()
export class SimilarityService {
  public static CWC_SIMILARITIES_TYPE:string = 'service.result.dialogame.cwc_similarities';
  static mapId = config.GetGeneral('mapId');
  public similarityRequestsSentNo: number = 0;
  public similarityRequestsReceivedNo: number = 0;

  private similarities:KNode[] = [];

  constructor(
    private colaboFlowService:ColaboFlowService,
    private rimaAAAService: RimaAAAService,
    private ColaboFlowTopiChatService: ColaboFlowTopiChatService,
    private knalledgeNodeService: KnalledgeNodeService
  ){
    this.init();
  }

  init() {
      // registering system plugin
      let colaboFlowPluginOptions:ColaboPubSubPlugin = {
          name: "similarity-service",
          events: {}
      };
      colaboFlowPluginOptions.events[ColaboFlowTopiChatEvents.ActionResponse] = this.actionResponseMsg.bind(this);
      this.ColaboFlowTopiChatService.registerPlugin(colaboFlowPluginOptions);
  }

  deleteAllSuggestions():Observable<any>{
    return this.knalledgeNodeService.destroyByTypeInMap(SimilarityService.CWC_SIMILARITIES_TYPE, SimilarityService.mapId);
  }

  sendRequestForSimilarityCalc():void{
    this.similarityRequestsReceivedNo = 0;
    this.similarityRequestsSentNo = 0;
    // deleting simialiriteis for the current round:
    // destroyByTypeInMap(SimilarityService.CWC_SIMILARITIES_TYPE, SimilarityService.mapId);
    this.rimaAAAService.getRegisteredUsers(SimilarityService.mapId).subscribe(this.usersReceived.bind(this));
  }

  usersReceived(users:any[]):void{
    for(var i:number = 0; i<users.length; i++){
      //TODO: requestSimilarity(users[i]._id), SimilarityService.mapId, this.colaboFlowService.colaboFlowState.playRound);
      let content:any = {
        action: 'get_sims_for_user',
        params: {
          mapId: SimilarityService.mapId,
          iAmId: users[i]._id,
          roundId: this.colaboFlowService.colaboFlowState.playRound // 1
        }
      };

      this.sendMessage(content);
      this.similarityRequestsSentNo++;
    }
  }

  sendMessage(content:any){
    let whoAmI:KNode = this.rimaAAAService.getUser();
    var msg:any = {
      meta: {
        timestamp: Math.floor(new Date().getTime() / 1000)
      },
      from: {
        name: whoAmI.name, // whoAmI.dataContent.firstName
        iAmId: this.rimaAAAService.getUserId()
      },
      content: content
    };
    console.log('[SimilarityService:sendMessage] sending message: %s', JSON.stringify(msg));
    this.ColaboFlowTopiChatService.emit(ColaboFlowTopiChatEvents.Action, msg);
    // this.messages.push(msg);
  }

  actionResponseMsg(eventName:string, msg:any, tcPackage:TopiChatPackage) {
      console.log('[SimilarityService:actionResponseMsg] tcPackage: %s', JSON.stringify(tcPackage));
      console.log('msg: %s', JSON.stringify(msg));
      this.similarityRequestsReceivedNo++;
      let action:string = msg.content.action;
      let params:string = msg.content.params;
      let result:string = msg.content.result;
      console.log("[SimilarityService:actionResponseMsg] Action: '%s' with params: %s and result:", action, JSON.stringify(params));
      console.log("\t %s", JSON.stringify(result));
      // this.messages.push(tcPackage.msg);
  }

  getSimilaritySuggestions(forceRefresh:boolean = true):Observable<KNode[]>{
    let result:Observable<KNode[]> ;
 
    if(forceRefresh || this.similarities.length == 0){
      result = this.knalledgeNodeService.queryInMapofType(SimilarityService.mapId, SimilarityService.CWC_SIMILARITIES_TYPE)
      .pipe(
        tap(nodesFromServer => this.assignSimilarities(nodesFromServer))
      );
      return result;
    }
    else{
      return of(this.similarities);
    }
  }

  assignSimilarities(similarities:any):void{
    this.similarities = similarities;
  }
}
