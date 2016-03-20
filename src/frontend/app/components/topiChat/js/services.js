(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var topiChatServices = angular.module('topiChatServices', ['ngResource', 'Config']);

/*
topiChatServices.service('TopiChatService', ['socketFactory', '$rootScope', 'ENV',
	function TopiChatServiceProvider(socketFactory, $rootScope, ENV){
	// privateData: "privatno",
	var _isActive = true;

	this.setActive = function(isActive){
		_isActive = isActive;
	};

	// var that = this;

	var _socket;
	var _sfOptions;

	var provider = {
		plugins: {},
		eventsByPlugins: {},
		clientInfo: {
			clientId: null
		},

		init: function(){
			if(!_isActive) return;

			_sfOptions = {
				url: ENV.server.topichat
			};
			_socket = socketFactory(_sfOptions);
			// _socket.forward('broadcast');

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
				clientId: this.clientInfo.clientId,
				msg: msg
			}
			_socket.emit(eventName, tcPackage);
		},

		registerPlugin: function(pluginOptions) {
			if(!_isActive) return;
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
}]);

*/

}()); // end of 'use strict';
