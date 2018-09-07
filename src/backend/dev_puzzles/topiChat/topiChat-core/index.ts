'use strict';

let Http = require('http');
import * as express from "express";
import * as socketio from "socket.io";

export interface PluginOptions{
	name: string;
	events: {[events: string]: Function}
}

export interface TopiChatPackage {
	clientIdSender: string;
	msg?: any
}

/* 
SOCKETS
http://localhost:8060/index.html
*/


/**
 * This is the main class, the entry point to TopiChat. To use it, you just need to import topiChat:
 *
 * ```js
 * let TopiChat = require('topiChat');
 * ```
 *
 * In addition to topiChat, the messaging pluginsfor the dialogue dialects you want to use should also be installed in your project
 *
 * @class TopiChat
 */
export class TopiChat{
	protected options:any;
	protected app:any;
	protected ClientID:number;
	protected roomName:string;
	protected port:number;
	protected http: any;
	protected io: any;
	protected plugins:any;
	protected eventsByPlugins:any;
	protected socketIdToClientId:any;
	protected clientIdToSocket:any;

	/**
	* Instantiate topiChat with name of the room and port
	*
	* #### Example usage
	*
	* ```javascript
	* let topiChat = new TopiChat('CollaboScience', 8061);
	*
	* ```
	*
	* @name TopiChat
	* @constructor
	* @param {String}	roomName The name of the room
	* @param {Integer}	port number that TopiChat will listen on
	*/
	constructor(app, roomName, port, options?:any){
		options = options || {};
		this.app = app;
		this.ClientID = 0.0;
		this.roomName = roomName;
		this.port = port;
		this.options = options;
		this.http = Http.Server(this.app);
		this.io = socketio(this.http);
		this.plugins = {};
		this.eventsByPlugins = {};
		this.socketIdToClientId = {};
		this.clientIdToSocket = {};

		let systemPluginOptions:PluginOptions = {
			name: "system",
			events: {
				'tc:chat-message': TopiChat.prototype.clientChatMessage.bind(this),
				'tc:client-hello': TopiChat.prototype.clientHello.bind(this)
			}
		};
		this.registerPlugin(systemPluginOptions);
	}

	/**
	* Returns a room name
	*/
	getRoomName():string {
		return this.roomName;
	}


	/**
	* Returns an instance of QueryInterface.

	* @method getQueryInterface
	* @return {QueryInterface} An instance (singleton) of QueryInterface.
	*
	* @see {QueryInterface}
	*/
	connect() {
		this.io.on('connection', function(socket){
			this.handleClientConnection(socket);
		}.bind(this));

		this.http.listen(this.port, function(){
			console.log('[TopiChat:connect] TopiChat is listening on *:%s', this.port);
		}.bind(this));
	}

	getTimestamp():number {
		return Math.floor(new Date().getTime()/1000);
	}

	generateUniqueClientId():string {
		let _id:number = this.ClientID++;
		let id:string = "" + _id + "_" + this.getTimestamp();
		return id;
	}

	handleClientConnection(socket) {
		let clientId:string = this.generateUniqueClientId();
		console.log('[TopiChat:handleClientConnection] a new client [%s] connected', clientId);
		this.socketIdToClientId[socket.id] = clientId;
		this.clientIdToSocket[clientId] = socket;
		let tcPackage:TopiChatPackage = {
			clientIdSender: clientId
		};
		socket.emit("tc:client-init", tcPackage);

		socket.on('disconnect', this.disconnect.bind(this, socket));

		for(let eventName in this.eventsByPlugins){
			socket.on(eventName, this.dispatchEvent.bind(this, eventName, socket));
		}

		// TODO: should not be necessary (we are already registered through systemPluginOptions)
		// socket.on(eventName, TopiChat.prototype.clientChatMessage.bind(this));
	}

	dispatchEvent(eventName:string, socket, tcPackage) {
		console.log('[TopiChat:dispatchEvent] socket.id: %s', socket.id);
		let clientId:string = this.socketIdToClientId[socket.id];
		console.log('[TopiChat:dispatchEvent] client [%s] eventName: %s, tcPackage:%s', clientId, eventName, JSON.stringify(tcPackage));
		let eventByPlugins = this.eventsByPlugins[eventName];
		let msg = tcPackage.msg;
		for(let id in eventByPlugins){
			let pluginOptions = eventByPlugins[id];
			let pluginName = pluginOptions.name;

			console.log('\t dispatching to plugin: %s', pluginName);
			let pluginCallback = pluginOptions.events[eventName];
			pluginCallback(eventName, msg, clientId, tcPackage);
		}
	}

	emit(eventName:string, msg, clientIdSender) {
		// socket.broadcast.emit('tc:chat-message', msg); // to everyone except socket owner
		let tcPackage:TopiChatPackage = {
			clientIdSender: clientIdSender,
			msg: msg
		};
		console.log('[TopiChat:emit] emitting event (%s) with message: %s', eventName, JSON.stringify(tcPackage));
		// TODO: support option for demanding broadcasting to everyone, even the sender
		// this.io.emit(eventName, tcPackage); // to everyone

		let socketSender = this.clientIdToSocket[clientIdSender];
		socketSender.broadcast.emit(eventName, tcPackage); // to everyone except socket owner
		// socketSender.emit(eventName, tcPackage);
	};

	clientChatMessage(eventName:string, msg, clientId, tcPackage) {
		console.log('[TopiChat:clientChatMessage] event (%s), message received: %s', eventName, JSON.stringify(msg));
		this.emit(eventName, msg, clientId);
		// let socketSender = this.clientIdToSocket[clientIdSender];
		// socketSender.broadcast.emit(eventName, tcPackage); // to everyone except socket owner
		// this.io.emit('tc:chat-message', msg); // to everyone
		// socket.broadcast.emit('tc:chat-message', msg); // to everyone except socket owner
	};

	clientHello(eventName:string, text:string, clientId) {
		console.log('[TopiChat:clientHello] event (%s), clientHello message from client [%s] received: %s', eventName, clientId, text);

		let tcPackage:TopiChatPackage = {
			clientIdSender: clientId,
			msg: {
				timestamp: this.getTimestamp(),
				text: text
			}
		};
		let socket = this.clientIdToSocket[clientId];
		socket.emit("tc:client-init", tcPackage);
	};

	registerPlugin(pluginOptions:PluginOptions) {
		let pluginName = pluginOptions.name;
		console.log('[TopiChat:registerPlugin] Registering plugin: %s', pluginName);
		this.plugins[pluginName] = pluginOptions;
		for(let event in pluginOptions.events){
			if(!(event in this.eventsByPlugins)){
				this.eventsByPlugins[event] = [];
			}
			let eventByPlugins = this.eventsByPlugins[event];
			eventByPlugins.push(pluginOptions);
		}
	};

	// TODO
	unregisterPlugin(pluginName:string) {
		console.log('[TopiChat:unregisterPlugin] Unregistering plugin: %s', pluginName);
	};

	// TODO
	disconnect(socket) {
		let clientId:string = this.socketIdToClientId[socket.id];
		console.log('[TopiChat:handleClientConnection:disconnect] client [%s] disconnected', clientId);

		// TODO: should we remove or keep as "zombie"?
		// this.socketIdToClientId[socket.id] = clientId;
		// this.clientIdToSocket[clientId] = socket;
	};
}