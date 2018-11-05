import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TopiChatClientsOrchestrationService, TopiChatClientsOrchestrationEvents, TopiChatPackage, ColaboPubSubPlugin } 
  from '../topiChat-clients-orchestration.service';

import {RimaAAAService} from '@colabo-rima/f-aaa';
import {KNode} from '@colabo-knalledge/f-core';

@Component({
  selector: 'topiChat-clients-orchestration-form',
  templateUrl: './clients-orchestration-form.component.html',
  styleUrls: ['./clients-orchestration-form.component.css']
})
export class TopiChatClientsOrchestrationForm implements OnInit {

  public messages = [
  ];
  public messageContent:string;

  constructor(
    protected rimaAAAService:RimaAAAService,
    private TopiChatClientsOrchestrationService: TopiChatClientsOrchestrationService
  ) {
  }

  ngOnInit() {
      // called on helo message
      function clientTalk(eventName, msg, tcPackage:TopiChatPackage) {
          console.log('[TopiChatClientsOrchestrationForm:clientTalk] Client id: %s', tcPackage.clientIdReciever);
          console.log('\t msg: %s', JSON.stringify(tcPackage.msg));
          this.messages.push(tcPackage.msg);
      }

      // registering system plugin
      let talkPluginOptions:ColaboPubSubPlugin = {
          name: "topiChat-talk-form",
          events: {}
      };
      talkPluginOptions.events[TopiChatClientsOrchestrationEvents.ChatMessage] = clientTalk.bind(this);
      this.TopiChatClientsOrchestrationService.registerPlugin(talkPluginOptions);
  }

  sendMessage(){
      let whoAmI:KNode = this.rimaAAAService.getUser();
      var msg:any = {
        meta: {
          timestamp: Math.floor(new Date().getTime() / 1000)
        },
        from: {
          name: whoAmI.name, // whoAmI.dataContent.firstName
          iAmId: this.rimaAAAService.getUserId()
        },
        content: {
          text: this.messageContent
        }
      };
      console.log('[TopiChatClientsOrchestrationForm:sendMessage] sending message: %s', this.messageContent);
      this.TopiChatClientsOrchestrationService.emit(TopiChatClientsOrchestrationEvents.ChatMessage, msg);
      this.messages.push(msg);
      this.messageContent = "";
  }
}
