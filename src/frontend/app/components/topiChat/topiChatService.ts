/**
* the namespace for the TopiChat communication system
* @namespace topiChat
*/

import {TopiChatConfigService} from './topiChatConfigService';
/**
* TopiChatService service responsible for communication at the topiChat communication layer
* It supports different streams that communicates across different events that plugins can register to listen for
* @class TopiChatService
* @memberof topiChat
*/
export class TopiChatService {
    /**
     * Registered Plugins
     * @type {Array.<string, Object>}
     */
    registeredPlugins:any = {};

    /**
     * Hash array of events and list of plugins for each, with key as event name
     * list of plugins options for each plugin that registered for the event
     * @type {Array.<string, Object[]>}
     */
    eventsByPlugins:any = {};
    /**
     * Hash array of messages for each event, with key as the event name
     * and list of messages for that event
     * @type {Array.<string, Object[]>}
     */
    messagesByEvents:any = {};

    clientInfo:any = {
        clientId: null
    };

    private _isActive:boolean = true;
    private _socket:any;
    private _sfOptions:any;

    // dependencies
    private socketFactory;
    private $rootScope;
    private ENV;
    private topiChatConfigService:TopiChatConfigService;
    private whoAmI;

    /**
     * Service constructor
     * @constructor
     * @memberof topiChat.TopiChatService
     * @param  socketFactory         [description]
     * @param  $rootScope            [description]
     * @param  {Object} ENV                   [description]
     * @param  {Service} TopiChatConfigService - TopiChat Config service
     */
    constructor(socketFactory, $rootScope, ENV, _TopiChatConfigService_) {
        console.log("[TopiChatService] ENV: ", ENV);
        this.socketFactory = socketFactory;
        this.$rootScope = $rootScope;
        this.ENV = ENV;
        this.topiChatConfigService = _TopiChatConfigService_;

        // a bit dirty (pointless)
        this.init();
    }

    /**
     * Initializes service
     */
    init() {
        if(!this._isActive) return;

        this._sfOptions = {
            url: this.ENV.server.topichat
        };
        this._socket = this.socketFactory(this._sfOptions);
        // this._socket.forward('broadcast');

        // registering chat plugin
        var systemPluginOptions:any = {
            name: "system",
            events: {
                'tc:client-init': this.clientInit.bind(this)
            }
        };

        this.registerPlugin(systemPluginOptions);
        var msg:any = {
            timestamp: Math.floor(new Date().getTime() / 1000)
        };
        this.emit('tc:client-hello', msg);
    }

    setWhoAmI(whoAmI){
      this.whoAmI = whoAmI;
    }

    clientInit(eventName, msg, tcPackage) {
        console.log('[TopiChatService:clientInit] Client id: %s', tcPackage.clientId);
        this.clientInfo.clientId = tcPackage.clientId;
    }

    /**
     * Emits message through the eventName
     * @param  {string} eventName [description]
     * @param  {Object} msg - message to be sent
     * @return {TopiChatService}
     */
    emit(eventName, msg) {
        if(eventName === "tc:chat-message" && this.whoAmI){
          msg = this.whoAmI.displayName+": "+msg;
        }
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
    registerPlugin(pluginOptions) {
        if(!this._isActive) return;
        var pluginName = pluginOptions.name;
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
        // for(var eventName in this.eventsByPlugins){
            this._socket.on(eventName, this._dispatchEvent.bind(this, eventName));
        // }
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
        if(this.topiChatConfigService.get().sniffing.globalEnable) {
            var msgInfo = {
                eventName: eventName,
                tcPackage: tcPackage,
                time: new Date()
            };
            this.messagesByEvents[eventName].push(msgInfo);
        }
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
