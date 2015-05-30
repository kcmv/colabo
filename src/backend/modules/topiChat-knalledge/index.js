'use strict';

var MODULE_NAME = "KnAllEdge";
/**
 * This is the main class, the entry point to TopiChat-KnAllEdge plugin. To use it, you just need to import topiChat-knalledge:
 *
 * ```js
 * var topiChatKnAllEdge = require('topiChat-knalledge');
 * ```
 *
 * In addition to topiChat, the messaging pluginsfor the dialogue dialects you want to use should also be installed in your project
 *
 * @class TopiChatKnAllEdge
 */
module.exports = (function() {

	/**
	* Instantiate topiChat with name of the room and port
	*
	* #### Example usage
	*
	* ```javascript
	* var topiChat = new TopiChatKnAllEdge(topiChat);
	*
	* ```
	*
	* @name TopiChatKnAllEdge
	* @constructor
	* @param {String}	roomName The name of the room
	* @param {Integer}	port number that TopiChatKnAllEdge will listen on
	*/
	var TopiChatKnAllEdge = function(topiChat, options) {
		options = options || {};
		this.topiChat = topiChat;
		this.options = options;
		console.log('TopiChatKnAllEdge injected in the TopiChat room:%s', this.topiChat.getRoomName());
		var pluginOptions = {
			name: MODULE_NAME,
			events: {
				'tc:user-connected': this.userConnected.bind(this),
				'tc:user-disconnected': this.userConnected.bind(this),
				'tc:chat-message': this.chatMessage.bind(this),
				'kn:realtime': this.realtimeMsg.bind(this)		
			}
		};
		this.topiChat.registerPlugin(pluginOptions);
	};

  /**
   * A reference to TopiChatKnAllEdge constructor from topiChat. Useful for accessing DataTypes, Errors etc.
   * @property TopiChatKnAllEdge
   * @see {TopiChatKnAllEdge}
   */
	TopiChatKnAllEdge.prototype.TopiChatKnAllEdge = TopiChatKnAllEdge;

	TopiChatKnAllEdge.prototype.userConnected = function() {
	};

	TopiChatKnAllEdge.prototype.userDisconnected = function() {
	};

	TopiChatKnAllEdge.prototype.chatMessage = function(eventName, msg, clientId, tcPackage) {
		console.log('[TopiChatKnAllEdge] event (%s), message received: %s', eventName, JSON.stringify(msg));
	};

	TopiChatKnAllEdge.prototype.realtimeMsg = function(eventName, msg, clientId, tcPackage) {
		console.log('[TopiChatKnAllEdge] event (%s), realtime knalledge message received from client [%s] : %s', eventName, clientId, JSON.stringify(msg));
		this.topiChat.emit(eventName, msg, clientId);
	};

	/**
	* Returns an instance of QueryInterface.

	* @method getQueryInterface
	* @return {QueryInterface} An instance (singleton) of QueryInterface.
	*
	* @see {QueryInterface}
	*/
	TopiChatKnAllEdge.prototype.connect = function() {
		var that = this;
		this.io.on('connection', function(socket){
			that.handleConnection(socket);
		});

		this.http.listen(this.port, function(){
			console.log('TopiChatKnAllEdge is listening on *:%s', that.port);
		});
	};

	TopiChatKnAllEdge.prototype.handleConnection = function(socket) {
		console.log('a user connected');

		socket.on('disconnect', function(){
			console.log('user disconnected');
		});

		socket.on('chat message', function(msg){
			console.log('message: ' + msg);
			io.emit('chat message', msg); // to everyone
			// socket.broadcast.emit('chat message', msg); // to everyone except socket owner
		});
	};

	TopiChatKnAllEdge.prototype.disconnect = function() {
	};

	return TopiChatKnAllEdge;
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
