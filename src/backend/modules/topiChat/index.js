'use strict';

var Http = require('http');
var Io = require('socket.io');

/* 
SOCKETS
http://localhost:8060/index.html
*/


/**
 * This is the main class, the entry point to TopiChat. To use it, you just need to import topiChat:
 *
 * ```js
 * var TopiChat = require('topiChat');
 * ```
 *
 * In addition to topiChat, the messaging pluginsfor the dialogue dialects you want to use should also be installed in your project
 *
 * @class TopiChat
 */
module.exports = (function() {

	/**
	* Instantiate topiChat with name of the room and port
	*
	* #### Example usage
	*
	* ```javascript
	* var topiChat = new TopiChat('CollaboScience', 8061);
	*
	* ```
	*
	* @name TopiChat
	* @constructor
	* @param {String}	roomName The name of the room
	* @param {Integer}	port number that TopiChat will listen on
	*/
	var TopiChat = function(app, roomName, port, options) {
		options = options || {};
		this.app = app;
		this.ClientID = 0;
		this.roomName = roomName;
		this.port = port;
		this.options = options;
		this.http = Http.Server(this.app);
		this.io = Io(this.http);
		this.plugins = {};
		this.eventsByPlugins = {};
		this.socketToClientId = {};
		this.clientIdToSocket = {};

		var systemPluginOptions = {
			name: "system",
			events: {
				'tc:chat-message': TopiChat.prototype.clientChatMessage.bind(this),
				'tc:client-hello': TopiChat.prototype.clientHello.bind(this)
			}
		};
		this.registerPlugin(systemPluginOptions);
	};

  /**
   * A reference to TopiChat constructor from topiChat. Useful for accessing DataTypes, Errors etc.
   * @property TopiChat
   * @see {TopiChat}
   */
  TopiChat.prototype.TopiChat = TopiChat;

	/**
	* Returns a room name

	* @method getRoomName
	* @return {String} a room name
	*
	*/
	TopiChat.prototype.getRoomName = function() {
		return this.roomName;
	};

	/**
	* Returns an instance of QueryInterface.

	* @method getQueryInterface
	* @return {QueryInterface} An instance (singleton) of QueryInterface.
	*
	* @see {QueryInterface}
	*/
	TopiChat.prototype.connect = function() {
		var that = this;
		this.io.on('connection', function(socket){
			that.handleClientConnection(socket);
		});

		this.http.listen(this.port, function(){
			console.log('[TopiChat:connect] TopiChat is listening on *:%s', that.port);
		});
	};

	TopiChat.prototype.getTimestamp = function() {
		return Math.floor(new Date());
	}, 
	TopiChat.prototype.generateUniqueClientId = function() {
		var id = this.ClientID++;
		id = "" + id + "_" + this.getTimestamp();
		return id;
	},

	TopiChat.prototype.handleClientConnection = function(socket) {
		var that = this;
		var clientId = this.generateUniqueClientId();
		console.log('[TopiChat:handleClientConnection] a new client [%s] connected', clientId);
		this.socketToClientId[socket.id] = clientId;
		this.clientIdToSocket[clientId] = socket;
		var tcPackage = {
			clientId: clientId
		};
		socket.emit("tc:client-init", tcPackage);

		socket.on('disconnect', function(){
			var clientId = that.socketToClientId[socket.id];
			console.log('[TopiChat:handleClientConnection:disconnect] client [%s] disconnected', clientId);

			// TODO: should we remove or keep as "zombie"?
			// this.socketToClientId[socket.id] = clientId;
			// this.clientIdToSocket[clientId] = socket;
		});

		for(var eventName in this.eventsByPlugins){
			socket.on(eventName, TopiChat.prototype.dispatchEvent.bind(this, eventName, socket));
		}

		// TODO: should not be necessary (we are already registered through systemPluginOptions)
		// socket.on(eventName, TopiChat.prototype.clientChatMessage.bind(this));
	};

	TopiChat.prototype.dispatchEvent = function(eventName, socket, tcPackage) {
		console.log('[TopiChat:dispatchEvent] socket.id: %s', socket.id);
		var clientId = this.socketToClientId[socket.id];
		console.log('[TopiChat:dispatchEvent] client [%s] eventName: %s, tcPackage:%s', clientId, eventName, JSON.stringify(tcPackage));
		var eventByPlugins = this.eventsByPlugins[eventName];
		var msg = tcPackage.msg;
		for(var id in eventByPlugins){
			var pluginOptions = eventByPlugins[id];
			var pluginName = pluginOptions.name;

			console.log('\t dispatching to plugin: %s', pluginName);
			var pluginCallback = pluginOptions.events[eventName];
			pluginCallback(eventName, msg, clientId, tcPackage);
		}
	};

	TopiChat.prototype.emit = function(eventName, msg, clientIdSender) {
		// socket.broadcast.emit('tc:chat-message', msg); // to everyone except socket owner
		var tcPackage = {
			clientIdSender: clientIdSender,
			msg: msg
		};
		console.log('[TopiChat:emit] emitting event (%s) with message: %s', eventName, JSON.stringify(tcPackage));
		// TODO: support option for demanding broadcasting to everyone, even the sender
		// this.io.emit(eventName, tcPackage); // to everyone

		var socketSender = this.clientIdToSocket[clientIdSender];
		socketSender.broadcast.emit(eventName, tcPackage); // to everyone except socket owner
		// socketSender.emit(eventName, tcPackage);
	};

	TopiChat.prototype.clientChatMessage = function(eventName, msg, clientId, tcPackage) {
		console.log('[TopiChat:clientChatMessage] event (%s), message received: %s', eventName, JSON.stringify(msg));
		this.emit(eventName, msg, clientId);
		// var socketSender = this.clientIdToSocket[clientIdSender];
		// socketSender.broadcast.emit(eventName, tcPackage); // to everyone except socket owner
		// this.io.emit('tc:chat-message', msg); // to everyone
		// socket.broadcast.emit('tc:chat-message', msg); // to everyone except socket owner
	};

	TopiChat.prototype.clientHello = function(eventName, msg, clientId, tcPackage) {
		console.log('[TopiChat:clientHello] event (%s), clientHello message from client [%s] received: %s', eventName, clientId, JSON.stringify(msg));

		var tcPackage = {
			clientId: clientId,
			msg: {
				timestamp: this.getTimestamp()
			}
		};
		var socket = this.clientIdToSocket[clientId];
		socket.emit("tc:client-init", tcPackage);
	};

	TopiChat.prototype.registerPlugin = function(pluginOptions) {
		var pluginName = pluginOptions.name;
		console.log('[TopiChat:registerPlugin] Registering plugin: %s', pluginName);
		this.plugins[pluginName] = pluginOptions;
		for(var event in pluginOptions.events){
			if(!(event in this.eventsByPlugins)){
				this.eventsByPlugins[event] = [];
			}
			var eventByPlugins = this.eventsByPlugins[event];
			eventByPlugins.push(pluginOptions);
		}
	};

	TopiChat.prototype.unregisterPlugin = function(pluginName) {
		console.log('[TopiChat:unregisterPlugin] Unregistering plugin: %s', pluginName);
	};

	TopiChat.prototype.disconnect = function() {
	};

	return TopiChat;
})();

// /* 
// REST
// http://localhost:3000/
// */

// app.get('/', function (req, res) {
//     console.log("Greeting the world");
//     res.send('Hello World!');
// });

// var server = app.listen(3000, function () {

//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('Example app listening at http://%s:%s', host, port);

// });
