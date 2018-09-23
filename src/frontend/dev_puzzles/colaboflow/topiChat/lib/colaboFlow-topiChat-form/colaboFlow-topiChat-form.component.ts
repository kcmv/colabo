import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {ColaboFlowTopiChatService, ColaboFlowTopiChatEvents, TopiChatPackage, ColaboPubSubPlugin} from '../colaboFlow-topiChat.service';

import {RimaAAAService} from '@colabo-rima/rima_aaa';
import {KNode} from '@colabo-knalledge/knalledge_core';

@Component({
  selector: 'colaboFlow-topiChat-form',
  templateUrl: './colaboFlow-topiChat-form.component.html',
  styleUrls: ['./colaboFlow-topiChat-form.component.css']
})
export class ColaboFlowTopiChatForm implements OnInit {

  public messages = [
    {
      meta: {
        timestamp: "010101"
      },
      from: {
        name: "Саша"
      },
      content: {
        text: "Здраво, Колабо!"
      }
    },
    {
      meta: {
        timestamp: "010102"
      },
      from: {
        name: "Синиша"
      },
      content: {
        text: "Ћао, Колабо!"
      }
    },
    {
      meta: {
        timestamp: "010103"
      },
      from: {
        name: "Colabo"
      },
      content: {
        text: "Ћао, другари!"
      }
    }
  ];
  public messageContent:string;

  constructor(
    protected rimaAAAService:RimaAAAService,
    private ColaboFlowTopiChatService: ColaboFlowTopiChatService
  ) {
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

  sendMessage(action:string){
    let content:any = {
      action: action,
      params: {}
    };

    switch(action){
      case 'get_sims_for_user':
        content.params = {
          mapId: '5b96619b86f3cc8057216a03',
          iAmId: '5b9fbde97f07953d41256b32',
          roundId: 1
        };
        break;
      case 'get_sims':
        content.params = {
          mapId: '5b96619b86f3cc8057216a03'
        };
        break;
    }

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
    console.log('[ColaboFlowTopiChatForm:sendMessage] sending message: %s', this.messageContent);
    this.ColaboFlowTopiChatService.emit(ColaboFlowTopiChatEvents.Action, msg);
    this.messages.push(msg);
  }

  actionResponseMsg(eventName:string, msg:any, tcPackage:TopiChatPackage) {
      console.log('[ColaboFlowTopiChatForm:actionResponseMsg] tcPackage: %s', JSON.stringify(tcPackage));
      console.log('msg: %s', JSON.stringify(msg));
      let action:string = msg.content.action;
      let params:string = msg.content.params;
      let result:string = msg.content.result;
      console.log("[ColaboFlowTopiChatForm:actionResponseMsg] Action: '%s' with params: %s and result:", action, JSON.stringify(params));
      console.log("\t %s", JSON.stringify(result));
      this.messages.push(tcPackage.msg);
  }

}
