const MODULE_NAME:string = "@colabo-topichat/f-talk";

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TopiChatTalkService, TopiChatTalkEvents, TopiChatTalkDefaultEvents,
  TopiChatTalkDefaultPayload, TopiChatPluginPackage,
   TopiChatPackage, ColaboPubSubPlugin} from '../topiChat-talk.service';

import {RimaAAAService} from '@colabo-rima/f-aaa';
import {KNode} from '@colabo-knalledge/f-core';
import { GetPuzzle } from '@colabo-utils/i-config';

enum InfoMsgType {
  Info = 'info',
  Warning = 'warning',
  Error = 'error'
}

interface InfoMsg {
  type: InfoMsgType;
  title: string;
  msg: string;
}

enum StatusesStatesLabels {
  InfoEnoughOfMessages = 'infoEnoughOfMessages',
  ErrorFullMessages = 'errorFullMessages'
}

@Component({
  selector: 'topiChat-talk-form',
  templateUrl: './talk-form.component.html',
  styleUrls: ['./talk-form.component.css']
})

export class TopiChatTalkForm implements OnInit {
  public statusesStates:any = {
  };

  public messages = [
  ];
  
  public infos:any = {};

  public messageContent:string;
  protected puzzleConfig: any;

  constructor(
    protected rimaAAAService:RimaAAAService,
    private topiChatTalkService: TopiChatTalkService
  ) {
  }

  ngOnInit() {
    this.puzzleConfig = GetPuzzle(MODULE_NAME);
    
    for (let infoTypeId in InfoMsgType){
      let infoType: string = InfoMsgType[infoTypeId];
      this.infos[infoType] = [];
    }

    // registering system plugin
    let talkPluginOptions:ColaboPubSubPlugin = {
        name: "topiChat-talk-form",
        events: {}
    };
    talkPluginOptions.events[TopiChatTalkDefaultEvents.Chat] = this.receiveMessage.bind(this);
    this.topiChatTalkService.registerPlugin(TopiChatTalkEvents.Defualt, talkPluginOptions);
    
    this.addInfo({
      type: InfoMsgType.Info,
      title: 'NOTE:',
      msg: 'You should provide between 3 and 5 toughts'
    });
  }
  
  clearInfos(type: string) {
    this.infos[type].length = 0;
  }

  addInfo(info: InfoMsg){
    this.infos[info.type].push(info);
  }

  scrollToBottom() {
    // https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
    // https://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation
    let scrolling_content = document.querySelector("#scrolling_content");
    scrolling_content.scrollTo(0, scrolling_content.scrollHeight);
  }
  
  addMessage(msg){
    if (this.messages.length+1 === this.puzzleConfig.messagesNumberMin && !this.statusesStates[StatusesStatesLabels.InfoEnoughOfMessages]){
      this.addInfo({
        type: InfoMsgType.Info,
        title: 'NOTE:',
        msg: 'You provided minimum of messages'
      });
      this.statusesStates[StatusesStatesLabels.InfoEnoughOfMessages] = true;
    }
    if (this.messages.length >= this.puzzleConfig.messagesNumberMax) {
      if(!this.statusesStates[StatusesStatesLabels.ErrorFullMessages]){
        this.addInfo({
          type: InfoMsgType.Error,
          title: 'ERROR:',
          msg: 'You reached the maximum of messages, you cannot add more'
        });
        this.statusesStates[StatusesStatesLabels.ErrorFullMessages] = true;
      }
      return;
    }
    this.messages.push(msg);

  }

  receiveMessage(eventName, talkPluginPackage: TopiChatPluginPackage, tcPackage: TopiChatPackage) {
    // console.log('[TopiChatTalkForm:clientTalk] Client id: %s', tcPackage.clientIdReciever);
    console.log('\t talkPluginPackage: %s', JSON.stringify(talkPluginPackage));
    console.log('\t tcPackage: %s', JSON.stringify(tcPackage));
    // TODO: See about this
    // Provide config, to decide about showing etc
    // currently is used as CWC and we do not show it
    // this.messages.push(tcPackage.payload);
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
    this.addMessage(msgPayload);
    this.messageContent = "";
    
    this.scrollToBottom();
    // do it again after adding and rendering content
    setTimeout(this.scrollToBottom.bind(this), 100);
  }
}
