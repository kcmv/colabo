import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

enum TopiChatSystemEvents{
	ClientInit = 'tc:client-init',
  ClientHello = 'tc:client-hello'
}

export interface TopiChatClientInfo{
	clientId: string;
}

export interface TopiChatPlugin{
	name: string;
	events: {[events: string]: Function}
}

export interface TopiChatPlugins{
	[pluginName: string]: TopiChatPlugin
}

import * as socketIO from 'socket.io-client';

@Injectable()
export class TopiChatCoreService{

  protected registeredPlugins:TopiChatPlugins = {};

  /**
  * Hash array of events and list of plugins for each, with key as event name
  * list of plugins options for each plugin that registered for the event
  * @type {Array.<string, Object[]>}
  */
  protected eventsByPlugins:any = {};

  /**
    * Hash array of messages for each event, with key as the event name
    * and list of messages for that event
    * @type {Array.<string, Object[]>}
    */
  messagesByEvents:any = {};

  clientInfo:TopiChatClientInfo = {clientId: null};

  private _isActive:boolean = true;
  private _socket:any;
  private _sfOptions:any;

  //http://api.colabo.space/knodes/
  // "http://127.0.0.1:888/knodes/";
  private apiUrl: string;

  constructor(
    // socketFactory, $rootScope, ENV, _TopiChatConfigService_
    ) {
      // console.log("[TopiChatService] ENV: ", ENV);
      // this.socketFactory = socketFactory;
      // this.$rootScope = $rootScope;
      // this.ENV = ENV;
      // this.topiChatConfigService = _TopiChatConfigService_;

      // a bit dirty (pointless)
      this.init();
  }

  /**
    * Initializes service
    */
  init() {
      if(!this._isActive) return;

      let socketOptions = {forceNew: false};
      let socketUrl:string = 'http://localhost:8002/';
      this._socket = socketIO(socketUrl, socketOptions);
      console.log("[TopiChatService:init] connected to: ", socketUrl);

      // called on init message
      function clientInit(eventName, msg, tcPackage) {
          console.log('[TopiChatService:clientInit] Client id: %s', tcPackage.clientIdReciever);
          this.clientInfo.clientId = tcPackage.clientIdReciever;
      }
      // called on helo message
      function clientHello(eventName, msg, tcPackage) {
          console.log('[TopiChatService:clientHello] Client id: %s', tcPackage.clientIdReciever);
          console.log('\t msg: %s', JSON.stringify(tcPackage.msg));
      }

      // registering system plugin
      let systemPluginOptions:any = {
          name: "system",
          events: {}
      };
      systemPluginOptions.events[TopiChatSystemEvents.ClientInit] = clientInit.bind(this);
      systemPluginOptions.events[TopiChatSystemEvents.ClientHello] = clientHello.bind(this);
      this.registerPlugin(systemPluginOptions);

      var msg:any = {
          timestamp: Math.floor(new Date().getTime() / 1000),
          text: "Hello from client!"
      };
      this.emit(TopiChatSystemEvents.ClientHello, msg);
  }

  /**
    * Emits message through the eventName
    * @param  {string} eventName [description]
    * @param  {Object} msg - message to be sent
    * @return {TopiChatService}
    */
  emit(eventName, msg) {
      // TODO:temp
    // if(eventName === "tc:chat-message" && this.whoAmI){
    //   msg = this.whoAmI.displayName+": "+msg;
    // }
    var tcPackage = {
        clientId: this.clientInfo.clientId,
        msg: msg
    };
    this._socket.emit(eventName, tcPackage);

    return this;
  }

  /**
  * Registers plugin
  *
  * Plugin options example:
  * ```js
  * {
  * 	name: <plugin_name>,
  *  events: {
  * 		event_name_1: callback1,
  * 		event_name_2: callback2,
  * 		...
  * 	}
  * }
  * ```
  * @param  {Object} pluginOptions - options used for plugin registration
  * @return {TopiChatService}
  */
  registerPlugin(pluginOptions:TopiChatPlugin) {
    if(!this._isActive) return;
    let pluginName:string = pluginOptions.name;
    console.log('[TopiChatService:registerPlugin] Registering plugin: %s', pluginName);
    this.registeredPlugins[pluginName] = pluginOptions;
    for(var eventName in pluginOptions.events) {
      if(!(eventName in this.eventsByPlugins)) {
        this.registerNewEventType(eventName);
      }
      var eventByPlugins = this.eventsByPlugins[eventName];
      eventByPlugins.push(pluginOptions);
    }
    return this;
  }

  /**
  * returns registered plugins
  * @return {Array<string, Object>} hash array of plugins with plugin name as key, and plugin options as value
  */
  getPlugins() {
    if(!this._isActive) return undefined;
    return this.registeredPlugins;
  }

  /**
  * returns registered events
  * @return {Array<string, Object[]>} Hash array of events and list of plugins
  * for each, with key as event list of plugins options
  * for each plugin that registered for the event
  */
  getEvents() {
    if(!this._isActive) return undefined;
    return this.eventsByPlugins;
  }

  /**
  * returns messages for particular event
  * @param  {string} eventName - name of the event for which we want messages
  * @return {Array<Object>} messages array
  */
  getMessagesForEvent(eventName) {
    if(!this._isActive) return undefined;
    return this.messagesByEvents[eventName];
  }

  /**
  * Registers new event type.
  * Every new type has to be registered at the lower layer
  * in order for topiChat to get messages for that event
  * NOTE: it is necessary to register event only for the first plugin that uses it
  * @param  {string} eventName - name of the event we are registering
  * @return {TopiChatService}
  */
  registerNewEventType(eventName) {
    this.eventsByPlugins[eventName] = [];
    this.messagesByEvents[eventName] = [];
    console.log("[TopiChatService:registerNewEventType] Registering eventName '%s' for the first time", eventName);
    this._socket.on(eventName, this._dispatchEvent.bind(this, eventName));
    return this;
  }

  /**
  * Dispatches event received from the lower layer
  * to the higher layer listeners (plugins)
  * @param  {string} eventName - name of the event the message/package
  *                            is sent to/through
  * @param  {Object} tcPackage - topic-chat-type of package received
  *                            from other peer
  * it looks like:
  * ```js
  * tcPackage = {
  *     clientId: this.clientInfo.clientId,
  *     msg: msg
  * };
  * ```
  */
  _dispatchEvent(eventName, tcPackage) {
    console.log('[TopiChatService:_dispatchEvent] eventName: %s, tcPackage:%s', eventName, tcPackage);
    // TODO:temp
    // if(this.topiChatConfigService.get().sniffing.globalEnable) {
    //   var msgInfo = {
    //     eventName: eventName,
    //     tcPackage: tcPackage,
    //     time: new Date()
    //   };
    //   this.messagesByEvents[eventName].push(msgInfo);
    // }

    // dispatching message to all plugins that registered for the event
    var eventByPlugins = this.eventsByPlugins[eventName];
    for(var id in eventByPlugins) {
      var pluginOptions = eventByPlugins[id];
      var pluginName = pluginOptions.name;

      console.log('\t dispatching to plugin: %s', pluginName);
      var pluginCallback = pluginOptions.events[eventName];
      if(typeof pluginCallback === 'function') {
        pluginCallback(eventName, tcPackage.msg, tcPackage);
      }
    }
  }
}

//TODO: NG2: migrate here the remaining methods from the old NG1 JS NodeService
