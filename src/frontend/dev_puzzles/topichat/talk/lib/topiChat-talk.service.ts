const MODULE_NAME: string = "@colabo-topichat/f-talk";

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { TopiChatCoreService, TopiChatPackage, TopiChatPluginPackage} from '@colabo-topichat/f-core';
import {ColaboPubSubPlugin, ColaboPubSub} from '@colabo-utils/i-pub-sub';
import {KNode} from '@colabo-knalledge/f-core';

export {TopiChatPackage, ColaboPubSubPlugin};

// NOTE: this shouldn't be extended without a good reason
// IF you extend it, you need to extend the backend part of the puzzle
// to LISTEN to these new ports/events
enum TopiChatTalkPorts {
  System = 'tc:talk-system',
  Defualt = 'tc:talk-default'
}

// These ports are the ports you should change and extend
enum TopiChatTalkSystemPorts {
  Init = 'system:init'
}
// These ports are the ports you should change and extend
enum TopiChatTalkDefaultPorts {
  Chat = 'default:chat'
}

export interface TopiChatTalkSystemPayload {
  from: {
    name: string; // whoAmI.dataContent.firstName
    iAmId: string;
  };
  content: {
    text: string;
  };
}

export interface TopiChatTalkDefaultPayload {
  from: {
    name: string; // whoAmI.dataContent.firstName
      iAmId: string;
  };
  content: {
    text: string;
  };
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
    function systemInit(port, msg, tcPackage:TopiChatPackage) {
        console.log('[TopiChatTalkService:systemInit] Client id: %s', tcPackage.clientIdReciever);
        this.clientInfo.clientId = tcPackage.clientIdReciever;
    }
    // called on helo message
    function clientMessage(port, msg, tcPackage:TopiChatPackage) {
        console.log('[TopiChatTalkService:clientMessage] Client id: %s', tcPackage.clientIdReciever);
        console.log('\t msg: %s', JSON.stringify(tcPackage.msg));
    }

    // registering chat plugin to topichat
    let chatPluginOptions:any = {
      name: MODULE_NAME,
      events: {}
    };
    chatPluginOptions.events[TopiChatTalkPorts.System] = systemInit.bind(this);
    chatPluginOptions.events[TopiChatTalkPorts.Defualt] = clientMessage.bind(this);
    this.topiChatCoreService.registerPlugin(chatPluginOptions);

    let whoAmI:KNode = this.rimaAAAService.getUser();
    var initPayload: TopiChatTalkSystemPayload = {
      from: {
        name: whoAmI.name, // whoAmI.dataContent.firstName
        iAmId: this.rimaAAAService.getUserId()
      },
      content: {
        text: whoAmI.name + '(' + this.rimaAAAService.getUserId() + ') connected!'
      }
    };

    let talkPackage: TopiChatPluginPackage = {
      port: TopiChatTalkSystemPorts.Init,
      payload: initPayload
    };

    this.topiChatCoreService.emit(TopiChatTalkPorts.System, talkPackage);
  }

  /**
    * Emits message through the port
    * @param  {string} port [description]
    * @param  {Object} msg - message to be sent
    * @return {TopiChatTalkService}
    */
  emit(port, msg, clientIdReciever?:string) {
    this.topiChatCoreService.emit(port, msg, clientIdReciever);
  }

  registerPlugin(pluginOptions:ColaboPubSubPlugin){
    this.topiChatCoreService.registerPlugin(pluginOptions);
  }
}