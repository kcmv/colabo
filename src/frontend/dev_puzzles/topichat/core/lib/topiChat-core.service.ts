const MODULE_NAME:string = "@colabo-topichat/f-core";
console.log("topiChat-core.service.ts");

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {ColaboPubSubPlugin, ColaboPubSub} from '@colabo-utils/i-pub-sub';
export {ColaboPubSubPlugin};

export enum TopiChatSystemEvents{
	ClientInit = 'tc:client-init',
  ClientEcho = 'tc:client-echo'
}

export interface TopiChatPluginPackage {
  eventName: string; // a eventName that users of the transport plugins are registering to
  payload: any;
}

export interface TopiChatPackage {
  clientIdSender: string;
  iAmIdSender?: string;
  clientIdReciever: string;
  iAmIdReciever?: string;
  timestamp: number; // TODO: make ie everywhere available
  eventName: string; // the same value as the event name we are listening for / sending to in socket.io
  payload: TopiChatPluginPackage;
}

export interface TopiChatClientInfo{
	clientId: string;
  serverId: string;
}

import * as socketIO from 'socket.io-client';

import {GetPuzzle} from '@colabo-utils/i-config';

import {RimaAAAService} from '@colabo-rima/f-aaa';

@Injectable()
export class TopiChatCoreService{

  clientInfo:TopiChatClientInfo = {clientId: null, serverId: null};

  protected serverPubSub: ColaboPubSub;
  protected _socket;
  protected puzzleConfig:any;

  constructor(
    protected rimaAAAService:RimaAAAService
  ) {
    this.init();
  }

  /**
    * Initializes service
    */
  init() {
      this.puzzleConfig = GetPuzzle(MODULE_NAME);
      this.serverPubSub = new ColaboPubSub("SocketIoPlugins", this.registerNewEventType.bind(this));

      let socketOptions:any = {
        reconnectionDelay: 5000,
        reconnectionDelayMax: 10000,
        timeout: 20000,
        // transports: ['polling', 'websocket'],
        transports: ['websocket'],
        forceNew: false
      };

      if(this.puzzleConfig.path){
        socketOptions.path = this.puzzleConfig.path;
      }
      let socketUrl:string = this.puzzleConfig.socketUrl;
      console.log("[TopiChatService:init] connecting to: ", socketUrl);
      this._socket = socketIO(socketUrl, socketOptions);

      // called on init message
    function clientInit(eventName, pluginPackage: TopiChatPluginPackage, tcPackage:TopiChatPackage) {
          console.log('[TopiChatService:clientInit] Client id: %s', tcPackage.clientIdReciever);
          this.clientInfo.clientId = tcPackage.clientIdReciever;
          this.clientInfo.serverId = tcPackage.clientIdSender;
      }
      // called on helo message
    function clientEcho(eventName, pluginPackage: TopiChatPluginPackage, tcPackage:TopiChatPackage) {
      console.log('[TopiChatService:clientEcho] Client id: %s', tcPackage.clientIdReciever);
      console.log('\t pluginPackage: %s', JSON.stringify(pluginPackage));
      }

      // registering system plugin
      let systemPluginOptions:ColaboPubSubPlugin = {
          name: "system",
          events: {}
      };
      systemPluginOptions.events[TopiChatSystemEvents.ClientInit] = clientInit.bind(this);
      systemPluginOptions.events[TopiChatSystemEvents.ClientEcho] = clientEcho.bind(this);
      this.serverPubSub.registerPlugin(systemPluginOptions);

      var echoPluginPackageReply:TopiChatPluginPackage = {
        eventName: 'default',
        payload: {
          text: "Hello from client!"          
        }
      };
    console.log('[TopiChatService:clientEcho] sending echoPluginPackageReply: %s', JSON.stringify(echoPluginPackageReply));
    this.emit(TopiChatSystemEvents.ClientEcho, echoPluginPackageReply);
  }
  
  registerPlugin(pluginOptions:ColaboPubSubPlugin){
    this.serverPubSub.registerPlugin(pluginOptions);
  }

  /**
    * Emits message through the eventName
    * @param  {string} eventName [description]
    * @param  {Object} msg - message to be sent
    * @return {TopiChatService}
    */
  emit(eventName, pluginPackage: TopiChatPluginPackage, clientIdReciever?:string) {
      // TODO:temp
    // if(eventName === "tc:chat-message" && this.whoAmI){
    //   msg = this.whoAmI.displayName+": "+msg;
    // }
    var tcPackage:TopiChatPackage = {
        clientIdSender: this.clientInfo.clientId,
        iAmIdSender: this.rimaAAAService.getUserId(),
        clientIdReciever: clientIdReciever ? clientIdReciever : this.clientInfo.serverId,
        timestamp: Math.floor(new Date().getTime() / 1000),
        eventName: eventName,
        payload: pluginPackage
    };
    this._socket.emit(eventName, tcPackage);

    return this;
  }


  /**
  * Registers new event type.
  * Every new type has to be registered at the lower layer
  * in order for topiChat to get messages for that event
  * NOTE: it is necessary to register event only for the first plugin that uses it
  * @param  {string} eventName - name of the event we are registering
  */
  registerNewEventType(eventName) {
    console.log("[TopiChatService:registerNewEventType] Registering eventName '%s' for the first time", eventName);
    this._socket.on(eventName, this.serverPubSub.dispatchEvent.bind(this.serverPubSub, eventName));
  }
}
