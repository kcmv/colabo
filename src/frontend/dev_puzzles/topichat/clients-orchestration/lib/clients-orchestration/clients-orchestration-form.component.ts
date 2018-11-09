import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {
  TopiChatClientsOrchestrationService, TopiChatClientsOrchestrationEvents, TopiChatClientsOrchestrationDefaultEvents, TopiChatClientsOrchestrationDefaultPayload, TopiChatPluginPackage,
  TopiChatPackage, ColaboPubSubPlugin } 
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
    private topiChatCOrchestrationService: TopiChatClientsOrchestrationService
  ) {
  }

  ngOnInit() {
    // called on helo message
    function clientTalk(eventName, cOrchestrationPluginPackage: TopiChatPluginPackage, tcPackage: TopiChatPackage) {
      // console.log('[TopiChatClientsOrchestrationForm:clientTalk] Client id: %s', tcPackage.clientIdReciever);
      console.log('\t cOrchestrationPluginPackage: %s', JSON.stringify(cOrchestrationPluginPackage));
      console.log('\t tcPackage: %s', JSON.stringify(tcPackage));
      let msgPayload: TopiChatClientsOrchestrationDefaultPayload = cOrchestrationPluginPackage.payload;
      switch(eventName){
        case TopiChatClientsOrchestrationDefaultEvents.Chat:
          this.messages.push(msgPayload);
          break;
        case TopiChatClientsOrchestrationDefaultEvents.ChatReport:
            console.log("[TopiChatClientsOrchestrationForm:clientTalk] msg: '%s' is saved under _id:'%s'", 
              (<any>msgPayload).receivedText, (<any>msgPayload)._id);
          break;
      }
    }

    function clientNotification(eventName, cOrchestrationPluginPackage: TopiChatPluginPackage, tcPackage: TopiChatPackage) {
      // console.log('[TopiChatClientsOrchestrationForm:clientTalk] Client id: %s', tcPackage.clientIdReciever);
      console.log('\t cOrchestrationPluginPackage: %s', JSON.stringify(cOrchestrationPluginPackage));
      console.log('\t tcPackage: %s', JSON.stringify(tcPackage));
      let msgPayload: TopiChatClientsOrchestrationDefaultPayload = cOrchestrationPluginPackage.payload;
      this.messages.push(msgPayload);
    }
    // registering system plugin
    let talkPluginOptions:ColaboPubSubPlugin = {
      name: "topiChat-client-orchestration-form",
        events: {}
    };
    talkPluginOptions.events[TopiChatClientsOrchestrationDefaultEvents.Chat] = clientTalk.bind(this);
    talkPluginOptions.events[TopiChatClientsOrchestrationDefaultEvents.ChatReport] = clientTalk.bind(this);
    talkPluginOptions.events[TopiChatClientsOrchestrationDefaultEvents.Notification] = clientNotification.bind(this);
    this.topiChatCOrchestrationService.registerPlugin(TopiChatClientsOrchestrationEvents.Defualt, talkPluginOptions);
  }

  sendMessage(){
      let whoAmI:KNode = this.rimaAAAService.getUser();
    var msgPayload: TopiChatClientsOrchestrationDefaultPayload = {
        from: {
          name: whoAmI.name, // whoAmI.dataContent.firstName
          iAmId: this.rimaAAAService.getUserId()
        },
        content: {
          text: this.messageContent,
          debugText: null
        }
      };
      console.log('[TopiChatClientsOrchestrationForm:sendMessage] sending message: %s', this.messageContent);
      this.topiChatCOrchestrationService.emit(TopiChatClientsOrchestrationEvents.Defualt, 
        TopiChatClientsOrchestrationDefaultEvents.Chat, msgPayload);
    this.messages.push(msgPayload);
      this.messageContent = "";
  }
}
