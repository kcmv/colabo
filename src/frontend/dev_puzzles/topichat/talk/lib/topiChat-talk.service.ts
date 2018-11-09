const MODULE_NAME: string = "@colabo-topichat/f-talk";

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { TopiChatCoreService, TopiChatPackage, TopiChatPluginPackage} from '@colabo-topichat/f-core';
import { ColaboPubSubPlugin, ColaboPubSub, ColaboPubSubCluster} from '@colabo-utils/i-pub-sub';
import {KNode} from '@colabo-knalledge/f-core';

export { TopiChatPackage, ColaboPubSubPlugin, TopiChatPluginPackage};

// NOTE: this shouldn't be extended without a good reason
// IF you extend it, you need to extend the backend part of the puzzle
// to LISTEN to these new events
export enum TopiChatTalkEvents {
  System = 'tc:talk-system',
  Defualt = 'tc:talk-default'
}

// These events are the events you should change and extend
export enum TopiChatTalkSystemEvents {
  Init = 'system:init'
}
// These events are the events you should change and extend
export enum TopiChatTalkDefaultEvents {
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
    debugText: string;
  };
}

import {RimaAAAService} from '@colabo-rima/f-aaa';

@Injectable()
export class TopiChatTalkService{

  protected serverPubSubCluster: ColaboPubSubCluster = {};
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

    // initialize pub-subs
    for (let topiChatTalkEventId in TopiChatTalkEvents){
      let topiChatTalkEvent: string = TopiChatTalkEvents[topiChatTalkEventId];
      this.serverPubSubCluster[topiChatTalkEvent] = new ColaboPubSub(topiChatTalkEvent);
    }

    // called on init message
    function systemInit(eventName, pluginPackage: TopiChatPluginPackage, tcPackage:TopiChatPackage) {
        console.log('[TopiChatTalkService:systemInit] Client id: %s', tcPackage.clientIdReciever);
        console.log('[TopiChatTalkService:systemInit] tcPackage: %s', JSON.stringify(tcPackage));
    }

  // registering chat plugin to topichat
    let topichatPluginOptions:any = {
      name: MODULE_NAME,
      events: {}
    };
    topichatPluginOptions.events[TopiChatTalkEvents.System] = systemInit.bind(this);

    // register all plugin pubSubs in this.serverPubSubCluster
    for (let topiChatTalkEventId in TopiChatTalkEvents){
      let topiChatTalkEvent: string = TopiChatTalkEvents[topiChatTalkEventId];
      topichatPluginOptions.events[topiChatTalkEvent] = this.dispatchInternalEvents.bind(this);      
    }

    this.topiChatCoreService.registerPlugin(topichatPluginOptions);

  // send system init message
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
      eventName: TopiChatTalkSystemEvents.Init,
      payload: initPayload
    };

    this.topiChatCoreService.emit(TopiChatTalkEvents.System, talkPackage);
  }
  
  dispatchInternalEvents(topiChatTalkEvent: TopiChatTalkEvents, 
    talkPluginPackage: TopiChatPluginPackage, tcPakage: TopiChatPackage){
    // TODO: dispatchEvent is trimming parameters
    // TODO: PubSub should pass all parameters 
    // this.serverPubSubCluster[topiChatTalkEvent].dispatchEvent(talkPluginPackage.eventName, talkPluginPackage, tcPakage);
    this.serverPubSubCluster[topiChatTalkEvent].dispatchEvent(talkPluginPackage.eventName, tcPakage);
  }

  /**
    * Emits message through the eventName
    * @param  {string} eventName [description]
    * @param  {Object} msg - message to be sent
    * @return {TopiChatTalkService}
    */
  emit(topiChatTalkEvent: TopiChatTalkEvents, innerTopiChatTalkEvent: string, payload:any, clientIdReciever?:string) {
    let topiChatTalkPayload: TopiChatPluginPackage = {
      eventName: innerTopiChatTalkEvent,
      payload: payload
    };
    
    this.topiChatCoreService.emit(topiChatTalkEvent, topiChatTalkPayload, clientIdReciever);
  }

  registerPlugin(topiChatTalkEvent: TopiChatTalkEvents, pluginOptions:ColaboPubSubPlugin){
    this.serverPubSubCluster[topiChatTalkEvent].registerPlugin(pluginOptions);
  }
}
