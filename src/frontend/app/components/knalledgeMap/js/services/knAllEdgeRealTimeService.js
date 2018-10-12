/**
* the namespace for the knalledgeMap part of the KnAllEdge system
* @namespace knalledge.knalledgeMap
*/

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var Plugins = window.Config.Plugins;

var knalledgeMapServices = angular.module('knalledgeMapServices');

/**
* @class KnAllEdgeRealTimeService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/
knalledgeMapServices.provider('KnAllEdgeRealTimeService', {
	$get: ['$injector', 'KnalledgeMapPolicyService', 'ChangeService',

	/**
	* @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
	* @constructor
	 * @param  {topiChat.TopiChatService} TopiChatService - lower level topiChat real-time communication service
	 * @param  {knalledge.knalledgeMap.KnalledgeMapPolicyService} KnalledgeMapPolicyService - Service that configures policy aspects of the KnAllEdge system
	 */

	function($injector, KnalledgeMapPolicyService, ChangeService) {

		try{
			var TopiChatService = $injector.get('TopiChatService');
		}catch(err){
			console.warn(err);
		}

		var provider = {
			REQUEST_EVENT : 'REQUEST_EVENT',
			EVENT_NAME_PARTICIPANT_REPLICA : 'PARTICIPANT_REPLICA_REQUEST',
			GlobalEmittersArrayService: null,
			sessionId: null,
			/**
			 * hash array of plugins, where key is the plugin name
			 * @type {Array.<string, Object>}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 */
			plugins: {},
			/**
			 * hash array of plugins organized by events, where key is the event name and value is an array of plugins (options) that have registered for the event
			 * @type {Array.<string, Array.<Object>>}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 */
			eventsByPlugins: {},

			whoAmI: null,
			mapId: null,
			activeUser: null,

			setSessionId: function(part, value){
				switch(part){
						case 'mapId':
							this.sessionId = 'mapId:'+value;
							break;
				}
			},

			setMapId: function(id){
				this.mapId = id;
			},

			/**
			 * Initializes the service.
			 * It registeres itself with bottom topiChat layer to communicate on
			 * 'kn:realtime' stream/event
			 * @function init
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService}
			 */
			init: function(){
				// registering chat plugin

				//this.GlobalEmittersArrayService = $injector.get('GlobalEmittersArrayService');

				if(TopiChatService){
					var knalledgeRealTimeServicePluginOptions = {
						name: "knalledgeRealTimeService",
						events: {
							'kn:realtime': this._dispatchEvent.bind(this)
						}
					};

					TopiChatService.registerPlugin(knalledgeRealTimeServicePluginOptions);
				}
				return this;
			},

			getClientInfo: function(){
				if(TopiChatService) return TopiChatService.clientInfo;
				else return null;
			},

			/**
				returns true if broadcasting should be allowed for specific event on this client
			*/
			filterBroadcasting: function(direction, eventName){
				var emitStructuralChangesByNonBroadcasters = true;
				var structuralChanges = {'node-created':1,'node-updated':1,'node-deleted':1,'nodes-deleted':1,'edge-created':1,'edge-updated':1,'edge-deleted':1,'edges-deleted':1,};
				var stateOrBehaviourChanges = {};
				stateOrBehaviourChanges[puzzles.changes.Event.BRAINSTORMING_CHANGED] = 1;
				stateOrBehaviourChanges[puzzles.changes.Event.SESSION_CREATED] = 1;
				stateOrBehaviourChanges[puzzles.changes.Event.SESSION_CHANGED] = 1;
				stateOrBehaviourChanges[puzzles.changes.Event.REQUEST_EVENT] = 1;

				if(direction == 'in'){
					switch(eventName){
						//navigationalChanges:
						case "node-selected":
						case "node-unselected":
						case "node-clicked":
							return KnalledgeMapPolicyService.provider.config.broadcasting.receiveNavigation;
							break;

						case "view-config-change":
							return KnalledgeMapPolicyService.provider.config.broadcasting.receiveVisualization;
							break;

						//structuralChanges:
						case "node-created":
						case "node-updated":
						case "node-deleted":
						case "nodes-deleted":
						case "edge-created":
						case "edge-updated":
						case "edge-deleted":
						case "edges-deleted":
							return KnalledgeMapPolicyService.provider.config.broadcasting.receiveStructural;
							break;

						case "map-behaviour-change":
						case puzzles.changes.Event.BRAINSTORMING_CHANGED:
						case puzzles.changes.Event.SESSION_CREATED:
						case puzzles.changes.Event.SESSION_CHANGED:
						case this.REQUEST_EVENT:
							return KnalledgeMapPolicyService.provider.config.broadcasting.receiveBehaviours;
					}
					return true;
				}
				else{ //direction = 'out'
					switch(eventName){ //TODO see why this is treated differently:
						case this.REQUEST_EVENT:
							return KnalledgeMapPolicyService.provider.config.mediation.sendRequest;
						break;
					}

					if(!KnalledgeMapPolicyService.provider.config.broadcasting.enabled){//if broadcasting is disabled
						if((emitStructuralChangesByNonBroadcasters && structuralChanges[eventName] != undefined) || //we want to send structural changes by all participant, not only by broadcasting moderators
						stateOrBehaviourChanges[eventName]){ //we want to send behavioral And State changes not only by broadcasting moderators
							return true;
						}
						else{
							return false;
						}
					}
					return true;
				}
			},

			/**
			 * Emits message from higher layer (plugin) to lower layer (topiChat)
			 * to be sent to other knalledge clients
			 * @function emit
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 * @param  {string} eventName
			 * @param  {Object} msg - message to be sent
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService}
			 */
			emit: function(eventName, msg){
				console.log('[KnAllEdgeRealTimeService:emit] eventName: %s, msg:%s', eventName, JSON.stringify(msg));

				if(msg instanceof puzzles.changes.Change){
					msg.iAmId = this.activeUser ? this.activeUser._id : null;
					msg.sender = this.whoAmI ? this.whoAmI._id : null;
					msg.mapId = this.mapId;
					msg.sessionId = this.sessionId;

					// id->reference
					// actionType -> action
					// data -> value
					// actionTime -> updatedAt

					var knPackage = msg;

					ChangeService.create(msg); //.subscribe(error => function(){throw new Error(error);});
					// ChangeService.getOne('577d5cb55be86321489aacaa').subscribe(function(audit){
					// 	// alert("audit: " +
		      //           // JSON.stringify(audit));
					// 		console.log("audit: " +
					// JSON.stringify(audit));
					// },
	        //     	function(error){
					// 	alert("error: " +
		      //           	JSON.stringify(error));
					// });
				}
				else{
					var knPackage = {
						eventName: eventName,
						msg: msg,
						sessionId: this.sessionId,
						sender: this.whoAmI ? this.whoAmI._id : null
					};
				}

				if(this.filterBroadcasting('out',eventName)){
					// socket.emit('tc:chat-message', msg);
					// topiChatSocket.emit('tc:chat-message', msg);
					if(TopiChatService) TopiChatService.emit('kn:realtime', knPackage);
					return this;
				}
			},

			/**
			 * It registers a new plugin
			 * @function registerPlugin
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 * @param  {Object} pluginOptions - plugin options
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService}
			 */
			registerPlugin: function(pluginOptions) {
				var pluginName = pluginOptions.name;
				console.log('[KnAllEdgeRealTimeService:registerPlugin] Registering plugin: %s', pluginName);
				this.plugins[pluginName] = pluginOptions;
				for(var eventName in pluginOptions.events){
					if(!(eventName in this.eventsByPlugins)){
						this.eventsByPlugins[eventName] = [];
					}
					var eventByPlugins = this.eventsByPlugins[eventName];
					eventByPlugins.push(pluginOptions);
				}
				return this;
			},

			/**
			 * It unregisters an existing (registered) plugin
			 * @function revokePlugin
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 * @param  {string} pluginName - plugin name
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService}
			 */
			revokePlugin: function(pluginName) {
				console.log('[KnAllEdgeRealTimeService:registerPlugin] Revoking (unregistering) plugin: %s', pluginName);
				var pluginOptions = this.plugins[pluginName];
				for(var eventName in pluginOptions.events){
					if(eventName in this.eventsByPlugins){
						var eventByPlugins = this.eventsByPlugins[eventName];

						for(var eBp=pluginOptions.events.length-1; eBp<=0; eBp--){
							if(eventByPlugins[eBp].name === pluginName){
									eventByPlugins.splice(eBp, 1);
							}
						}
					}
				}
				delete this.plugins[pluginName];

				return this;
			},

			setWhoAmI: function(whoAmI){
				this.whoAmI = whoAmI;
				if(TopiChatService && TopiChatService.setWhoAmI){
					TopiChatService.setWhoAmI(whoAmI);
				}
			},

			setActiveUser: function(user){
				this.activeUser = user;
			},

			/**
			 *called by TopiChatService when a broadcasted message is received from another client

			 * This method dispatches to the higher layers (plugins)
			 * a message that was received from the bottom layer (topiChat)
			 * @function _dispatchEvent
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 * @param  {string} tcEventName - event name that message received at
			 * @param  {Object} knPackage - knalledge realtime package
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService}
			 */
			_dispatchEvent: function(tcEventName, knPackage) {
				console.log('[KnAllEdgeRealTimeService:_dispatchEvent] tcEventName: %s, knPackage:%s', tcEventName, JSON.stringify(knPackage));

				if(knPackage.sessionId === this.sessionId){ //if both are equal null, the message will pass, but those we probably want, because they are then general ones
					var eventName;
					var msg;
					if(knPackage.hasOwnProperty('valueBeforeChange')){ //this means that this is puzzles.changes.Change
						 msg = puzzles.changes.Change.factory(knPackage);
						 eventName = knPackage.event;
						 ChangeService.received(msg);
					}else{
						msg = knPackage.msg;
						eventName = knPackage.eventName;
					}


					if(this.filterBroadcasting('in',eventName)){
						var eventByPlugins = this.eventsByPlugins[eventName];
						for(var id in eventByPlugins){
							var pluginOptions = eventByPlugins[id];
							var pluginName = pluginOptions.name;

							console.log('\t dispatching to plugin: %s', pluginName);
							var pluginCallback = pluginOptions.events[eventName];
							pluginCallback(eventName, msg);
						}
					}
				}
				else{
					console.log('received KnAllEdgeRealTimeService message from a different session `' + knPackage.sessionId + '`, while our session is `' + this.sessionId + '`');
				}
			}
		};

		provider.init();

		return provider;
	}]
})
;

}()); // end of 'use strict';
