import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {TopiChatCoreService, TopiChatPackage} from '@colabo-topichat/f-core';
import {ColaboPubSubPlugin, ColaboPubSub} from '@colabo-utils/i-pub-sub';
import {KNode} from '@colabo-knalledge/f-core';

export {TopiChatPackage, ColaboPubSubPlugin};

export enum TopiChatTalkEvents{
	ChatInit = 'tc:chat-init',
	ChatMessage = 'tc:chat-message'
}

import {RimaAAAService} from '@colabo-rima/f-aaa';

@Injectable()
export class TopiChatTalkService{

  protected serverPubSub: ColaboPubSub;
  protected _isActive:boolean = true;

  constructor(
    protected rimaAAAService:RimaAAAService,
    protected topiChatCoreService:TopiChatCoreService
    ) {
      this.init();
  }

  /**
    * Initializes service
    */
  init() {
      if(!this._isActive) return;

      // called on init message
      function chatInit(eventName, msg, tcPackage:TopiChatPackage) {
          console.log('[TopiChatTalkService:chatInit] Client id: %s', tcPackage.clientIdReciever);
          this.clientInfo.clientId = tcPackage.clientIdReciever;
      }
      // called on helo message
      function clientMessage(eventName, msg, tcPackage:TopiChatPackage) {
          console.log('[TopiChatTalkService:clientMessage] Client id: %s', tcPackage.clientIdReciever);
          console.log('\t msg: %s', JSON.stringify(tcPackage.msg));
      }

      // registering chat plugin
      let chatPluginOptions:any = {
          name: "topiChat-talk",
          events: {}
      };
      chatPluginOptions.events[TopiChatTalkEvents.ChatInit] = chatInit.bind(this);
      chatPluginOptions.events[TopiChatTalkEvents.ChatMessage] = clientMessage.bind(this);
      this.topiChatCoreService.registerPlugin(chatPluginOptions);

      let whoAmI:KNode = this.rimaAAAService.getUser();
      var msg:any = {
        meta: {
          timestamp: Math.floor(new Date().getTime() / 1000),
        },
        from: {
          name: whoAmI.name, // whoAmI.dataContent.firstName
          iAmId: this.rimaAAAService.getUserId()
        },
        content: {
          text: "(Init) Hello from client!"
        }
      };

      this.topiChatCoreService.emit(TopiChatTalkEvents.ChatMessage, msg);
  }

  /**
    * Emits message through the eventName
    * @param  {string} eventName [description]
    * @param  {Object} msg - message to be sent
    * @return {TopiChatTalkService}
    */
  emit(eventName, msg, clientIdReciever?:string) {
    this.topiChatCoreService.emit(eventName, msg, clientIdReciever);
  }

  registerPlugin(pluginOptions:ColaboPubSubPlugin){
    this.topiChatCoreService.registerPlugin(pluginOptions);
  }
}