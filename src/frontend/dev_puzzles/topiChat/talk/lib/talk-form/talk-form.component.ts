import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {TopiChatTalkService, TopiChatTalkEvents, TopiChatPackage, ColaboPubSubPlugin} from '../topiChat-talk.service';

import {RimaAAAService} from '@colabo-rima/rima_aaa';
import {KNode} from '@colabo-knalledge/knalledge_core';

@Component({
  selector: 'topiChat-talk-form',
  templateUrl: './talk-form.component.html',
  styleUrls: ['./talk-form.component.css']
})
export class TopiChatTalkForm implements OnInit {

  public messages = [
  ];
  public messageContent:string;

  constructor(
    protected rimaAAAService:RimaAAAService,
    private TopiChatTalkService: TopiChatTalkService
  ) {
  }

  ngOnInit() {
      // called on helo message
      function clientTalk(eventName, msg, tcPackage:TopiChatPackage) {
          console.log('[TopiChatTalkForm:clientTalk] Client id: %s', tcPackage.clientIdReciever);
          console.log('\t msg: %s', JSON.stringify(tcPackage.msg));
          this.messages.push(tcPackage.msg);
      }

      // registering system plugin
      let talkPluginOptions:ColaboPubSubPlugin = {
          name: "topiChat-talk-form",
          events: {}
      };
      talkPluginOptions.events[TopiChatTalkEvents.ChatMessage] = clientTalk.bind(this);
      this.TopiChatTalkService.registerPlugin(talkPluginOptions);
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
      console.log('[TopiChatTalkForm:sendMessage] sending message: %s', this.messageContent);
      this.TopiChatTalkService.emit(TopiChatTalkEvents.ChatMessage, msg);
      this.messages.push(msg);
      this.messageContent = "";
  }
}
