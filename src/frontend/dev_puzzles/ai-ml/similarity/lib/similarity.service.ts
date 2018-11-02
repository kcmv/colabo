import { Injectable } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import { RimaAAAService } from '@colabo-rima/f-aaa';
import {ColaboFlowService} from '@colabo-flow/f-core';

import {ColaboFlowTopiChatService, ColaboFlowTopiChatEvents, TopiChatPackage, ColaboPubSubPlugin} from '@colabo-flow/f-topichat';

@Injectable()
export class SimilarityService {
  constructor(
    private colaboFlowService:ColaboFlowService,
    private rimaAAAService: RimaAAAService,
    private ColaboFlowTopiChatService: ColaboFlowTopiChatService
  ){

  }

  ngOnInit() {
      // registering system plugin
      let colaboFlowPluginOptions:ColaboPubSubPlugin = {
          name: "colaboflow-topichat-form",
          events: {}
      };
      colaboFlowPluginOptions.events[ColaboFlowTopiChatEvents.ActionResponse] = this.actionResponseMsg.bind(this);
      this.ColaboFlowTopiChatService.registerPlugin(colaboFlowPluginOptions);
  }

  static MAP_ID = "5b96619b86f3cc8057216a03"; //PSC (PTW2018)
  public similarityRequestsSentNo:number = 0;
  public similarityRequestsReceivedNo:number = 0;

  sendRequestForSimilarityCalc():void{
    this.rimaAAAService.getRegisteredUsers(SimilarityService.MAP_ID).subscribe(this.usersReceived.bind(this));
  }

  usersReceived(users:any[]):void{
    for(var i:number = 0; i<users.length; i++){
      //TODO: requestSimilarity(users[i]._id), SimilarityService.MAP_ID, this.colaboFlowService.colaboFlowState.playRound);
      let content:any = {
        action: 'get_sims_for_user',
        params: {
          mapId: SimilarityService.MAP_ID, // '5b96619b86f3cc8057216a03',
          iAmId: users[i]._id,
          roundId: this.colaboFlowService.colaboFlowState.playRound // 1
        }
      };

      this.sendMessage(content);
      this.similarityRequestsSentNo = users.length;
      this.similarityRequestsReceivedNo = 0;
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
    console.log('[ColaboFlowTopiChatForm:sendMessage] sending message: %s', JSON.stringify(msg));
    this.ColaboFlowTopiChatService.emit(ColaboFlowTopiChatEvents.Action, msg);
    // this.messages.push(msg);
  }

  actionResponseMsg(eventName:string, msg:any, tcPackage:TopiChatPackage) {
      console.log('[ColaboFlowTopiChatForm:actionResponseMsg] tcPackage: %s', JSON.stringify(tcPackage));
      console.log('msg: %s', JSON.stringify(msg));
      let action:string = msg.content.action;
      let params:string = msg.content.params;
      let result:string = msg.content.result;
      console.log("[ColaboFlowTopiChatForm:actionResponseMsg] Action: '%s' with params: %s and result:", action, JSON.stringify(params));
      console.log("\t %s", JSON.stringify(result));
      // this.messages.push(tcPackage.msg);
  }
}
