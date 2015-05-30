(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var QUEUE = 
//false;
true;

var removeJsonProtected = function(ENV, jsonStr){
	if(ENV.server.jsonPrefixed && jsonStr.indexOf(ENV.server.jsonPrefixed) === 0){
		jsonStr = jsonStr.substring(ENV.server.jsonPrefixed.length);
	}
	return jsonStr;
};

var topiChatServices = angular.module('topiChatServices', ['ngResource', 'Config']);

topiChatServices.provider('TopiChatViewService', {
	// privateData: "privatno",
	$get: [/*'$q', 'ENV', '$rootScope', */
	function(/*$q , ENV, $rootScope*/) {

				// var that = this;
		var provider = {
			config: {
				messages: {
					showImages: true,
					showTypes: true
				},
				users: {
					showNames: true,
					showImages: true,
					showTypes: true
				}
			}
		};

		return provider;
	}]
});

topiChatServices.provider('TopiChatService', {
	// privateData: "privatno",
	$get: ['socketFactory', '$rootScope', 'ENV', /*'$q', */
	function(socketFactory, $rootScope, ENV /*$q */) {
		// var that = this;

		var _socket;
		var _sfOptions = {
			url: ENV.server.topichat
		};
		_socket = socketFactory(_sfOptions);

		// _socket.forward('broadcast');

		var provider = {
			plugins: {},
			eventsByPlugins: {},
			clientInfo: {
				clientId: null
			},

			init: function(){
				// registering chat plugin
				var systemPluginOptions = {
					name: "system",
					events: {
						'tc:client-init': this.clientInit.bind(this)
					}
				};
				this.registerPlugin(systemPluginOptions);
				var msg = {
					timestamp: Math.floor(new Date())
				};
				this.emit('tc:client-hello', msg);
			},

			clientInit: function(eventName, msg, tcPackage){
				console.log('[TopiChatService:clientInit] Client id: %s', tcPackage.clientId);
				this.clientInfo.clientId = tcPackage.clientId;
			},

			emit: function(eventName, msg){
				var tcPackage = {
					clientId: this.clientId,
					msg: msg
				}
				_socket.emit(eventName, tcPackage);
			},

			registerPlugin: function(pluginOptions) {
				var pluginName = pluginOptions.name;
				console.log('[TopiChatService:registerPlugin] Registering plugin: %s', pluginName);
				this.plugins[pluginName] = pluginOptions;
				for(var eventName in pluginOptions.events){
					if(!(eventName in this.eventsByPlugins)){
						this.eventsByPlugins[eventName] = [];
						this.registerNewEventType(eventName);
					}
					var eventByPlugins = this.eventsByPlugins[eventName];
					eventByPlugins.push(pluginOptions);
				}
			},

			registerNewEventType: function(eventName){
				console.log("[TopiChatService:registerNewEventType] Registering eventName '%s' for the first time", eventName);
				// for(var eventName in this.eventsByPlugins){
					_socket.on(eventName, this.dispatchEvent.bind(this, eventName));
				// }
			},

			dispatchEvent: function(eventName, tcPackage) {
				console.log('[TopiChatService:dispatchEvent] eventName: %s, tcPackage:%s', eventName, JSON.stringify(tcPackage));
				var eventByPlugins = this.eventsByPlugins[eventName];
				for(var id in eventByPlugins){
					var pluginOptions = eventByPlugins[id];
					var pluginName = pluginOptions.name;

					console.log('\t dispatching to plugin: %s', pluginName);
					var pluginCallback = pluginOptions.events[eventName];
					pluginCallback(eventName, tcPackage.msg, tcPackage);
				}
			}
		};

		provider.init();

		return provider;
	}]
});


}()); // end of 'use strict';