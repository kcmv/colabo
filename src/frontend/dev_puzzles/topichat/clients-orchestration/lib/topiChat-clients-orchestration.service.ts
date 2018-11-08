import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {TopiChatCoreService, TopiChatPackage} from '@colabo-topichat/f-core';
import {ColaboPubSubPlugin, ColaboPubSub} from '@colabo-utils/i-pub-sub';
import {KNode} from '@colabo-knalledge/f-core';

export {TopiChatPackage, ColaboPubSubPlugin};

export enum TopiChatClientsOrchestrationEvents{
	ChatInit = 'tc:client-orchestrator-init',
	ChatMessage = 'tc:client-orchestrator-message'
}

import {RimaAAAService} from '@colabo-rima/f-aaa';

@Injectable()
export class TopiChatClientsOrchestrationService{

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
          console.log('[TopiChatClientsOrchestrationService:chatInit] Client id: %s', tcPackage.clientIdReciever);
          this.clientInfo.clientId = tcPackage.clientIdReciever;
      }
      // called on helo message
      function clientMessage(eventName, msg, tcPackage:TopiChatPackage) {
          console.log('[TopiChatClientsOrchestrationService:clientMessage] Client id: %s', tcPackage.clientIdReciever);
          console.log('\t payload: %s', JSON.stringify(tcPackage.payload));
      }

      // registering chat plugin
      let chatPluginOptions:any = {
          name: "topiChat-talk",
          events: {}
      };
      chatPluginOptions.events[TopiChatClientsOrchestrationEvents.ChatInit] = chatInit.bind(this);
      chatPluginOptions.events[TopiChatClientsOrchestrationEvents.ChatMessage] = clientMessage.bind(this);
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

      this.topiChatCoreService.emit(TopiChatClientsOrchestrationEvents.ChatMessage, msg);
  }

  /**
    * Emits message through the eventName
    * @param  {string} eventName [description]
    * @param  {Object} msg - message to be sent
    * @return {TopiChatClientsOrchestrationService}
    */
  emit(eventName, msg, clientIdReciever?:string) {
    this.topiChatCoreService.emit(eventName, msg, clientIdReciever);
  }

  registerPlugin(pluginOptions:ColaboPubSubPlugin){
    this.topiChatCoreService.registerPlugin(pluginOptions);
  }
}
