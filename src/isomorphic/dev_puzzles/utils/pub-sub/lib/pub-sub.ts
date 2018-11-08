export interface ColaboPubSubPlugin{
	name: string;
	events: {[events: string]: Function}
}

export interface ColaboPubSubPlugins{
	[pluginName: string]: ColaboPubSubPlugin
}

export interface ColaboPubSubCluster {
  [clusterName: string]: ColaboPubSub
}

export class ColaboPubSub{
    protected registeredPlugins:ColaboPubSubPlugins = {};

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
    protected messagesByEvents:any = {};


	constructor(public name:string, protected registerNewEventTypeCallback:Function=null){
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
  * @return {ColaboPubSub}
  */
  registerPlugin(pluginOptions:ColaboPubSubPlugin) {
    let pluginName:string = pluginOptions.name;
    console.log('[ColaboPubSub:registerPlugin] Registering plugin: %s', pluginName);
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
  * Registers new event type.
  * Every new type has to be registered at the lower layer
  * in order for topiChat to get messages for that event
  * NOTE: it is necessary to register event only for the first plugin that uses it
  * @param  {string} eventName - name of the event we are registering
  * @return {TopiChatService}
  */
  registerNewEventType(eventName) {
    console.log("[ColaboPubSub:registerNewEventType] Registering eventName '%s' for the first time", eventName);
    this.eventsByPlugins[eventName] = [];
    this.messagesByEvents[eventName] = [];
    if (typeof this.registerNewEventTypeCallback === 'function'){
      this.registerNewEventTypeCallback(eventName);
    }
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
  *     payload: payload
  * };
  * ```
  */
  dispatchEvent(eventName, tcPackage) {
    console.log('[ColaboPubSub:dispatchEvent] eventName: %s, tcPackage:%s', eventName, tcPackage);
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
        pluginCallback(eventName, tcPackage.payload, tcPackage);
      }
    }
  }

  /**
  * returns registered plugins
  * @return {Array<string, Object>} hash array of plugins with plugin name as key, and plugin options as value
  */
  getPlugins() {
    return this.registeredPlugins;
  }

  /**
  * returns registered events
  * @return {Array<string, Object[]>} Hash array of events and list of plugins
  * for each, with key as event list of plugins options
  * for each plugin that registered for the event
  */
  getEvents() {
    return this.eventsByPlugins;
  }

  /**
  * returns messages for particular event
  * @param  {string} eventName - name of the event for which we want messages
  * @return {Array<Object>} messages array
  */
  getMessagesForEvent(eventName) {
    return this.messagesByEvents[eventName];
  }


}