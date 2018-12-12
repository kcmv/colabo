const MODULE_NAME:string = "@colabo-topichat/f-talk";

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TopiChatTalkService, TopiChatTalkEvents, TopiChatTalkDefaultEvents,
  TopiChatTalkDefaultPayload, TopiChatPluginPackage,
   TopiChatPackage, ColaboPubSubPlugin} from '../topiChat-talk.service';

import {RimaAAAService} from '@colabo-rima/f-aaa';
import {KNode} from '@colabo-knalledge/f-core';
import { GetPuzzle } from '@colabo-utils/i-config';
import { UtilsNotificationService, NotificationMsgType, NotificationMsg } from '@colabo-utils/f-notifications';
import {Observable} from 'rxjs';

// https://www.npmjs.com/package/uuid
import * as uuidv1 from 'uuid/v1';

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
    private topiChatTalkService: TopiChatTalkService,
    protected utilsNotificationService: UtilsNotificationService
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
    this.generateInfos();
  }

  userName():string{
    return this.rimaAAAService.userName();
  }

  public userAvatar():Observable<string>{
    return RimaAAAService.userAvatar(this.rimaAAAService.getUser());
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
  
  generateInfos(){
    for (let infoTypeId in InfoMsgType) {
      let infoType: string = InfoMsgType[infoTypeId];
      this.clearInfos(infoType);
    }

    if (!this.statusesStates[StatusesStatesLabels.InfoEnoughOfMessages] && !this.statusesStates[StatusesStatesLabels.ErrorFullMessages]){
      this.addInfo({
        type: InfoMsgType.Info,
        title: 'NOTE:',
        msg: 'You should provide between 3 and 5 toughts'
      });
    }
    if (this.statusesStates[StatusesStatesLabels.InfoEnoughOfMessages] && !this.statusesStates[StatusesStatesLabels.ErrorFullMessages]){
      this.addInfo({
        type: InfoMsgType.Info,
        title: 'NOTE:',
        msg: 'You provided minimum of messages'
      });      
    }
    if (this.statusesStates[StatusesStatesLabels.ErrorFullMessages]){
      this.addInfo({
        type: InfoMsgType.Error,
        title: 'ERROR:',
        msg: 'You reached the maximum of messages, you cannot add more'
      });      
    }
  }

  addMessage(msg):boolean{
    if (this.messages.length+1 === this.puzzleConfig.messagesNumberMin && !this.statusesStates[StatusesStatesLabels.InfoEnoughOfMessages]){
      this.statusesStates[StatusesStatesLabels.InfoEnoughOfMessages] = true;
      this.generateInfos();
    }
    if (this.messages.length >= this.puzzleConfig.messagesNumberMax) {
      if(!this.statusesStates[StatusesStatesLabels.ErrorFullMessages]){
        this.statusesStates[StatusesStatesLabels.ErrorFullMessages] = true;
        this.generateInfos();
      }
      return false;
    }
    this.messages.push(msg)
    return true;

  }
  
  getMessageByUuid(uuid){
    for (let id: number = 0; id < this.messages.length; id++){
      let message: TopiChatTalkDefaultPayload = this.messages[id];
      if(message.content.uuid === uuid) return message;
    }
    return null;
  }

  receiveMessage(eventName, talkPluginPackage: TopiChatPluginPackage, tcPackage: TopiChatPackage) {
    // console.log('[TopiChatTalkForm:receiveMessage] Client id: %s', tcPackage.clientIdReciever);
    console.log('\t talkPluginPackage: %s', JSON.stringify(talkPluginPackage));
    console.log('\t tcPackage: %s', JSON.stringify(tcPackage));
    let uuid: string = talkPluginPackage.payload.uuid;
    console.log("Searching for uuid: ", uuid);
    let message: TopiChatTalkDefaultPayload = this.getMessageByUuid(uuid);
    console.log("Found message: ", message);
    message.content.delivered = true;
    
    // TODO: See about this
    // Provide config, to decide about showing etc
    // currently is used as CWC and we do not show it
    // this.messages.push(tcPackage.payload);
  }

  resendMessage(msgPayload: TopiChatTalkDefaultPayload){
    if(msgPayload.content.delivered){
      this.utilsNotificationService.addNotification({
        type: NotificationMsgType.Error,
        title: 'INFO:',
        msg: 'CWC is already delivered'
      });
    }
    this._sendMessage(msgPayload);
  }

  _sendMessage(msgPayload: TopiChatTalkDefaultPayload) {
    console.log("[TopiChatTalkForm:_sendMessage] sending message: '%s', with content", this.messageContent, JSON.stringify(msgPayload));
    this.topiChatTalkService.emit(TopiChatTalkEvents.Defualt, TopiChatTalkDefaultEvents.Chat, msgPayload);
  }

  sendMessage(){
    let whoAmI: KNode = this.rimaAAAService.getUser();
    let msgPayload: TopiChatTalkDefaultPayload = {
      from: {
        name: whoAmI.name, // whoAmI.dataContent.firstName
        iAmId: this.rimaAAAService.getUserId()      
      },
      content: {
        text: this.messageContent,
        debugText: '',
        delivered: false,
        uuid: uuidv1()
      }
    };
    let toSend: boolean = this.addMessage(msgPayload);
    if(toSend){
      this._sendMessage(msgPayload);
      this.messageContent = "";

      this.scrollToBottom();
      // do it again after adding and rendering content
      setTimeout(this.scrollToBottom.bind(this), 100);      
    }else{
      console.log("[TopiChatTalkForm:sendMessage] not sending message, reached the maximum of CWCs");      
    }
  }
}
