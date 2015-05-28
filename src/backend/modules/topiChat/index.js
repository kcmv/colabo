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
		this.roomName = roomName;
		this.port = port;
		this.options = options;
		this.http = Http.Server(this.app);
		this.io = Io(this.http);
		this.plugins = {};
		this.eventsByPlugins = {};

		var systemPluginOptions = {
			name: "system",
			events: {
				'tc:chat-message': TopiChat.prototype.userChatMessage.bind(this)				
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
			that.handleUserConnection(socket);
		});

		this.http.listen(this.port, function(){
			console.log('TopiChat is listening on *:%s', that.port);
		});
	};

	TopiChat.prototype.handleUserConnection = function(socket) {
		var that = this;
		console.log('a user connected');

		socket.on('disconnect', function(){
			console.log('user disconnected');
		});

		for(var event in this.eventsByPlugins){
			socket.on(event, TopiChat.prototype.dispatchEvent.bind(this, event));
		}

		socket.on(event, TopiChat.prototype.userChatMessage.bind(this));
	};

	TopiChat.prototype.dispatchEvent = function(eventName, msg) {
		console.log('[dispatchEvent] eventName: %s, msg:%s', eventName, JSON.stringify(msg));
		var eventByPlugins = this.eventsByPlugins[eventName];
		for(var id in eventByPlugins){
			var pluginOptions = eventByPlugins[id];
			var pluginName = pluginOptions.name;

			console.log('\t dispatching to plugin: %s', pluginName);
			var pluginCallback = pluginOptions.events[eventName];
			pluginCallback(msg, eventName);
		}
	};

	TopiChat.prototype.userChatMessage = function(msg, eventName) {
		console.log('event (%s), message received: %s', eventName, JSON.stringify(msg));
		this.io.emit('tc:chat-message', msg); // to everyone
		// socket.broadcast.emit('tc:chat-message', msg); // to everyone except socket owner
	};

	TopiChat.prototype.registerPlugin = function(pluginOptions) {
		var pluginName = pluginOptions.name;
		console.log('Registering plugin: %s', pluginName);
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
		console.log('Unregistering plugin: %s', pluginName);
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
