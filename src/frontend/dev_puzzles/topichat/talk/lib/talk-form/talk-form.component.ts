import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TopiChatTalkService, TopiChatTalkEvents, TopiChatTalkDefaultEvents,
  TopiChatTalkDefaultPayload, TopiChatPluginPackage,
   TopiChatPackage, ColaboPubSubPlugin} from '../topiChat-talk.service';

import {RimaAAAService} from '@colabo-rima/f-aaa';
import {KNode} from '@colabo-knalledge/f-core';

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
    private topiChatTalkService: TopiChatTalkService
  ) {
  }

  ngOnInit() {
      // called on helo message
    function clientTalk(eventName, talkPluginPackage: TopiChatPluginPackage, tcPackage: TopiChatPackage) {
      // console.log('[TopiChatTalkForm:clientTalk] Client id: %s', tcPackage.clientIdReciever);
      console.log('\t talkPluginPackage: %s', JSON.stringify(talkPluginPackage));
      console.log('\t tcPackage: %s', JSON.stringify(tcPackage));
      // TODO: See about this
      // Provide config, to decide about showing etc
      // currently is used as CWC and we do not show it
      // this.messages.push(tcPackage.payload);
    }

    // registering system plugin
    let talkPluginOptions:ColaboPubSubPlugin = {
        name: "topiChat-talk-form",
        events: {}
    };
    talkPluginOptions.events[TopiChatTalkDefaultEvents.Chat] = clientTalk.bind(this);
    this.topiChatTalkService.registerPlugin(TopiChatTalkEvents.Defualt, talkPluginOptions);
  }

  scrollToBottom() {
    // https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
    // https://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation
    let scrolling_content = document.querySelector("#scrolling_content");
    scrolling_content.scrollTo(0, scrolling_content.scrollHeight);
  }

  sendMessage(){
    let whoAmI:KNode = this.rimaAAAService.getUser();
    let msgPayload: TopiChatTalkDefaultPayload = {
      from: {
        name: whoAmI.name, // whoAmI.dataContent.firstName
        iAmId: this.rimaAAAService.getUserId()      
      },
      content: {
        text: this.messageContent,
        debugText: ''
      }
    };
    console.log('[TopiChatTalkForm:sendMessage] sending message: %s', this.messageContent);
    this.topiChatTalkService.emit(TopiChatTalkEvents.Defualt, TopiChatTalkDefaultEvents.Chat, msgPayload);
    this.messages.push(msgPayload);
    this.messageContent = "";
    
    this.scrollToBottom();
    // do it again after adding and rendering content
    setTimeout(this.scrollToBottom.bind(this), 100);
  }
}
